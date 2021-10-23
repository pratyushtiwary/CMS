from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.employee import Employee


def toggleEmployeeAccountActivation(req):
	if exists(["id","active"],req):
		id = req["id"]
		active = req["active"]
		employee = Employee("","")
		res = employee.toggleActivation(id,active)
		if res == True:
			return success("Account "+("Activated" if active else "Deactivated")+" Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)