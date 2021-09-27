def exists(keys: list, d: dict,parseDifferent:bool=False):
	if parseDifferent:
		total = len(keys)
		dkeys = list(d.keys())
		sum = 0
		try:
			for key in keys:
				if d[key]!=False:
					sum+=1
			if sum == total:
				return True
			else:
				return False
		except:
			return False
	else:
		total = len(keys)
		sum = 0
		if(type(d) == dict):
			for key in keys:
				val = d.get(key,False)
				if val!=False:
					sum += 1

			if sum == total:
				return True

			return False
		else:
			return False