from flask import Response
from utils.msg import success
from models.admin import Admin

def getUsersByStat():
	admin = Admin("","")
	return success(admin.getAllUsers())