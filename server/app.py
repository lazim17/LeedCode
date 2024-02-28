from flask import Flask, request, jsonify, render_template_string
from flask_cors import CORS
import subprocess
import openai
import os
import random
import string
import re
from celery import Celery
from itsdangerous import URLSafeTimedSerializer,SignatureExpired
from decouple import config
from pymongo import MongoClient
from flask_jwt_extended import JWTManager,create_access_token,jwt_required, get_jwt_identity
from tasks import generateqinfo,check_status,celery
from bson import ObjectId
from flask_mail import Mail,Message

app = Flask(__name__)

app.config['SECRET_KEY'] = "MySuperSecretKey123!$%*^&"

app.config['MAIL_SERVER'] = "smtp.googlemail.com"

app.config['MAIL_PORT'] = 587

app.config['MAIL_USE_TLS'] = True

app.config['MAIL_USERNAME'] = "internshipleadsoc@gmail.com"

app.config['MAIL_PASSWORD'] = "pzxu uqib wcmk ddiu "

mail = Mail(app)

serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
openaikey = config('OPENAI_API_KEY')



client = MongoClient('mongodb+srv://lazim:lazim@cluster0.inykpf1.mongodb.net/?retryWrites=true&w=majority')
db = client.get_database('LeedCode')
jwt = JWTManager(app)
CORS(app)


celery = Celery(
    'app',
    broker='redis://localhost:6379/2',
    backend='redis://localhost:6379/3'
)



@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        user = db.users.find_one({"username": username})

        if user and user.get('password') == password:  
            token = create_access_token(identity=str(user['_id']))
            role = user.get('role')
            return jsonify({"token": token, "role":role}),200
        else:
            return jsonify({"message": "Invalid credentials"}), 401

    





@app.route('/generateq',methods = ['POST'])
def generateq():
    data = request.get_json()
    description = data.get('body', '')
    openai.api_key = openaikey

    system_msg = (
        "You are a machine who generates 15 coding questions whose answers are functions with string and integer manipulation"
        )
    
    user_msg = "Generate 15 moderate to very hard coding questions that makes functions and can be written in all the major languages (only questions and dont tell which language) which should help determine the suitability of an applicant for a job with the description : " + description + ". no need of examples,generate only questions"

    response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            temperature=1
        )

    questionlist = response['choices'][0]['message']['content']

    lines = questionlist.split('\n')
    questions = []

    for line in lines:
        question = re.sub(r'^\d+\.\s*', '', line).strip()
        if question:
            questions.append(question)
    
    return jsonify({'questions': questions})
    

@app.route('/qinfo', methods=['POST'])
def qinfo():
    data = request.get_json()
    examid = data.get('examid')
    userid = data.get('userid')
    print(f"Received exam ID from JSON: {examid}")
    print(f"Received user ID from JSON: {userid}")
    details = {'examId': examid, 'userId': userid}
    print(f"Details dictionary before calling Celery task: {details}")
    task = generateqinfo.apply_async(args=[details])

    return jsonify({'task_id': task.id}), 200

@app.route('/check_status/<task_id>', methods=['GET'])
def handle_check_status(task_id):
    result = check_status(task_id)
    return result

@app.route('/form', methods=['POST'])
@jwt_required()
def formsubmit():
    try:
        # Get the user identity from the JWT
        user_id = get_jwt_identity()

        # Extract data from the JSON request
        data = request.get_json()

        # Extract relevant data for employer
        company = data.get('formData', {}).get('companyName')
        role = data.get('formData', {}).get('jobRole')
        regstart = data.get('formData', {}).get('registrationStartDate')
        regend = data.get('formData', {}).get('registrationEndDate')
        startdate = data.get('formData', {}).get('examStartDate')
        questions = data.get('questions', [])

        existing_employer = db['Employer'].find_one({"name": company})

        new_exam_id = ObjectId()
        new_question_ids = [ObjectId() for _ in questions]

        if existing_employer:
            print(existing_employer)
            new_exam = {
                "exam_id": new_exam_id,
                "role": role,
                "regstart":regstart,
                "regend":regend,
                "examstart":startdate,
                "questions": [
                    {
                        "question_id": question_id,
                        "text": question,
                        'examples': [],
                        'constraints': []
                    } for question_id, question in zip(new_question_ids, questions)
                ]
            }

            result = db['Employer'].update_one(
                {"name": company},
                {"$push": {"exams": new_exam}}
            )

            if result.acknowledged:
                return jsonify({
                    "message": "Form submitted successfully",
                    "userid": str(user_id),
                    "examid": str(new_exam_id)
                }), 201
            else:
                return jsonify({"message": "Failed to update existing employer"}), 500

        else:
            employer_document = {
                "_id": ObjectId(user_id),
                "name": company,
                "exams": [
                    {
                        "exam_id": new_exam_id,
                        "role": role,
                        "regstart":regstart,
                        "regend":regend,
                        "examstart":startdate,
                        "questions": [
                            {
                                "question_id": question_id,
                                "text": question,
                                'examples': [],
                                'constraints': []
                            } for question_id, question in zip(new_question_ids, questions)
                        ]
                    }
                ]
            }

            result = db['Employer'].insert_one(employer_document)

            if result.acknowledged:
                return jsonify({
                    "message": "Form submitted successfully",
                    "userid": str(user_id),
                    "examid": str(new_exam_id)
                }), 201
            else:
                return jsonify({"message": "Failed to insert new employer"}), 500

    except Exception as e:
        return jsonify({"message": str(e)}), 500

        


# Update the route to match the endpoint used in the React component
@app.route('/empdashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        # Get the user identity from the JWT
        user_id = get_jwt_identity()

        # Retrieve exam details for the user from the database
        user_exams = db['Employer'].find_one({"_id": ObjectId(user_id)}, {"exams": 1})

        if user_exams:
            exams_data = user_exams.get('exams', [])
            formatted_exams = []

            for exam in exams_data:
                formatted_exam = {
                    "userid": str(user_id),
                    "exam_id": str(exam['exam_id']),
                    "role": exam.get('role'),
                    "regstart":exam.get('regstart'),
                    "regend":exam.get('regend'),
                    "examstart":exam.get('examstart'),
                    "questions": [
                        {
                            "question_id": str(question['question_id']),
                            "text": question.get('text'),
                            "examples": question.get('examples', []),
                            "constraints": question.get('constraints', [])
                        } for question in exam.get('questions', [])
                    ]
                }
                formatted_exams.append(formatted_exam)

            return jsonify({"examDetails": formatted_exams}), 200

        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        return jsonify({"message": str(e)}), 500


from flask import jsonify
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity

@app.route('/applicantdashboard', methods=['GET'])
@jwt_required()
def appdashboard():
    try:
        # Get the user identity from the JWT
        user_id = get_jwt_identity()
        print(user_id)

        # Retrieve exam details for the user from the Applicant database
        applicant = db['Applicants'].find_one({"_id": ObjectId(user_id)})

        if applicant:
            
            exam_details = []
            
            # Iterate through the exam IDs in the applicant's document
            for exam_id in applicant.get('exams', []):
                # Retrieve exam details from the Employer database using the exam ID
                employer_exam = db['Employer'].find_one(
                    {"exams.exam_id": ObjectId(exam_id)},
                    {"_id": 0, "name": 1, "exams.$": 1}
                )
                

                # Append the relevant exam details to the list
                if employer_exam and employer_exam.get('exams'):
                    exam_details.append({
                        "examid":str(employer_exam['exams'][0]['exam_id']),
                        "name": employer_exam.get('name', ''),
                        "role": employer_exam['exams'][0]['role'],
                        "examstart": employer_exam['exams'][0]['examstart']
                    })

            return jsonify({"appliedExams": exam_details})

        return jsonify({"message": "Applicant not found"}), 404

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
        



def temppassword(first_name, last_name):
    
    temp_password = f"{first_name.lower()}{last_name.lower()}{''.join(random.choices(string.ascii_letters + string.digits, k=6))}"

    return temp_password


@app.route('/emaildecrypt', methods=['POST'])
def emaildecrypt():
    token = request.get_json()

    try:

        email = serializer.loads(token, max_age=3600).get('email')
        return jsonify({'success': True, 'email': email})
    except SignatureExpired:
        return jsonify({'success': False, 'message': 'Token has expired.'})
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})




@app.route('/studentregs', methods=['POST'])
def apply():
    try:
        data = request.get_json()
        employer_id = data.get('employerId')
        exam_id = data.get('examid')
        form_data = data.get('formData', {})

        fname = form_data.get('fname')
        lname = form_data.get('lname')
        email = form_data.get('email')

        # Check if the applicant with the given email already exists
        existing_applicant = db['users'].find_one({"email": email})

        if existing_applicant:
            # Applicant already exists, update relevant information
            user_id = existing_applicant["_id"]

            # Update the information in the Applicants collection
            db['Applicants'].update_one(
                {"_id": user_id},
                {"$push": {"exams": ObjectId(exam_id)}}
            )

            # Update the information in the Employer collection
            db['Employer'].update_one(
                {"exams.exam_id": ObjectId(exam_id)},
                {"$push": {"exams.$.applicants": user_id}}
            )
        else:
            # Applicant doesn't exist, create new records
            password = temppassword(fname, lname)
            token = serializer.dumps({'email': email, 'exp': 3600})

            user_data = {
                "username": email,
                "password": password,
                "role": "student",
                "email": email,
                "fname": fname,
                "lname": lname
            }

            user_insert = db['users'].insert_one(user_data)
            new_user_id = user_insert.inserted_id

            applicants_data = {
                "_id": new_user_id,
                "fname": fname,
                "lname": lname,
            }

            # Insert a new record in the Applicants collection
            applicants_insert = db['Applicants'].insert_one(applicants_data)

            # Link the applicant to the specified exam in both the Applicants and Employer collections
            db['Applicants'].update_one(
                {"_id": new_user_id},
                {"$push": {"exams": ObjectId(exam_id)}}
            )

            db['Employer'].update_one(
                {"exams.exam_id": ObjectId(exam_id)},
                {"$push": {"exams.$.applicants": new_user_id}}
            )

            # Send the email
            send_async_email.apply_async(args=[email, password, token, fname])

        return jsonify({'success': True, 'message': 'User registered successfully'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})




@celery.task
def send_async_email(email,password,token,fname):
    html_content = '''
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login Details and Verification</title>
            <style>
                /* Your existing CSS styles */
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Login Details and Verification</h2>
                <p>Hello {fname},</p>
                <p>Thank you for registering for the [Exam Name] exam. Below are your login details:</p>
                <ul>
                    <li><strong>Username:</strong> {email}</li>
                    <li><strong>Password:</strong> {password}</li>
                </ul>
                <p>For security reasons, we recommend changing your password. Click the button below to set a new password:</p>
                <a href="{link}/{token}">Change Password</a>
                <p>If you did not register for this exam or have any concerns, please contact us immediately.</p>
                <p class="footer">Best regards,<br>Your Organization Name</p>
            </div>
        </body>
        </html>

        '''
    link = "http://localhost:3000/change-password"
        # Format the HTML content with dynamic values
    html_content = html_content.format(email=email, password=password,token=token,fname=fname, link=link)

        # Create the Message object
    message = Message(
            subject='Registration',
            recipients=[email],
            sender='noreply@leadsoc.com',
            html=html_content  # Include the HTML content here
    )
    with app.app_context():
      mail.send(message)  


@app.route('/changepassword', methods=['POST'])
def change_password():
    try:
        data = request.get_json()
        username = data.get('username')
        current_password = data.get('currentPassword')
        new_password = data.get('newPassword')

        # Get the user from the database
        user = db['users'].find_one({'username': username})

        if user and user['password'] == current_password:
            # Update the password
            db['users'].update_one({'username': username}, {'$set': {'password': new_password}})
            return jsonify({'success': True, 'message': 'Password changed successfully'})

        return jsonify({'success': False, 'message': 'Invalid credentials'})

    except Exception as e:
        return jsonify({'success': False, 'message': str(e)})


@app.route('/codeeditorinput',methods=['POST'])
def codeeditorinput():
    data = request.get_json()
    exam=data.get('examid')
    employer = db['Employer'].find_one(
                    {"exams.exam_id": ObjectId(exam)},
                    {"exams.$": 1}
                )
    formatted = []

    if employer:
        questions = None
        for ex in employer['exams']:
            if str(exam)==str(ex['exam_id']):
                questions = ex['questions']
                break
        if questions:
            # Randomly select 6 questions
            random_questions = random.sample(questions, min(6, len(questions)))

            # Prepare response
            response_data = {
                'questions': random_questions
            }
            
            for item in questions:
                item['question_id'] = str(item['question_id'])

            ids = [item['question_id'] for item in questions]
            question = [item['text'] for item in questions]
            examples = [item['examples'] for item in questions]
            constraints = [item['constraints'] for item in questions]

            return jsonify({'ids':ids,'question':question,'examples':examples,'constraints':constraints}), 200
        else:
            return jsonify({'message': 'Questions not found for the exam'}), 404
    else:
        print("kitteeela")
        return jsonify({'message': 'Exam not found'}), 404
    




#CODE-EDITOR
@app.route('/run', methods=['POST'])
def run_code():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', '')

    output = ''
    error = ''

    if language == 'python':
        try:
            result = subprocess.run(['python', '-c', code], capture_output=True, text=True, timeout=10)
            output = result.stdout
            if result.returncode != 0:
                error = result.stderr
        except subprocess.CalledProcessError as e:
            error = e.stderr
        except subprocess.TimeoutExpired as e:
            output = 'Timeout Error'
            error = e.stderr
        except Exception as e:
            error = str(e)
    elif language == 'cpp':
        try:
            result = subprocess.run(['g++', '-o', 'cpp_program', '-x', 'c++', '-', '-std=c++11'], input=code, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                output = subprocess.run(['./cpp_program'], capture_output=True, text=True, timeout=10).stdout
            else:
                error = result.stderr
        except subprocess.TimeoutExpired as e:
            output = 'Timeout Error'
            error = e.stderr
        except Exception as e:
            error = str(e)
    elif language == 'java':
        try:

            class_name = extract_main_class_name(code)
        # Save the Java code to a file
            filepath = class_name + ".java"
            with open(filepath, 'w') as file:
                file.write(code)

            # Compile Java code
            result = subprocess.run(['javac', filepath], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                # Execute Java program
                output = subprocess.run(['java', class_name], capture_output=True, text=True, timeout=10).stdout
            else:
                error = result.stderr

        except subprocess.TimeoutExpired as e:
            output = 'Timeout Error'
            error = e.stderr
        except Exception as e:
            error = str(e)

    response_data = {
        'output': output,
        'error': error,
        
    }


    return jsonify(response_data)


@app.route('/compile', methods=['POST'])
def compile_code():
    data = request.get_json()
    code = data.get('code', '')
    language = data.get('language', '')

    if language == 'cpp':
        try:
            result = subprocess.run(['g++', '-o', 'cpp_program', '-x', 'c++', '-', '-std=c++11'], input=code, capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                return 'Compilation Successful'
            else:
                return result.stderr
        except subprocess.TimeoutExpired as e:
            return 'Timeout Error'
        except Exception as e:
            return 'An error occurred'
    elif language == 'java':
        try:

            class_name = extract_main_class_name(code)
        # Save the Java code to a file
            filepath = class_name + ".java"
            with open(filepath, 'w') as file:
                file.write(code)

        # Compile Java code
            result = subprocess.run(['javac', filepath], capture_output=True, text=True, timeout=10)
            if result.returncode == 0:
                return 'Compilation Successful'
            else:
                return result.stderr

        except subprocess.TimeoutExpired as e:
            return 'Timeout Error'
        except Exception as e:
            return 'An error occurred'

def extract_main_class_name(code):
    try:
        # Use a regular expression to find the class with the main method
        match = re.search(r'public\s+class\s+(\w+)\s*\{[^}]*\bpublic\s+static\s+void\s+main\s*\(', code)
        if match:
            return match.group(1)
        else:
            # If no main class is found, return the first class found
            match = re.search(r'public\s+class\s+(\w+)', code) or re.search(r'class\s+(\w+)', code)
            return match.group(1) if match else None

    except Exception as e:
        print(f'Error extracting main class name: {str(e)}')
        return None


if __name__ == '__main__':
    app.run(port=5000)
