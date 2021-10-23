from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.department import Department

def createDepartment(req):
	if exists(["name"],req):
		name = req["name"]
		department = Department()
		res = department.add(name)
		if res:
			return success("Department Created Successfully!");
		return res
	return Response(response=error("INVALID_REQUEST"),status=400)