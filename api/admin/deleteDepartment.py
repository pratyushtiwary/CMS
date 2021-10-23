from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.department import Department


def deleteDepartment(req):
	if exists(["id"],req):
		id = req["id"]
		department = Department()
		res = department.delete(id)
		if res == True:
			return success("Department deleted successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)