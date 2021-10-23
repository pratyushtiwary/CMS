from utils.msg import success
from models.admin import Admin
from utils.auth import viewToken

def fetchDetails(req):
	id = viewToken(req["token"])["id"]
	admin = Admin("","")
	return admin.getValues(id)
