from functools import wraps
from utils.encryption import encrypt,decrypt
from utils.validate import exists
from globals import token_validity_days
from flask import abort, request, Response
from utils.msg import error
from json import loads,dumps
from datetime import datetime, timedelta

def auth(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if request.method=="POST":
			if exists(["token"],request.json):
				if verifyToken(request.json.get("token")):
					return f(*args, **kwargs)
				else:
					return Response(response=error("INVALID_TOKEN"),status=403)
			elif exists(["token"],request.form,True):
				if verifyToken(request.form["token"]):
					return f(*args, **kwargs)
				else:
					return Response(response=error("INVALID_TOKEN"),status=403)
			else:
				return Response(response=error("UNAUTH_REQUEST"),status=403)
		else:
			return abort(405)

	return decorated_function

def authenticate(username,password,userType):
    return "Hi"

def generateToken(data:dict):
	data["expiry"] = (datetime.now() + timedelta(days=token_validity_days)).timestamp()

	data = dumps(data)

	data = encrypt(data)

	return data

def verifyToken(token:str):
	token = decrypt(token)
	token = loads(token)

	now = datetime.now().timestamp()

	if now > token.get("expiry",0):
		return False
	return True


def viewToken(token:str):
	if verifyToken(token):
		token = decrypt(token)
		token = loads(token)
		token["expiry"] = None
		return token
	else:
		return error("INVALID_TOKEN")
