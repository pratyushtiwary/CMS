from json import dumps

eCode = {
	"INVALID_PASSWORD": "Password invalid, please recheck your password",
	"NO_USER_FOUND": "No user with that email found",
	"USER_ALREADY_EXISTS": "A user with that email already exists",
	"UNABLE_TO_SEND_OTP": "Unable to send OTP please try again later",
	"UNABLE_TO_SEND_MSG": "Unable to send message to the user, please try again later",
	"INVALID_TOKEN": "User authentication expired",
	"INVALID_OTP": "OTP entered is invalid",
	"EXPIRED_OTP": "OTP is expired, try again",
	"INACTIVE_ACCOUNT": "Account is inactive, ask admin to activate",
	"INVALID_REQUEST": "Invalid request, try again with proper parameters",
	"NO_USER_FOUND_PHONE": "No user with that phone number found",
	"INVALID_FILE": "Whoops a file seems to be invalid :(",
	"SERVER_ERROR": "Some internal server error occured, try again later!",
	"UNAUTH_REQUEST": "Unauthorized Request"
}

def error(code: str):
	msg = {
		"error": {
			"code": code,
			"msg": eCode.get(code,code)
		}
	}
	return dumps(msg)

def success(msg):
	return dumps({
		"success":{
			"msg": msg
		}	
	})