from conn import DB
from utils.validate import exists
from json import dumps
from utils.msg import error
from utils.files import Files
from utils.sender import sendMsg
from globals import save_path, url
import os

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
				shortBody = body[0:50]

				sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`,`repostFrom`,`repostCount`) 
					VALUES(NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,%s,NULL,0)
				"""
				vals = (eid,shortBody,body,priority,status,dept)
				if int(dept) == 0:
					sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody` ,`body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`,`repostFrom`,`repostCount`) 
						VALUES(NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,NULL,NULL,0)
					"""
					vals = (eid,shortBody,body,priority,status)
				
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

	def searchEmployeeComplaint(self,eid,term):
		conn = self.conn.cursor()
		sql = f"SELECT `id`,`shortBody`,`status`,`ts` FROM `{self.tableName}` WHERE LOWER(`shortBody`) LIKE %s OR `id` = %s OR `status` = %s AND `eid` = %s "
		vals = ("%"+term+"%",term,term,eid)
		conn.execute(sql,vals)
		results = conn.fetchall()
		complaints = []

		for result in results:
			complaints.append({
				"complaintId": result[0],
				"shortTitle": result[1],
				"date": result[3].strftime("%d/%m/%y"),
				"status": result[2]	
			})

		conn.close()
		return complaints

	def searchVendorComplaint(self,vid,term):
		conn = self.conn.cursor()
		sql = f"SELECT `id`,`shortBody`,`status`, `priority`,`ts` FROM `{self.tableName}` WHERE LOWER(`shortBody`) LIKE %s OR `id` = %s or `status` = %s or `priority` = %s AND `vid` = %s "
		vals = ("%"+term+"%",term,term,term,vid)
		conn.execute(sql,vals)
		results = conn.fetchall()
		complaints = []

		for result in results:
			complaints.append({
				"id": result[0],
				"title": result[1],
				"on": result[4].strftime("%d/%m/%y"),
				"status": result[2],
				"priority": result[3]	
			})

		conn.close()
		return complaints


	def fetchVendorComplaints(self,vid,offset):
		conn = self.conn.cursor()
		sql = f"""
				SELECT `id`, `shortBody`, `status`, `priority`,`ts` 
				FROM `{self.tableName}` 
				WHERE `vid`= %s
				ORDER BY `ts` DESC
				LIMIT 10
				OFFSET %s
		"""
		vals = (vid,offset)
		conn.execute(sql,vals)
		rows = conn.fetchall()
		count = 0
		complaints = []
		if rows:
			sql = f"SELECT COUNT(*) FROM `{self.tableName}` WHERE `vid`=%s"
			vals = (vid,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			if res:
				count = res[0]
			for row in rows:
				complaints.append({
					"id": row[0],
					"title": row[1],
					"on": row[4].strftime("%d/%m/%y"),
					"status": row[2],
					"priority": row[3]
				})
		conn.close()
		return {
			"count": count,
			"complaints": complaints
		}


	def fetchEmployeeComplaints(self,eid,offset):
		conn = self.conn.cursor()
		sql = f"""
				SELECT `id`, `shortBody`, `status`, `ts` 
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

	def fetchoneEmployeeComplaint(self,eid,cid):
		conn = self.conn.cursor()
		final = {}

		sql = f"SELECT `body`,`ts`,`status`,`dept`,`msg` FROM `{self.tableName}` WHERE `id` = %s AND `eid` = %s"
		vals = (cid,eid)
		conn.execute(sql,vals)
		res = conn.fetchone()
		if res:
			final = {
				"longText": res[0],
				"date": res[1].strftime("%d/%m/%y"),
				"status": res[2],
				"dept": res[3],
				"msg": res[4]
			}

			sql = f"SELECT `id`,`path` FROM `{self.imageTable}` WHERE `cid` = %s"
			vals = (cid,)
			conn.execute(sql,vals)

			imgs = conn.fetchall()

			final["imgs"] = []
			final["imgsId"] = []
			for img in imgs:
				final["imgs"].append(img[1])
				final["imgsId"].append(img[0])

			return (True,final)
		else:
			return (False,error("NO_COMPLAINT_FOUND"))

	def fetchoneVendorComplaint(self,vid,cid):
		conn = self.conn.cursor()
		final = {}

		sql = f"""
			select c.`body`, c.`ts`, c.`status`, c.`priority`, c.`adminMsg`, c.`msg`, e.`name`, e.`roomNo`
			from complaint c, (
				select `id`, `name`, `roomNo`
			    from employees
			) e
			where c.eid = e.id
			and c.id = %s
			and c.vid = %s
		"""
		vals = (cid,vid)
		conn.execute(sql,vals)
		res = conn.fetchone()
		if res:
			final = {
				"desc": res[0],
				"on": res[1].strftime("%d/%m/%y"),
				"status": res[2],
				"priority": res[3],
				"adminMsg": res[4],
				"msg": res[5],
				"user": {
					"name": res[6],
					"roomNo": res[7]
				}
			}

			sql = f"SELECT `id`,`path` FROM `{self.imageTable}` WHERE `cid` = %s"
			vals = (cid,)
			conn.execute(sql,vals)

			imgs = conn.fetchall()

			final["imgs"] = []
			final["imgsId"] = []
			for img in imgs:
				final["imgs"].append(img[1])
				final["imgsId"].append(img[0])

			return (True,final)
		else:
			return (False,error("NO_COMPLAINT_FOUND"))


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
					
					shortBody = body[0:50]

					if int(dept) == 0:
						sql = f"""
								INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody` ,`body`, `ts`, `priority`, `status`, `msg`, `adminMsg`, `dept`, `repostFrom`, `repostCount`)
								VALUES (NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),'low','pending',NULL,NULL,NULL,%s,NULL)
						"""
						vals = (eid,shortBody,body,repostFrom)
					else:

						sql = f"""
								INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody` ,`body`, `ts`, `priority`, `status`, `msg`, `adminMsg`, `dept`, `repostFrom`, `repostCount`)
								VALUES (NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),'low','pending',NULL,NULL,%s,%s,NULL)
						"""
						vals = (eid,shortBody,body,dept,repostFrom)
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
				print(e)
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

				shortBody = body[0:50]

				if int(dept) == 0:
					sql = f"UPDATE `{self.tableName}` SET `body` = %s, `shortBody` = %s, `status`='pending', `dept` = NULL WHERE `id` = %s"
					vals = (body,shortBody,cid)
				else:
					sql = f"UPDATE `{self.tableName}` SET `body` = %s, `shortBody` = %s, `status`='pending',`dept` = %s WHERE `id` = %s"
					vals = (body,shortBody,dept,cid)
				conn.execute(sql,vals)

				files.commit()
				deleteFiles.commit()
				self.conn.commit()
				return True

			except Exception as e:
				self.conn.rollback()
				return error("SERVER_ERROR")

	def delete(self,cid):
		conn = self.conn.cursor()
		try:
			sql = f"SELECT `repostFrom`,`repostCount` FROM `{self.tableName}` WHERE `id` = %s"
			vals = (cid,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			repostCount = res[1]
			repostFrom = res[0]
			if repostCount and repostCount > 0:
				repostCount -= 1

			if repostFrom == None:
				repostFrom = cid

			finalCid = repostFrom

			sql = f"SELECT `path` FROM `{self.imageTable}` WHERE `cid` = %s"
			vals = (cid,)
			conn.execute(sql,vals)

			file = Files()
			rows = conn.fetchall()
			for row in rows:
				file.delete(row[0])

			if repostFrom != cid:
				sql = f"UPDATE `{self.tableName}` SET `repostCount` = (`repostCount` - 1) WHERE `id` = %s"
				vals = (repostFrom,)
				conn.execute(sql,vals)
			else:
				sql = f"SELECT `id` FROM `{self.tableName}` WHERE `repostFrom`=%s LIMIT 1"
				vals = (finalCid,)
				conn.execute(sql,vals)
				repostedId = conn.fetchone()
				if repostedId:
					repostedId = repostedId[0]
					sql = f"UPDATE `{self.tableName}` SET `repostFrom` = %s WHERE `repostFrom` = %s"
					vals = (repostedId,finalCid)
					conn.execute(sql,vals)

					sql = f"UPDATE `{self.tableName}` SET `repostFrom` = NULL, `repostCount` = %s WHERE `id` = %s"
					vals = (repostCount,repostedId)
					conn.execute(sql,vals)


			sql = f"DELETE FROM `{self.imageTable}` WHERE `cid` = %s"
			vals = (cid,)
			conn.execute(sql,vals)

			sql = f"DELETE FROM `{self.tableName}` WHERE `id` = %s"
			vals = (cid,)
			conn.execute(sql,vals)

			file.commit()
			self.conn.commit()

			return True

		except Exception as e:
			self.conn.rollback()
			return error("SERVER_ERROR")

	def changeVendorStatus(self,vid,cid,newStatus,msg):
		conn = self.conn.cursor()
		try:
			newStatus = newStatus.lower()
			sql = f"""
				update {self.tableName}
				set `status` = %s, `msg` = %s
				where id = %s
				and vid = %s
			"""
			vals = (newStatus,msg,cid,vid)
			conn.execute(sql,vals)

			sql = f"""
				SELECT e.`email`,e.`phone`, e.`id`
				FROM {self.employeeTable} e, {self.tableName} c
				WHERE c.eid = e.id
				AND c.id = %s;
			"""
			vals = (cid,)
			conn.execute(sql,vals)
			res = conn.fetchone()
			email,phone,eid = res
			if newStatus == "resolved" or newStatus == "error":
				sendMsg({
					"email": email,
					"phone": phone,
					"code": newStatus.upper()+"_STATUS",
					"subject": "Complaint status changed!",
					"id": eid,
					"type": "employee",
					"extras": (url,cid)
				})
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			print(e)
			self.conn.rollback()
			return error("SERVER_ERROR")

	def changeVendorPriority(self,vid,cid,newPriority):
		conn = self.conn.cursor()
		try:
			newPriority = newPriority.lower()
			sql = f"""
				update {self.tableName}
				set `priority` = %s
				where id = %s
				and vid = %s
			"""
			vals = (newPriority,cid,vid)
			conn.execute(sql,vals)
			self.conn.commit()
			conn.close()
			return True
		except Exception as e:
			print(e)
			self.conn.rollback()
			return error("SERVER_ERROR")