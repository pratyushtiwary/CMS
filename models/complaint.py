from conn import DB
from utils.validate import exists
from json import dumps
from utils.msg import error

class Complaint(DB):
	def __init__(self):
		self.tableName = "complaint"

		self.conn = DB.__init__(self)


	def create(self,args):
		if exists(["eid","body","priority","status"],args):
			try:
				conn = self.conn.cursor()
				eid, body, priority, status = args['eid'], args['body'], args['priority'], args['status']

				sql = f"""INSERT INTO `{self.tableName}`(`id`, `eid`, `vid`, `body`, `ts`, `priority`, `status`, `msg`, `adminMsg`) 
					VALUES(NULL,%s,NULL,%s,CURRENT_TIMESTAMP(),%s,%s,NULL,NULL)
				"""
				vals = (eid,body,priority,status)

				conn.execute(sql,vals)

				self.conn.commit()

				id = conn.lastrowid

				conn.close()

				return (id,True)

			except Exception as e:
				return (error("SERVER_ERROR"),False)
		else:
			return (0,error("SERVER_ERROR"))