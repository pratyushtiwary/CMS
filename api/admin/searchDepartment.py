from flask import Response
from utils.msg import error, success
from utils.validate import exists
from models.department import Department

def searchDepartment(req):
	if exists(["term","offset"],req):
		term, offset = req["term"], req["offset"]
		department = Department()
		res = department.search(term,offset)
		return success(res)
	return Response(response=error("INVALID_REQUEST"),status=400)
