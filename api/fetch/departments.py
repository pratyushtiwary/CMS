import json
from utils.auth import generateToken
from utils.sender import verifyOTP
from utils.validate import exists
from flask import Response
from utils.msg import error, success
from models.department import Department


def fetchDepartments():
	dept = Department()
	departments = dept.fetchAll()
	return success({
		"departments": departments	
	})