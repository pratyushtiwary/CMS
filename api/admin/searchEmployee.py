from flask import Response
from utils.msg import error, success
from utils.validate import exists
from models.employee import Employee

def searchEmployee(req):
	if exists(["term","offset"],req):
		term, offset = req["term"], req["offset"]
		employee = Employee("","")
		res = employee.search(term,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)
