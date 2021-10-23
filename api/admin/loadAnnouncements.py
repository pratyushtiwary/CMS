from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.announcement import Announcement
from utils.auth import viewToken

def loadAnnouncements(req):
	if exists(["offset","token"],req):
		announcement = Announcement()
		offset = int(req["offset"])
		adminId = viewToken(req["token"])["id"]
		announcements = announcement.load(offset,True,adminId)
		if announcements:
			return success(announcements)
		else:
			return error("NO_ANNOUNCEMENT_FOUND")
	return Response(response=error("INVALID_REQUEST"),status=400)	
