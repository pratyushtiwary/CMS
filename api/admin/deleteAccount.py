from utils.msg import success
from models.admin import Admin
from utils.auth import viewToken

def deleteAccount(req):
	id = viewToken(req["token"])["id"]
	admin = Admin("","")
	res =  admin.delete(id)
	if res==True:
		return success("Account deleted successfully!")
	else:
		return res
