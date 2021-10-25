def exists(keys: list, d: dict,parseDifferent:bool=False):
	"""
		Takes in keys:list, d:dict
		search whether provided keys exists in the dictionary
		`parseDifferent` 3rd param is used for parsing data received from request.form (default to False)
	"""
	if parseDifferent:
		total = len(keys)
		dkeys = list(d.keys())
		sum = 0
		try:
			for key in keys:
				if type(d[key])!=bool and d[key]!=False:
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
				if type(val)==bool and val==False:
					continue
				sum += 1

			if sum == total:
				return True

			return False
		else:
			return False