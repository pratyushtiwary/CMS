from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.announcement import Announcement

def deleteAnnouncement(req):
	if exists(["id"],req):
		announcement = Announcement()
		id = req["id"]
		res = announcement.delete(id)
		if res==True:
			return success("Announcement deleted successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	
