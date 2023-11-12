# tasks.py
from celery import Celery
from celery.result import AsyncResult
import pymongo
import openai
from flask import jsonify
from decouple import config

openaikey = config('OPENAI_API_KEY')

celery = Celery(
    'tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/1'
)



@celery.task()
def generateqinfo(questions):
    client = pymongo.MongoClient("mongodb+srv://lazim:lazim@cluster0.inykpf1.mongodb.net/?retryWrites=true&w=majority")
    openai.api_key = openaikey

    db = client["LeedCode"]
    collection = db["questions"]

    for question in questions:
        system_msg = "you are an AI machine that provides suitable examples and constraints for a given coding question"
        user_msg = "provide examples and constraints in the format (examples: 'example', constraints: 'constraints') for the given programming question: " + question

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user", "content": user_msg}
            ],
            temperature=0.1
        )

        content = response['choices'][0]['message']['content']
        sections = content.strip().split("Examples:")
        constraints = sections[1].strip().split("Constraints:")
        examples = constraints[0].strip()
        constr = constraints[1].strip()

        document = {
                "question": question,
                "examples": examples,
                "constraints": constr
            }

            # Insert the document into MongoDB
        collection.insert_one(document)

def check_status(task_id):
    try:
        task_result = AsyncResult(task_id, app=celery)
        if task_result.ready():
            return jsonify({'status': 'success', 'result': task_result.result}), 200
        elif task_result.state == 'PENDING':
            return jsonify({'status': 'pending'}), 202
        else:
            return jsonify({'status': 'in progress'}), 202
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500