import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def repostComplaint():
	req = request.form
	if exists(["cid","oldImgs","body","dept"],req,True):
		eid = viewToken(req["token"])["id"]
		cid, oldImgs, body, dept = req["cid"], json.loads(req["oldImgs"]), req["body"], req["dept"]
		newImgs = request.files
		if len(newImgs)>0:
			for newImg in newImgs.keys():
				oldImgs.append(newImgs[newImg])
		complaint = Complaint()
		res = complaint.repost({
			"eid": eid,
			"cid": cid,
			"body": body,
			"dept": dept,
			"images": oldImgs
		})

		if res==True:
			return success("New Complaint Opened Successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	