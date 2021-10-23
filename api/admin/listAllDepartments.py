from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.department import Department


def listAllDepartments(req):
	if exists(["offset"],req):
		offset = req["offset"]
		department = Department()
		return success(department.listAll(offset))
	return Response(response=error("INVALID_REQUEST"),status=400)