from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
from datetime import datetime

app = Flask(__name__)
CORS(app)

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
