from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.department import Department


def loadDepartmentEmployees(req):
	if exists(["id","offset"],req):
		id = req["id"]
		offset = req["offset"]
		department = Department()
		res = department.viewEmployees(id,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)