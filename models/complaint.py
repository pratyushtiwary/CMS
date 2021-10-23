from conn import DB
from utils.validate import exists
from json import dumps
from utils.msg import error, success
from utils.files import Files
from utils.sender import sendMsg
from globals import save_path, url
import os
from models.feedback import Feedback

class Complaint(DB):
	def __init__(self):
		self.tableName = "complaint"
		self.imageTable = "image"
		self.employeeTable = "employee"
		self.vendorTable = "vendor"
		self.feedbackTable = "feedback"
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

				sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`,`repostFrom`,`repostCount`,`allotmentDate`) 
					VALUES(NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,%s,NULL,0,NULL)
				"""
				vals = (eid,shortBody,body,priority,status,dept)
				if int(dept) == 0:
					sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody` ,`body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`,`repostFrom`,`repostCount`.`allotmentDate`) 
						VALUES(NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,NULL,NULL,0,NULL)
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
				print("Error",e)
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
		sql = f"SELECT `id`,`shortBody`,`status`,`ts` FROM `{self.tableName}` WHERE `eid` = %s AND (LOWER(`shortBody`) LIKE %s OR `id` = %s OR `status` = %s)"
		vals = (eid,"%"+term+"%",term,term)
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
		sql = f"SELECT `id`,`shortBody`,`status`, `priority`,`ts` FROM `{self.tableName}` WHERE `vid` = %s AND (LOWER(`shortBody`) LIKE %s OR `id` = %s or `status` = %s or `priority` = %s)"
		vals = (vid,"%"+term+"%",term,term,term)
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

		sql = f"""
			SELECT c.`body`,c.`ts`,c.`status`,c.`dept`,c.`msg`,c.`allotmentDate`,c.`vid` 
			FROM `{self.tableName}` c
			WHERE c.`id` = %s 
			AND c.`eid` = %s
		"""
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
			sql = f"""
				SELECT `name`
				FROM `{self.vendorTable}`
				WHERE `id` = %s
			"""
			vals = (res[6],)
			conn.execute(sql,vals)
			vendor = conn.fetchone()
			if vendor:
				final["vendor"] = {
					"name": vendor[0],
				}
				if res[5]:
					final["vendor"]["allotmentDate"] = res[5].strftime("%d/%m/%y")

			sql = f"SELECT `id`,`path` FROM `{self.imageTable}` WHERE `cid` = %s"
			vals = (cid,)
			conn.execute(sql,vals)

			imgs = conn.fetchall()

			final["imgs"] = []
			final["imgsId"] = []
			for img in imgs:
				final["imgs"].append(img[1])
				final["imgsId"].append(img[0])

			feedback = Feedback()
			final["feedback"] = feedback.get(cid)

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
			    from `{self.employeeTable}`
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

			feedback = Feedback()

			final["feedback"] = feedback.get(cid,"vendor")

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
								INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody` ,`body`, `ts`, `priority`, `status`, `msg`, `adminMsg`, `dept`, `repostFrom`, `repostCount`,`allotmentDate`)
								VALUES (NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),'low','pending',NULL,NULL,NULL,%s,NULL,NULL)
						"""
						vals = (eid,shortBody,body,repostFrom)
					else:

						sql = f"""
								INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`,`shortBody` ,`body`, `ts`, `priority`, `status`, `msg`, `adminMsg`, `dept`, `repostFrom`, `repostCount`,`allotmentDate`)
								VALUES (NULL,%s,NULL,%s,%s,CURRENT_TIMESTAMP(),'low','pending',NULL,NULL,%s,%s,NULL,NULL)
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
		if exists(["eid","cid","body","finalImgs"],args):
			conn = self.conn.cursor()
			eid, cid, body, finalImgs = args["eid"], args["cid"], args["body"], args["finalImgs"]
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

				sql = f"UPDATE `{self.tableName}` SET `body` = %s, `shortBody` = %s, `status`='pending' WHERE `id` = %s"
				vals = (body,shortBody,cid)
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

			sql = f"DELETE FROM `{self.feedbackTable}` WHERE `forComplaint` = %s"
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

	def listAll(self,offset):
		conn = self.conn.cursor()
		sql = f"""
			SELECT COUNT(*)
			FROM `{self.tableName}`
		"""
		conn.execute(sql)
		res = conn.fetchone()
		count = 0
		if res:
			count = res[0]

		sql = f"""
			SELECT `id`,`eid`,`vid`,`allotmentDate`,`status`,`priority`,`shortBody`
			FROM `{self.tableName}`
			ORDER BY `id` DESC
			LIMIT 10
			OFFSET %s
		"""
		vals = (offset,)
		conn.execute(sql,vals)
		rows = conn.fetchall()
		final = []
		for row in rows:
			temp = {
				"id": row[0],
				"status": row[4],
				"priority": row[5],
				"shortDesc": row[6]
			}
			if row[3]:
				temp["assignedOn"] = row[3].strftime("%d/%m/%y")

			if row[2]:
				sql = f"""
					SELECT `name`
					FROM `{self.vendorTable}`
					WHERE `id` = %s
				"""
				vals = (row[2],)
				conn.execute(sql,vals)
				res = conn.fetchone()
				temp["assignedTo"] = res[0]


			sql = f"""
				SELECT `name`
				FROM `{self.employeeTable}`
				WHERE `id` = %s
			"""
			vals = (row[1],)
			conn.execute(sql,vals)
			res = conn.fetchone()
			temp["byEmp"] = res[0]

			sql = f"""
				SELECT `employeeStar`,`vendorStar`
				FROM `{self.feedbackTable}`
				WHERE `forComplaint` = %s
			"""
			vals = (row[0],)
			conn.execute(sql,vals)
			res = conn.fetchone()

			if res:
				if res[0] and res[1]:
					temp["rating"] = (res[0]+res[1])/2

			final.append(temp)

		conn.close()
		return {
			"complaints": final,
			"count": count
		}

	def searchAll(self,term,offset):
		conn = self.conn.cursor();
		term = term.lower()
		sql = f"""
			SELECT `id`,`eid`,`vid`,`allotmentDate`,`status`,`priority`,`shortBody`
			FROM `{self.tableName}`
			WHERE `id` = %s
			OR `status` = %s
			OR `priority` = %s
			OR LOWER(`shortBody`) LIKE %s
			ORDER BY `id` DESC
			LIMIT 10
			OFFSET %s
		"""
		vals = (term,term,term,'%'+term+'%',offset)
		conn.execute(sql,vals)

		final = []

		rows = conn.fetchall()

		if rows:
			for row in rows:
				temp = {
					"id": row[0],
					"status": row[4],
					"priority": row[5],
					"shortDesc": row[6]
				}

				sql = f"""
					SELECT `name`
					FROM `{self.employeeTable}`
					WHERE `id` = %s
				"""
				vals = (row[1],)
				conn.execute(sql,vals)
				res = conn.fetchone()

				temp["byEmp"] = res[0]

				if row[3]:
					temp["assignedOn"] = row[3].strftime("%d/%m/%y")

				if row[2]:
					sql = f"""
						SELECT `name`
						FROM `{self.vendorTable}`
						WHERE `id` = %s
					"""
					vals = (row[2],)
					conn.execute(sql,vals)
					res = conn.fetchone()
					temp["assignedTo"] = res[0]


				sql = f"""
					SELECT `employeeStar`,`vendorStar`
					FROM `{self.feedbackTable}`
					WHERE `forComplaint` = %s
				"""
				vals = (row[0],)
				conn.execute(sql,vals)
				res = conn.fetchone()

				if res:
					if res[0] and res[1]:
						temp["rating"] = (res[0]+res[1])/2

				final.append(temp)
		return final

	def view(self,id):
		conn = self.conn.cursor()
		sql = f"""
			SELECT `eid`,`vid`,`body`,`ts`,`priority`,`status`,`msg`,`adminMsg`,`allotmentDate`
			FROM `{self.tableName}`
			WHERE `id` = %s
		"""
		vals = (id,)
		conn.execute(sql,vals)

		res = conn.fetchone()

		if res:
			final = {
				"body": res[2],
				"on": res[3].strftime("%d/%m/%y"),
				"priority": res[4],
				"status": res[5],
				"msg": res[6],
				"adminMsg": res[7]
			}

			if res[1]:
				sql = f"""
					SELECT `name`
					FROM `{self.vendorTable}`
					WHERE `id` = %s
				"""
				vals = (res[1],)
				conn.execute(sql,vals)
				v = conn.fetchone()
				if v:
					final["vendorName"] = v[0]
					final["vendorId"] = res[1]

			sql = f"""
				SELECT `name`,`roomNo`
				FROM `{self.employeeTable}`
				WHERE `id` = %s
			"""
			vals = (res[0],)
			conn.execute(sql,vals)
			e = conn.fetchone()
			if e:
				final["emp"] = {
					"id": res[0],
					"name": e[0],
					"roomNo": e[1]
				}

			if res[8]:
				final["allotmentDate"] = res[8].strftime("%d/%m/%y")

			sql = f"""
				SELECT `path`
				FROM `{self.imageTable}`
				WHERE `cid` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			imgs = conn.fetchall()

			if imgs:
				final["imgs"] = []
				for img in imgs:
					final["imgs"].append(img[0])

			sql = f"""
				SELECT `vendorMsg`,`vendorStar`,`employeeMsg`,`employeeStar`
				FROM `{self.feedbackTable}`
				WHERE `forComplaint` = %s
			"""
			vals = (id,)
			conn.execute(sql,vals)
			feedback = conn.fetchone()

			if feedback:
				final["feedback"] = {}
				if feedback[0] and feedback[1]:
					final["feedback"]["vendor"] = {
						"feedback": feedback[0],
						"rating": feedback[1]
					}

				if feedback[2] and feedback[3]:
					final["feedback"]["employee"] = {
						"feedback": feedback[2],
						"rating": feedback[3]
					}
			conn.close()
			return success(final)
		conn.close()
		return error("NO_COMPLAINT_FOUND")