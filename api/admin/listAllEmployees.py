from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.employee import Employee


def listAllEmployees(req):
	if exists(["offset"],req):
		offset = req["offset"]
		employee = Employee("","")
		return success(employee.listAll(offset))
	return Response(response=error("INVALID_REQUEST"),status=400)