from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import openai
import os
import re
from decouple import config
from datetime import datetime
from pymongo import MongoClient
from flask_jwt_extended import JWTManager,create_access_token

app = Flask(__name__)
app.config['SECRET_KEY'] = "MySuperSecretKey123!$%*^&"
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400
openaikey = config('OPENAI_API_KEY')


# Establish a MongoDB connection and get the "LeedCode" database
client = MongoClient('mongodb+srv://lazim:lazim@cluster0.inykpf1.mongodb.net/?retryWrites=true&w=majority')
db = client.get_database('LeedCode')
jwt = JWTManager(app)
CORS(app)



@app.route('/login', methods=['POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        user = db.users.find_one({"username": username})

        if user and user.get('password') == password:  # Use get() method to safely access the password
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

    # Get the current timestamp
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    response_data = {
        'output': output,
        'error': error,
        'compilation_info': f'Compiled and executed at {timestamp}',
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




if __name__ == '__main__':
    app.run()
