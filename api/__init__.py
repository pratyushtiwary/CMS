from flask import Blueprint, request, abort, Response
from api.login import login
from api.register import register
from api.forgetPassword import forgetPassword
from api.sendotp import sendotp
from utils.validate import exists
from models.employee import Employee
from flask_cors import CORS, cross_origin
from utils.auth import auth, authN
from globals import url


# ---------------
# |   Extras    |
# ---------------
from api.fetch.departments import fetchDepartments
from api.fetch.latestAnnouncement import latestAnnouncement


# ---------------
# |  Employees  |
# ---------------
import api.employee as Employee


# ---------------
# |   Vendors   |
# ---------------
import api.vendor as Vendor

# ---------------
# |   Admin     |
# ---------------
import api.admin as Admin


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
@authN(access_level="employee")
def employee_newcomplaint():
	if request.method == "POST":
		return Employee.newComplaint()
	return abort(405)


@api.route("/employee/getComplaintsByStatus",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_getcomplaintsbystatus():
	if request.method == "POST":
		req = request.json
		return Employee.getComplaintsByStatus(req)
	return abort(405)

@api.route("/employee/loadAnnouncements",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_loadannouncements():
	if request.method == "POST":
		req = request.json
		return Employee.loadAnnouncements(req)
	return abort(405)

@api.route("/employee/getComplaints",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_getcomplaints():
	if request.method == "POST":
		req = request.json
		return Employee.getComplaints(req)
	return abort(405)

@api.route("/employee/repostComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_repostcomplaint():
	if request.method == "POST":
		return Employee.repostComplaint()
	return abort(405)

@api.route("/employee/updateComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_updatecomplaint():
	if request.method == "POST":
		return Employee.updateComplaint()
	return abort(405)

@api.route("/employee/getComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_getcomplaint():
	if request.method == "POST":
		req = request.json
		return Employee.getComplaint(req)
	return abort(405)

@api.route("/employee/deleteComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_deletecomplaint():
	if request.method == "POST":
		req = request.json
		return Employee.deleteComplaint(req)
	return abort(405)

@api.route("/employee/fetchDetails",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_fetchdetails():
	if request.method == "POST":
		req = request.json
		return Employee.fetchDetails(req)
	return abort(405)

@api.route("/employee/setDetails",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_setdetails():
	if request.method == "POST":
		req = request.json
		return Employee.setDetails(req)
	return abort(405)

@api.route("/employee/searchComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_searchcomplaint():
	if request.method == "POST":
		req = request.json
		return Employee.searchComplaint(req)
	return abort(405)



# ---------------
# |  Vendors    |
# ---------------

@api.route("/vendor/getComplaints",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_getcomplaints():
	if request.method == "POST":
		req = request.json
		return Vendor.getComplaints(req)
	return abort(405)

@api.route("/vendor/loadAnnouncements",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_loadannouncements():
	if request.method == "POST":
		req = request.json
		return Vendor.loadAnnouncements(req)
	return abort(405)

@api.route("/vendor/searchComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_searchcomplaint():
	if request.method == "POST":
		req = request.json
		return Vendor.searchComplaint(req)
	return abort(405)

@api.route("/vendor/getComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_getcomplaint():
	if request.method == "POST":
		req = request.json
		return Vendor.getComplaint(req)
	return abort(405)

@api.route("/vendor/changePriority",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_changepriority():
	if request.method == "POST":
		req = request.json
		return Vendor.changePriority(req)
	return abort(405)

@api.route("/vendor/changeStatus",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_changestatus():
	if request.method == "POST":
		req = request.json
		return Vendor.changeStatus(req)
	return abort(405)


# ---------------
# |   Admin     |
# ---------------
@api.route("/admin/getUsersByStat",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_getusersbystat():
	if request.method == "POST":
		return Admin.getUsersByStat()
	return abort(405)

@api.route("/admin/createAnnouncement",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_createannouncement():
	if request.method == "POST":
		req = request.json
		return Admin.createAnnouncement(req)
	return abort(405)