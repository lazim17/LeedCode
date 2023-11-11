FROM python:3.11.6

WORKDIR /usr/server/app

ENV FLASK_APP=app.py
ENV FLASK_ENV=development

COPY ./requirements.txt .

RUN pip install -r requirements.txt

COPY . .

CMD [ "python","app.py" ]



