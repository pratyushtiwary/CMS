import json
from flask import request, Response
from utils.validate import exists
from utils.msg import error, success
from models.complaint import Complaint
from utils.auth import viewToken

def updateComplaint():
	req = request.form

	if exists(["cid","body","dept","oldImgs"],req,True):
		eid = viewToken(req["token"])["id"]
		cid, body, oldImgs, dept = req["cid"], req["body"], json.loads(req["oldImgs"]), req["dept"]
		newImgs = request.files
		finalImgs = []
		finalImgs.extend(oldImgs)
		for newImg in newImgs.keys():
			finalImgs.append(newImgs[newImg])

		complaint = Complaint()

		res = complaint.update({
			"eid": eid,
			"cid": cid,
			"body": body,
			"dept": dept,
			"finalImgs": finalImgs
		})

		if res==True:
			return success("Complaint updated successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	
