from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.department import Department


def renameDepartment(req):
	if exists(["id","name"],req):
		id = req["id"]
		name = req["name"]
		department = Department()
		res = department.rename(id,name)
		if res == True:
			return success("Department renamed successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)