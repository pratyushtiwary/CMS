import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.employee import Employee
from utils.auth import viewToken

def fetchDetails(req):
	id = viewToken(req["token"])["id"]
	employee = Employee("","")
	res = employee.fetchDetail(id)

	if res[0]==True:
		return success(res[1])
	else:
		return res[1]