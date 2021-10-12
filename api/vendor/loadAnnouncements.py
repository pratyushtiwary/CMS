from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.announcement import Announcement

def loadAnnouncements(req):
	announcement = Announcement()
	if exists(["offset"],req):
		offset = int(req["offset"])
		announcements = announcement.load(offset)
		if announcements:
			return success(announcements)
		else:
			return error("NO_ANNOUNCEMENT_FOUND")
	return Response(response=error("INVALID_REQUEST"),status=400)	
