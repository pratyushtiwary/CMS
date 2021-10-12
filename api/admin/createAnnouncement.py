from flask import Response
from utils.msg import success, error
from utils.validate import exists
from models.announcement import Announcement
from utils.auth import viewToken

def createAnnouncement(req):
	if exists(["body"],req):
		adminId = viewToken(req["token"])["id"]
		body = req["body"]
		announcement = Announcement()
		res = announcement.create(body,adminId)
		if res==True:
			return success("Announcement created successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)