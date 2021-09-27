from conn import DB
from utils.validate import exists
from utils.msg import error

class Image(DB):
	def __init__(self):
		self.tableName = 'image'
		self.conn = DB.__init__(self)


	def add(self,args):
		if exists(["cid","path"],args):
			cid, path = args["cid"], args["path"]
			try:
				conn = self.conn.cursor()
				sql = f"""INSERT INTO `{self.tableName}`(`id`, `cid`, `path`) VALUES (NULL,%s,%s)"""
				vals = (cid,path)

				conn.execute(sql,vals)

				self.conn.commit()

				conn.close()

				return True
			except:
				self.conn.rollback()
				return error("SERVER_ERROR")
		else:
			return error("SERVER_ERROR")
