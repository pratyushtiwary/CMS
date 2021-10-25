from flask import Response
from utils.msg import success, error
from utils.validate import exists
from utils.auth import viewToken
from models.department import Department


def searchDepartmentEmployees(req):
	if exists(["id","offset","term"],req):
		id = req["id"]
		offset = req["offset"]
		term = req["term"]
		department = Department()
		res = department.searchVendor(id,term,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)