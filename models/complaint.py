from conn import DB
from utils.validate import exists
from json import dumps
from utils.msg import error
from utils.files import Files

class Complaint(DB):
	def __init__(self):
		self.tableName = "complaint"
		self.imageTable = "image"

		self.conn = DB.__init__(self)


	def create(self,args):
		if exists(["eid","body","priority","status","images","dept"],args):
			files = Files()
			try:
				conn = self.conn.cursor()
				eid, body, priority, status, images, dept = args['eid'], args['body'], args['priority'], args['status'], args["images"], args["dept"]
				sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`) 
					VALUES(NULL,%s,NULL,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,%s)
				"""
				vals = (eid,body,priority,status,dept)
				if int(dept) == 0:
					sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`,`dept`) 
						VALUES(NULL,%s,NULL,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL,NULL)
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