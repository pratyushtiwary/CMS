from flask import Blueprint, request, abort, Response
from api.login import login
from api.register import register
from api.forgetPassword import forgetPassword
from api.sendotp import sendotp
from utils.validate import exists
from models.employee import Employee
from flask_cors import CORS, cross_origin
from utils.auth import auth
from globals import url


# ---------------
# |   Extras    |
# ---------------
from api.fetch.departments import fetchDepartments
from api.fetch.latestAnnouncement import latestAnnouncement


# ---------------
# |  Employees  |
# ---------------
from api.employee.newComplaint import newComplaint
from api.employee.getComplaintsByStatus import getComplaintsByStatus
from api.employee.loadAnnouncements import loadAnnouncements
from api.employee.getComplaints import getComplaints
from api.employee.repostComplaint import repostComplaint
from api.employee.updateComplaint import updateComplaint



api = Blueprint("api",__name__,url_prefix="/api")
CORS(api)

@api.route("/login",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
def Login():
	if request.method == "POST":
		req = request.json
		return login(req)

	return abort(405)
		
@api.route("/sendotp",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
def sendOTP():
	if request.method == "POST":
		req = request.json
		return sendotp(req)
	return abort(405)

@api.route("/register",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
def Register():
	if request.method == "POST":
		req = request.json
		return register(req)
	return abort(405)

@api.route("/forget_password",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
def forgetpassword():
	if request.method == "POST":
		req = request.json
		return forgetPassword(req)
	return abort(405)




# ---------------
# |   Extras    |
# ---------------

@api.route("/fetch/departments",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def fetchdepartments():
	if request.method == "POST":
		return fetchDepartments()
	return abort(405)


@api.route("/fetch/latestAnnouncement",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def latestannouncement():
	if request.method == "POST":
		return latestAnnouncement()
	return abort(405)



# ---------------
# |  Employees  |
# ---------------

@api.route("/employee/newComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def newcomplaint():
	if request.method == "POST":
		return newComplaint()
	return abort(405)


@api.route("/employee/getComplaintsByStatus",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def getcomplaintsbystatus():
	if request.method == "POST":
		req = request.json
		return getComplaintsByStatus(req)
	return abort(405)

@api.route("/employee/loadAnnouncements",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def loadannouncements():
	if request.method == "POST":
		req = request.json
		return loadAnnouncements(req)
	return abort(405)

@api.route("/employee/getComplaints",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def getcomplaints():
	if request.method == "POST":
		req = request.json
		return getComplaints(req)
	return abort(405)

@api.route("/employee/repostComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def repostcomplaint():
	if request.method == "POST":
		return repostComplaint()
	return abort(405)

@api.route("/employee/updateComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@auth
def updatecomplaint():
	if request.method == "POST":
		return updateComplaint()
	return abort(405)