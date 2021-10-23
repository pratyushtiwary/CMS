from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.employee import Employee


def deleteEmployee(req):
	if exists(["id"],req):
		id = req["id"]
		employee = Employee("","")
		res = employee.delete(id)
		if res==True:
			return success("Employee Deleted Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)