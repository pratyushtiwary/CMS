import math,random
from utils.validate import exists
from models.otp import OTP
from utils.encryption import password_hash
import smtplib
from email.message import EmailMessage
from globals import appName, email_host, email_username, email_password, email_port, otp_validity_minutes

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
		s = smtplib.SMTP(email_host, email_port)

		s.starttls()

		s.login(email_username,email_password)

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

		s.send_message(msg)

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

		Dictionary should have email , phone, msg and id keys

	"""

	if exists(["id","email","phone","msg"],args):
		email, phone, msg = args.get("email"),args.get("phone"),args.get("msg")
		return True
	else:
		return False