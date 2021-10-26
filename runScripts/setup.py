def run():
	try:
		from conn import connect
		from getpass import getpass
		from runScripts.queries import tableCreationQueries
		from utils.encryption import password_hash
	except Exception as e:
		print("Library Missing")
		print(e)
		print("")
		exit(1)
	print("""
	 .----------------.   .----------------.   .----------------. 
	| .--------------. | | .--------------. | | .--------------. |
	| |     ______   | | | | ____    ____ | | | |    _______   | |
	| |   .' ___  |  | | | ||_   \  /   _|| | | |   /  ___  |  | |
	| |  / .'   \_|  | | | |  |   \/   |  | | | |  |  (__ \_|  | |
	| |  | |         | | | |  | |\  /| |  | | | |   '.___`-.   | |
	| |  \ `.___.'\  | | | | _| |_\/_| |_ | | | |  |`\____) |  | |
	| |   `._____.'  | | | ||_____||_____|| | | |  |_______.'  | |
	| |              | | | |              | | | |              | |
	| '--------------' | | '--------------' | | '--------------' |
	 '----------------'   '----------------'   '----------------' 
	""")
	print("""
--------------------------------------------------------------------------

Please make sure all the values inside the globals.py are setup correctly.

--------------------------------------------------------------------------
	""")
	try:
		db = connect()
		try:
			name = str(input("Please enter admin name :- "))
			print("* Please enter a valid email below, as an otp will be sent at the time of login")
			email = str(input("Please enter admin email :- "))
			password = password_hash(getpass("Please enter admin password :- "))
			cpass = password_hash(getpass("Please again enter admin password :- "))
			if password != cpass:
				raise Exception("Passwords don't match!")
			print("* Please enter a valid phone below, as an otp will be sent at the time of login")
			phone = int(input("Please enter admin phone :- "))
			adminId = str(input("Please enter admin id :- "))

			print("Creating Tables...")
			print()


			cursor = db.cursor()

			res = cursor.execute(tableCreationQueries,multi=True)

			for r in res:
				print("Running Query :- ",r)
				print()

			print("Created Tables Successfully! :)")

			print()
			print("Creating admin user...")
			sql = """
				INSERT INTO `admin`(`id`, `name`, `email`, `password`, `phone`, `ts`, `notify`, `adminid`)
				VALUES(NULL,%s,%s,%s,%s,CURRENT_TIMESTAMP(),1,%s)
			"""
			vals = (name,email,password,phone,adminId)
			res = cursor.execute(sql,vals)

			if res:
				print()
				print("Admin Created Successfully!")

			db.commit()
			cursor.close()
			print()
			print("Setup Completed Successfully!")

		except Exception as e:
			db.rollback()
			print("")
			print("Error Occurred :- ",e)
			print("\nPlease manually delete the created tables if any\n")
			print("Rolling back all the changes made...")
			print("Quiting...")
	except Exception as e:
		print("Error Occurred :- ",e)
		print("Quiting...")