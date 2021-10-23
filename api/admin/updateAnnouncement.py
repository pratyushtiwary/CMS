from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.announcement import Announcement

def updateAnnouncement(req):
	if exists(["id","newBody"],req):
		announcement = Announcement()
		id = req["id"]
		newBody = req["newBody"]
		res = announcement.update(id,newBody)
		if res==True:
			return success("Announcement updated successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	
