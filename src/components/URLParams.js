
export function extract(url){
	if(typeof url === "string"){
		let temp = url.split(/\?/)[1]
		let vals = {}
		if(typeof temp == "string"){
			let k = temp.split("=")
			vals[k[0]] = k[1]
		}
		else if(typeof temp == "object"){
			for(let val in temp){
				let k = val.split("=")
				vals[k[0]] = k[1]
			}			
		}
		return vals
	}
	return undefined;
}
