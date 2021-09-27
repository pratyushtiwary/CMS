from utils.msg import success
from models.department import Department


def fetchDepartments():
	dept = Department()
	departments = dept.fetchAll()
	return success({
		"departments": departments	
	})