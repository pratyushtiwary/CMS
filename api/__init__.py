from flask import Blueprint, request, abort, Response
from api.login import login
from api.register import register
from api.forgetPassword import forgetPassword
from api.sendotp import sendotp
from utils.validate import exists
from models.employee import Employee
from flask_cors import CORS, cross_origin
from utils.auth import auth


# ---------------
# |   Extras    |
# ---------------
from api.fetch.departments import fetchDepartments


# ---------------
# |  Employees  |
# ---------------
from api.employee.newComplaint import newComplaint



api = Blueprint("api",__name__,url_prefix="/api")
CORS(api)

@api.route("/login",methods=["POST","GET"])
@cross_origin(origin = ["http://localhost:3000"],methods = ["GET","POST"])
def Login():
	if request.method == "POST":
		req = request.json
		return login(req)

	return abort(405)
		
@api.route("/sendotp",methods=["POST","GET"])
@cross_origin(origin = ["http://localhost:3000"],methods = ["GET","POST"])
def sendOTP():
	if request.method == "POST":
		req = request.json
		return sendotp(req)
	return abort(405)

@api.route("/register",methods=["POST","GET"])
@cross_origin(origin = ["http://localhost:3000"],methods = ["GET","POST"])
def Register():
	if request.method == "POST":
		req = request.json
		return register(req)
	return abort(405)

@api.route("/forget_password",methods=["POST","GET"])
@cross_origin(origin = ["http://localhost:3000"],methods = ["GET","POST"])
def forgetpassword():
	if request.method == "POST":
		req = request.json
		return forgetPassword(req)
	return abort(405)


# ---------------
# |   Extras    |
# ---------------

@api.route("/fetch/departments",methods=["POST","GET"])
@cross_origin(origin = ["http://localhost:3000"],methods = ["GET","POST"])
@auth
def fetchdepartments():
	if request.method == "POST":
		return fetchDepartments()
	return abort(405)

# ---------------
# |  Employees  |
# ---------------
@api.route("/employee/new_complaint",methods=["POST","GET"])
@cross_origin(origin = ["http://localhost:3000"],methods = ["GET","POST"])
@auth
def newcomplaint():
	if request.method == "POST":
		return newComplaint()
	return abort(405)