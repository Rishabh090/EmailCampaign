import os
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mail import Mail,Message
import xlrd

app = Flask(__name__)
app.config['SECRET_KEY'] = 'top-secret!'
app.config['MAIL_SERVER'] = 'smtp.sendgrid.net'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'apikey'
app.config['MAIL_PASSWORD'] = "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"
app.config['MAIL_DEFAULT_SENDER'] = "rishabh09chauhan09@gmail.com"
mail = Mail(app)

@app.route('/')
def home():
	loc = ('./Book.xlsx')
	wb = xlrd.open_workbook(loc)
	sheet = wb.sheet_by_index(0)
	sheet.cell_value(0, 0)
	rec = []
	for i in range(1,sheet.nrows):
		print(sheet.cell_value(i, 0))
		rec.append(sheet.cell_value(i, 0))
	msg = Message('Email Test',recipients=rec)
	msg.body = 'This is test email'
	msg.html = '<p>Test</p>'
	mail.send(msg)
	return "Hello"