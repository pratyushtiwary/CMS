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

@api.route("/employee/saveFeedback",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="employee")
def employee_savefeedback():
	if request.method == "POST":
		req = request.json
		return Employee.saveFeedback(req)
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

@api.route("/vendor/saveFeedback",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="vendor")
def vendor_savefeedback():
	if request.method == "POST":
		req = request.json
		return Vendor.saveFeedback(req)
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

@api.route("/admin/createDepartment",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_createdepartment():
	if request.method == "POST":
		req = request.json
		return Admin.createDepartment(req)
	return abort(405)

@api.route("/admin/loadAnnouncements",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loadannouncements():
	if request.method == "POST":
		req = request.json
		return Admin.loadAnnouncements(req)
	return abort(405)

@api.route("/admin/updateAnnouncement",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_updateannouncement():
	if request.method == "POST":
		req = request.json
		return Admin.updateAnnouncement(req)
	return abort(405)

@api.route("/admin/deleteAnnouncement",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_deleteannouncement():
	if request.method == "POST":
		req = request.json
		return Admin.deleteAnnouncement(req)
	return abort(405)

@api.route("/admin/listAllEmployees",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_listallemployees():
	if request.method == "POST":
		req = request.json
		return Admin.listAllEmployees(req)
	return abort(405)

@api.route("/admin/listAllVendors",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_listallvendors():
	if request.method == "POST":
		req = request.json
		return Admin.listAllVendors(req)
	return abort(405)

@api.route("/admin/listAllDepartments",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_listalldepartments():
	if request.method == "POST":
		req = request.json
		return Admin.listAllDepartments(req)
	return abort(405)

@api.route("/admin/deleteDepartment",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_deletedepartment():
	if request.method == "POST":
		req = request.json
		return Admin.deleteDepartment(req)
	return abort(405)

@api.route("/admin/renameDepartment",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_renamedepartment():
	if request.method == "POST":
		req = request.json
		return Admin.renameDepartment(req)
	return abort(405)

@api.route("/admin/loadDepartment",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loaddepartment():
	if request.method == "POST":
		req = request.json
		return Admin.loadDepartment(req)
	return abort(405)

@api.route("/admin/loadDepartmentEmployees",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loaddepartmentemployees():
	if request.method == "POST":
		req = request.json
		return Admin.loadDepartmentEmployees(req)
	return abort(405)

@api.route("/admin/loadVendor",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loadvendor():
	if request.method == "POST":
		req = request.json
		return Admin.loadVendor(req)
	return abort(405)

@api.route("/admin/loadVendorComplaints",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loadvendorcomplaints():
	if request.method == "POST":
		req = request.json
		return Admin.loadVendorComplaints(req)
	return abort(405)

@api.route("/admin/changeVendorDepartment",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_changevendordepartment():
	if request.method == "POST":
		req = request.json
		return Admin.changeVendorDepartment(req)
	return abort(405)

@api.route("/admin/deleteVendor",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_deletevendor():
	if request.method == "POST":
		req = request.json
		return Admin.deleteVendor(req)
	return abort(405)

@api.route("/admin/toggleVendorAccountActivation",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_togglevendoraccountactivation():
	if request.method == "POST":
		req = request.json
		return Admin.toggleVendorAccountActivation(req)
	return abort(405)

@api.route("/admin/loadEmployee",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loademployee():
	if request.method == "POST":
		req = request.json
		return Admin.loadEmployee(req)
	return abort(405)

@api.route("/admin/loadEmployeeComplaints",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_loademployeecomplaints():
	if request.method == "POST":
		req = request.json
		return Admin.loadEmployeeComplaints(req)
	return abort(405)

@api.route("/admin/changeEmployeeRoomNo",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_changeemployeeroomno():
	if request.method == "POST":
		req = request.json
		return Admin.changeEmployeeRoomNo(req)
	return abort(405)

@api.route("/admin/deleteEmployee",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_deleteemployee():
	if request.method == "POST":
		req = request.json
		return Admin.deleteEmployee(req)
	return abort(405)

@api.route("/admin/toggleEmployeeAccountActivation",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_toggleemployeeaccountactivation():
	if request.method == "POST":
		req = request.json
		return Admin.toggleEmployeeAccountActivation(req)
	return abort(405)

@api.route("/admin/listAllComplaints",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_listallcomplaints():
	if request.method == "POST":
		req = request.json
		return Admin.listAllComplaints(req)
	return abort(405)

@api.route("/admin/createNewUser",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_createnewuser():
	if request.method == "POST":
		req = request.json
		return Admin.createNewUser(req)
	return abort(405)

@api.route("/admin/fetchDetails",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_fetchdetails():
	if request.method == "POST":
		req = request.json
		return Admin.fetchDetails(req)
	return abort(405)

@api.route("/admin/deleteAccount",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_deleteaccount():
	if request.method == "POST":
		req = request.json
		return Admin.deleteAccount(req)
	return abort(405)

@api.route("/admin/saveSettings",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_savesettings():
	if request.method == "POST":
		req = request.json
		return Admin.saveSettings(req)
	return abort(405)

@api.route("/admin/searchDepartment",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_searchdepartment():
	if request.method == "POST":
		req = request.json
		return Admin.searchDepartment(req)
	return abort(405)

@api.route("/admin/searchEmployee",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_searchemployee():
	if request.method == "POST":
		req = request.json
		return Admin.searchEmployee(req)
	return abort(405)

@api.route("/admin/searchVendor",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_searchvendor():
	if request.method == "POST":
		req = request.json
		return Admin.searchVendor(req)
	return abort(405)

@api.route("/admin/searchComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_searchcomplaint():
	if request.method == "POST":
		req = request.json
		return Admin.searchComplaint(req)
	return abort(405)

@api.route("/admin/viewComplaint",methods=["POST","GET"])
@cross_origin(origin = [url],methods = ["GET","POST"])
@authN(access_level="admin")
def admin_viewcomplaint():
	if request.method == "POST":
		req = request.json
		return Admin.viewComplaint(req)
	return abort(405)