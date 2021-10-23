from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.employee import Employee


def changeEmployeeRoomNo(req):
	if exists(["id","newRoomNo"],req):
		id = req["id"]
		newRoomNo = req["newRoomNo"]
		employee = Employee("","")
		res = employee.changeRoomNo(id,newRoomNo)
		if res==True:
			return success("Room Number Changed Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)