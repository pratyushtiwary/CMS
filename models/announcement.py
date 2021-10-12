from conn import DB
from utils.msg import error

class Announcement(DB):
	def __init__(self):
		self.tableName = "announcement"
		self.adminTable = "admin"
		self.conn = DB.__init__(self)


	def load(self,offset):
		try:
			conn = self.conn.cursor()
			sql = f"""
				SELECT a.`body`,a.`ts`,b.`adminName`
				FROM `{self.tableName}` a , (
					SELECT `id`,`name` as `adminName`
					FROM `{self.adminTable}`
				) b
				WHERE a.`byAdmin` = b.`id`
				ORDER BY a.`ts` DESC
				LIMIT 10
				OFFSET %s
			"""
			vals = (offset,)
			announcements = []
			conn.execute(sql,vals)
			rows = conn.fetchall()
			if rows:
				for row in rows:
					announcements.append({
						"body": row[0],
						"on": row[1].strftime("%d/%m/%y"),
						"author": row[2]	
					})
				conn.close()
				return announcements
			else:
				return False
		except Exception as e:
			print(e)
			return False

	def fetchLatest(self):
		conn = self.conn.cursor()
		sql = f"""
				SELECT a.`body`,a.`ts`,b.`adminName`, c.totcount
				FROM `{self.tableName}` a , (
					SELECT `id`,`name` as `adminName`
					FROM `{self.adminTable}`
				) b,
				(
					select count(*) as totcount 
					from announcement
				) c
				WHERE a.`byAdmin` = b.`id`
				ORDER BY a.`id` DESC
				LIMIT 1
			"""
		conn.execute(sql)
		res = conn.fetchone()
		if res:
			print(res)
			count = res[3]
			announcement = {
				"text": res[0],
				"on": res[1].strftime("%d/%m/%y"),
				"author": res[2],
				"more": count>1
			}
			conn.close()
			return announcement
		return False

	def create(self,body,aid):
		conn = self.conn.cursor()
		try:
			sql = f"""
				INSERT INTO {self.tableName}(`id`, `byAdmin`, `body`, `ts`)
				VALUES(NULL,%s,%s,CURRENT_TIMESTAMP());
			"""
			vals = (aid,body)
			conn.execute(sql,vals)

			self.conn.commit()
			conn.close()
			return True
		except:
			self.conn.rollback()
			return error("SERVER_ERROR")