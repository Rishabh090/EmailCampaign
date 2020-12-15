from __future__ import print_function # In python 2.7
import os
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
import bson
from threading import Thread
from flask_cors import CORS
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from tablib import Dataset
import io
import json
import csv
from flask_mail import Mail,Message
import xlrd
import sys

app = Flask(__name__)
app.config.from_object(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/EmailContents"
mongo = PyMongo(app)
CORS(app)
app.config['SECRET_KEY'] = 'top-secret!'
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = ""
app.config['MAIL_DEFAULT_SENDER'] = "rishabh09chauhan09@gmail.com"
mail = Mail(app)

@app.route('/')
def home():
	return "Hello"

@app.route('/api/getemails', methods = ['POST','GET'])
def getEmails():
	print("Inside get emails")
	print(request)
	data = mongo.db.emailbodies.find()
	body =[]
	for usermail in data:
		if(usermail['state']== 1):
			body.append({'emailbody': usermail['body'],'subject': usermail['subject']})
	josnresult = { 'emails' : body}
	return jsonify(josnresult)

@app.route('/api/getdraftdata', methods = ['POST','GET'])
def getDraftdata():
	print("Inside get email draft data")
	print(request)
	id = request.args.get('id', '')
	print(id)
	data = mongo.db.emailbodies.find( {'_id':bson.ObjectId(oid=str(id))})
	body =[]
	for usermail in data:
		if(usermail['state']== 0):
			body.append({'emailbody': usermail['body'],'subject': usermail['subject'],'id':str(usermail['_id'])})
	jsonresult = { 'emails' : body}
	return jsonify(jsonresult)


@app.route('/api/getdrafts', methods = ['POST','GET'])
def getDrafts():
	print("Inside get email draft")
	print(request)
	data = mongo.db.emailbodies.find()
	body =[]
	for usermail in data:
		if(usermail['state']== 0):
			body.append({'emailbody': usermail['body'],'subject': usermail['subject'],'id':str(usermail['_id'])})
	jsonresult = { 'emails' : body}
	return jsonify(jsonresult)

@app.route('/result', methods = ['POST'])
def result():
	print('Hello world!', file=sys.stderr)
	email = request.json
	print(email['emailBody'], file=sys.stderr)
	print('Hello world!', file=sys.stderr)
	if email:
		loc = ('./Book.xlsx')
		wb = xlrd.open_workbook(loc)
		sheet = wb.sheet_by_index(0)
		sheet.cell_value(0, 0)
		rec = []
		for i in range(1,sheet.nrows):
			print(sheet.cell_value(i, 0))
			rec.append(sheet.cell_value(i, 0))
		msg = Message('Email Test',recipients=rec)
		msg.body = email['emailBody']
		msg.html = '<p>Test</p>'
		print(email['emailBody'], file=sys.stderr)
		mail.send(msg)
		print(email['emailBody'], file=sys.stderr)
		return email['emailBody']

@app.route('/api/saveDraft', methods = ['POST','GET'])
def saveDraft():
	print(request)
	email=(request.form.get('emailBody'))
	f = request.files['file']
	subject = (request.form.get('emailSub'))
	print(email)
	# email = request.files['email']
	print(f)
	stream = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
	csv_input = csv.reader(stream)
    #print("file contents: ", file_contents)
    #print(type(file_contents))
	rec = []
	print(csv_input)
	for row in csv_input:
		print(row)
		if(row[0].find('@') != -1):
			rec.append(row[0])
			print(row[0])
	email_data = { "body": email , "subject":subject , "state" : 0}
	online_users = mongo.db.users.find()
	mongo.db.emailbodies.insert(email_data)
	data = mongo.db.emailbodies.find().sort("_id",-1).limit(1);
	id = ''
	for usermail in data:
		id = str(usermail['_id'])
	userdata = {"state":0 , "users" : rec , "email_id": id}
	mongo.db.users.insert(userdata)
	return email
	# raw_data = request.files['file'].read()  # In form data, I used "myfile" as key.
	# dataset = Dataset().load(raw_data)

@app.route('/api/upload', methods = ['POST','GET'])
def upload_file():
	print("asd")
	print(request)
	email=(request.form.get('emailBody'))
	f = request.files['file']
	subject = (request.form.get('emailSub'))
	print(email)
	# email = request.files['email']
	print(f)
	stream = io.StringIO(f.stream.read().decode("UTF8"), newline=None)
	csv_input = csv.reader(stream)
    #print("file contents: ", file_contents)
    #print(type(file_contents))
	rec = []
	print(csv_input)
	for row in csv_input:
		print(row)
		if(row[0].find('@') != -1):
			rec.append(row[0])
			print(row[0])
	msg = Message(subject,recipients=rec)
	msg.body = email
	# msg.html = '<p>Test</p>'
	print(email, file=sys.stderr)
	thr = Thread(target=send_async_email, args=[app, msg])
	thr.start()
	# mail.send(msg)
	print(email, file=sys.stderr)
	email_data = { "body": email , "subject":subject , "state" : 1}
	online_users = mongo.db.users.find()
	mongo.db.emailbodies.insert(email_data)
	data = mongo.db.emailbodies.find().sort([('timestamp', -1)]).limit(1)
	id = ''
	for usermail in data:
		id = str(usermail['_id'])
	userdata = {"state":1 , "users" : rec , "email_id": id}
	mongo.db.users.insert(userdata)
	print((online_users), file=sys.stderr)
	for doc in online_users:
		if(doc['email_id']==id):
			print((doc['state']), file=sys.stderr)
	return email
	# raw_data = request.files['file'].read()  # In form data, I used "myfile" as key.
	# dataset = Dataset().load(raw_data)
	return f.name

def send_async_email(app, msg):
	with app.app_context():
		print("in thread")
		mail.send(msg)