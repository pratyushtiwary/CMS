from utils.msg import success
from models.vendor import Vendor
from utils.auth import viewToken

def fetchDetails(req):
	id = viewToken(req["token"])["id"]
	vendor = Vendor("","")
	res = vendor.fetchDetail(id)

	if res[0]==True:
		return success(res[1])
	else:
		return res[1]