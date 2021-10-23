from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.department import Department


def loadDepartment(req):
	if exists(["id"],req):
		id = req["id"]
		department = Department()
		res = department.view(id)
		return res
	return Response(response=error("INVALID_REQUEST"),status=400)