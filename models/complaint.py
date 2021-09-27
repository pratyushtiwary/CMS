from conn import DB
from utils.validate import exists
from json import dumps
from utils.msg import error
from utils.files import Files
from utils.sender import sendMsg

class Complaint(DB):
	def __init__(self):
		self.tableName = "complaint"
		self.imageTable = "image"
		self.employeeTable = "employees"
		self.conn = DB.__init__(self)


	def create(self,args):
		if exists(["eid","body","priority","status","images","dept"],args):
			files = Files()
			try:
				conn = self.conn.cursor()
				eid, body, priority, status, images, dept = args['eid'], args['body'], args['priority'], args['status'], args["images"], args["dept"]

				sql = f"SELECT `email`,`phone` from `{self.employeeTable}` where `id`=%s"
				vals = (eid,)
				conn.execute(sql,vals)

				res = conn.fetchone()

				email,phone = res[0], res[1]

				sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`,`repostFrom`,`repostCount`) 
					VALUES(NULL,%s,NULL,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,%s,NULL,0)
				"""
				vals = (eid,body,priority,status,dept)
				if int(dept) == 0:
					sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`,`repostFrom`,`repostCount`) 
						VALUES(NULL,%s,NULL,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,NULL,NULL,0)
					"""
					vals = (eid,body,priority,status)
				
				conn.execute(sql,vals)
				cid = conn.lastrowid
				if len(images) > 0:
					keys = list(images.keys())
					for key in keys:
						sql = f"""INSERT INTO `{self.imageTable}`(`id`, `cid`, `path`) VALUES (NULL,%s,%s)"""
						path = files.append(images[key])
						vals = (cid,path)

						conn.execute(sql,vals)
				sendMsg({
					"email": email,
					"phone": phone,
					"code": "NEW_COMPLAINT",
					"subject": "Opened a new complaint successfully!",
					"id": eid,
					"type": "employee"	
				})
				self.conn.commit()
				files.commit()
				conn.close()

				return True
			except Exception as e:
				print(e)
				del files
				self.conn.rollback()
				return error("SERVER_ERROR")
		else:
			return error("SERVER_ERROR")

	def fetchNoOfStatus(self,eid):
		conn = self.conn.cursor()
		sql = f"SELECT COUNT(*),`status` FROM `{self.tableName}` WHERE `eid` = %s GROUP BY `status`"
		vals = (eid,)

		conn.execute(sql,vals)

		rows = conn.fetchall()
		data = {
			"total": 0
		}

		for row in rows:
			data[row[1]] = row[0]
			data["total"] += row[0]

		return data

	def fetch(self,eid,offset):
		conn = self.conn.cursor()
		sql = f"""
				SELECT `id`, LEFT(`body`,50), `status`, `ts` 
				FROM `{self.tableName}` 
				WHERE `eid`= %s
				ORDER BY `ts` DESC
				LIMIT 10
				OFFSET %s
			"""
		vals = (eid,offset)
		conn.execute(sql,vals)
		rows = conn.fetchall()
		count = 0
		complaints = []
		if rows:
			sql = f"SELECT COUNT(*) FROM `{self.tableName}` WHERE `eid`=%s"
			vals = (eid,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			if res:
				count = res[0]
			for row in rows:
				complaints.append({
					"complaintId": row[0],
					"shortTitle": row[1],
					"date": row[3].strftime("%d/%m/%y"),
					"status": row[2]	
				})
		conn.close()
		return {
			"count": count,
			"complaints": complaints
		}

	def repost(self,args):
		if exists(["eid","body","images","dept","cid"],args):
			conn = self.conn.cursor()
			eid,body,images,dept,cid = args["eid"], args["body"], args["images"], args["dept"],args["cid"]
			try:
				sql = f"SELECT `repostFrom`,`repostCount` FROM `{self.tableName}` WHERE `id`=%s"
				vals = (cid,)
				conn.execute(sql,vals)

				res = conn.fetchone()

				if res:
					files = Files()
					repostFrom = cid
					repostCount = 0
					if res[0]:
						repostFrom = res[0]
						sql = f"SELECT `repostCount` FROM `{self.tableName}` WHERE `id` = %s"
						vals = (repostFrom,)
						conn.execute(sql,vals)
						repostCount = conn.fetchone()[0]
					elif res[1]:
						repostCount = res[1]

					if repostCount == 2:
						conn.close()
						return error("MAX_REPOST_LIMIT_REACHED")
						
					sql = f"""
							INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`, `dept`, `repostFrom`, `repostCount`)
							VALUES (NULL,%s,NULL,%s,CURRENT_TIMESTAMP(),'low','pending',NULL,NULL,%s,%s,NULL)
					"""
					vals = (eid,body,dept,repostFrom)

					conn.execute(sql,vals)

					newCid = conn.lastrowid
					for image in images:
						path = files.createCopy(image)
						sql = f"INSERT INTO `{self.imageTable}`(`id`,`cid`,`path`) VALUES(NULL,%s,%s)"
						vals = (newCid,path)
						conn.execute(sql,vals)


					repostCount += 1
					sql = f"""
							UPDATE `{self.tableName}` 
							SET `repostCount` = %s
							WHERE id = %s
						"""
					vals = (repostCount,repostFrom)

					conn.execute(sql,vals)

					sql = f"SELECT `email`,`phone` FROM `{self.employeeTable}` WHERE id = %s"
					vals = (eid,)
					conn.execute(sql,vals)
					res = conn.fetchone()
					email,phone = res[0], res[1]
					sendMsg({
						"email": email,
						"phone": phone,
						"code": "NEW_COMPLAINT",
						"subject": "Opened a new complaint successfully!",
						"id": eid,
						"type": "employee"	
					})
					files.commit()
					self.conn.commit()
					conn.close()
					return True
				else:
					return error("NO_COMPLAINT_FOUND")
			except Exception as e:
				self.conn.rollback()
				conn.close()
				return error("SERVER_ERROR")

	def update(self,args):
		if exists(["eid","cid","body","finalImgs","dept"],args):
			conn = self.conn.cursor()
			eid, cid, body, finalImgs, dept = args["eid"], args["cid"], args["body"], args["finalImgs"], args["dept"]
			try:
				sql = f"SELECT `id`,`path` FROM `{self.imageTable}` WHERE cid = %s"
				vals = (cid,)
				conn.execute(sql,vals)
				imgs = conn.fetchall()

				files = Files()
				deleteFiles = Files()

				if imgs:
					for img in imgs:
						if img[1] not in finalImgs:
							sql = f"DELETE FROM `{self.imageTable}` WHERE id = %s"
							vals = (img[0],)
							conn.execute(sql,vals)
							deleteFiles.delete(img[1])

				imgsPath = [img[1] for img in imgs]
				if finalImgs:
					for finalImg in finalImgs:
						if finalImg not in imgsPath:
							sql = f"INSERT INTO `{self.imageTable}`(`id`,`cid`,`path`) VALUES(NULL,%s,%s)"
							path = files.append(finalImg)
							vals = (cid,path)
							conn.execute(sql,vals)

				sql = f"UPDATE `{self.tableName}` SET `body` = %s, `dept` = %s WHERE `id` = %s"
				vals = (body,dept,cid)
				conn.execute(sql,vals)

				files.commit()
				deleteFiles.commit()
				self.conn.commit()
				return True

			except Exception as e:
				self.conn.rollback()
				return error("SERVER_ERROR")


