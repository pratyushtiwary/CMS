import math,random
from utils.validate import exists
from models.otp import OTP
from utils.encryption import password_hash
import smtplib
from email.message import EmailMessage
from globals import appName, email_host, email_username, email_password, email_port, otp_validity_minutes, URL as url
from conn import connect

# Dictionary of possible notifications
notifications = {
	"NEW_COMPLAINT": """
		Hey, this is to notify you that someone(hopefully you) have opened a new complaint
		<br><br>
		Now relax and chill we'll keep you updated with the status of this complaint
	""",
	"ERROR_STATUS": """
		Hey, looks like there is some error in your complaint.
		<br><br>
		<a href="%s/complaint/%s">Click here to view your complaint.</a>
	""",
	"RESOLVED_STATUS": """
		Hey, your complaint has been resolved.
		<br><br>
		<a href="%s/complaint/%s">Click here to view your complaint.</a>
	""",
	"CHANGE_DEPARTMENT": """
		Hey, your department has been changed from <b>%s</b> to <b>%s</b>
	""",
	"ACCOUNT_ACTIVATED": f"""
		Hey, your account has been activated, now you can login to start using {appName}
	""",
	"ACCOUNT_DEACTIVATED": """
		Hey, your account has been deactivated
	""",
	"NEW_USER_EMPLOYEE": f"""
		Welcome to {appName},
		<br><br>
		Your account has been created on {appName}
		<br>
		To learn how to use {appName} <a href="#employee">Click Here</a>
		<br>
		To login <a href="{url+"/login"}">Click Here</a>
	""",
	"NEW_USER_VENDOR": """
		Welcome to """+appName+""",
		<br><br>
		Your account has been created on """+appName+"""
		<br>
		To learn how to use """+appName+""" <a href="#vendor">Click Here</a>
		<br>
		Department Alloted :- %s Department
		<br>
		To login <a href="{url+"/login"}">Click Here</a>
	""",
	"NEW_USER_ADMIN": f"""
		Welcome to {appName},
		<br><br>
		Your account has been created on {appName}
		<br>
		To login <a href="{url+"/login"}">Click Here</a>
	"""
}

def sendMail(msg):
	s = smtplib.SMTP(email_host, email_port)
	s.starttls()
	s.login(email_username,email_password)
	s.send_message(msg)

def sendOTP(args: dict):
	"""
		Sends OTP to provided
		
		Takes a dictionary as a parameter

		Dictionary should have email, phone and id keys

		You can also pass optional length key

	"""
	digits = "0123456789"
	code = ""
	if exists(["email","phone","type"],args):
		email, phone, type = args.get("email"), args.get("phone"), args.get("type")
		length = args.get("length",6)
		otp = OTP(email,phone,type)
		for i in range(length):
			code += digits[math.floor(random.random() * len(digits))]

		"""
			Sending Email
		"""	

		msg = EmailMessage()

		msg["Subject"] = f"OTP for {appName}"

		msg["From"] = email_username

		msg["To"] = email

		msg.set_content(f"""
			<!DOCTYPE html>
			<html>
				<body>
					<table style="font-family: sans-serif;">
						<tr>
							<th style="color: #000000;font-size: 1.5rem;text-align: left;">{appName}</th>
						</tr>
						<tbody>
							<tr>
								<td><hr style="color: #000000;"></td>
								<td><br></td>
							</tr>
							<tr>
								<td>
									<center>Find the OTP code below. OTP is valid for {otp_validity_minutes} minutes</center>
									<br>
								</td>
							</tr>
							<tr>
								<td style="font-size: 1.5rem; font-weight: bold; color: #ffffff;padding: 5px;">
									<center >
										<span style="background-color: #000000;padding: 10px;border-radius: 4px;">{code}</span>
									</center>
								</td>
							</tr>
							<tr>
								<td>
									<br>
									Regards,<br>
									{appName} Admin
								</td>
							</tr>
						</tbody>
					</table>
				</body>
			</html>
		""", subtype='html')

		sendMail(msg)

		return otp.setOTP(password_hash(code))
	else:
		return False

def verifyOTP(args):
	"""
		Verifies the OTP entered by the user
	"""

	if exists(["email","phone","type","code"],args):
		email,phone,type,code = tuple(args.values())
		otp = OTP(email,phone,type)
		return otp.checkOTP(code)
	else:
		return False

def sendMsg(args):
	"""
		Notify user by sending msg to provided email and phone
		
		Takes a dictionary as a parameter

		Dictionary should have email , phone, msg keys

	"""
	types = {
		"employee": "employee",
		"admin": "admin",
		"vendor": "vendor"
	}
	if exists(["id","email","phone","code","subject","type"],args):
		email, phone, code, subject, type, id = args.get("email"),args.get("phone"),args.get("code"), args.get("subject"), args.get("type"), args.get("id")
		msg = EmailMessage()

		msg["Subject"] = f"{appName}: {subject}"

		tableName = types.get(type)
		conn = connect()

		msg["From"] = email_username

		msg["To"] = email

		if notifications.get(code,False):
			content = notifications.get(code)
		else:
			content = code


		if args.get("extras",False):
			content = content%args["extras"]

		msg.set_content(f"""
			<!DOCTYPE html>
			<html>
				<body>
					<table style="font-family: sans-serif;">
						<tr>
							<th style="color: #000000;font-size: 1.5rem;text-align: left;">{appName}</th>
						</tr>
						<tbody>
							<tr>
								<td>
									<hr style="width: 100%;">
									<br>
									{content}
									<br>
									<br>
									<hr style="width: 100%;">
								</td>
							</tr>
							<tr>
								<td>
									<br>
									Regards,<br>
									{appName} Admin
								</td>
							</tr>
						</tbody>
					</table>
				</body>
			</html>
		""", subtype='html')


		sql = f"SELECT 1 FROM `{tableName}` WHERE `id`= %s AND `notify` = 1"
		vals = (id,)
		cursor = conn.cursor()

		cursor.execute(sql,vals)

		notify = cursor.fetchone()

		if args.get("force",False):
			sendMail(msg)			
		else:
			if notify:
				sendMail(msg)

		cursor.close()
		conn.close()
		return True
	else:
		return False