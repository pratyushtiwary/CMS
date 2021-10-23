from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.vendor import Vendor


def changeVendorDepartment(req):
	if exists(["id","deptId"],req):
		id = req["id"]
		newDeptId = req["deptId"]
		vendor = Vendor("","")
		res = vendor.changeDept(id,newDeptId)
		if res == True:
			return success("Department Changed Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)