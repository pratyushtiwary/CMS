from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.employee import Employee


def loadEmployeeComplaints(req):
	if exists(["id","offset"],req):
		id = req["id"]
		offset = req["offset"]
		employee = Employee("","")
		res = employee.viewComplaints(id,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)