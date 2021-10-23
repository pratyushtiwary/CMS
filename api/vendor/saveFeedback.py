from flask import Response
from utils.validate import exists
from utils.msg import error, success
from models.feedback import Feedback

def saveFeedback(req):
	if exists(["cid","rating","feedback"],req):
		cid, rating, body = req["cid"], req["rating"], req["feedback"]
		feedback = Feedback()
		res = feedback.set({
			"cid": cid,
			"rating": rating,
			"feedback": body
		},"vendor")
		if res == True:
			return success("Feedback saved successfully!")
		else:
			return res
	return Response(response=error("INVALID_REQUEST"),status=400)	
