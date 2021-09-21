import { URL } from "../globals"
const axios = require("axios")

export default async function hit(path,parmas){
	return await new Promise((r,e)=>{
		axios.post(URL+path,parmas)
		.then((c)=>{
			r(c.data)
		})
		.catch((err)=>{
			r({
				error:{
					code: 0,
					msg: "Some internal server error occured"
				}
			})
		})
	})
	
}