import { URL } from "../globals"
const axios = require("axios")

export default async function hit(path,params,haveFiles=false){
	return await new Promise((r,e)=>{
		if(!haveFiles){
				axios.post(URL+path,params)
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
			
		}
		else{
			const config = {
				headers: {
					"content-type": "multipart/form-data"
				}
			}
			const formData = params;
			axios.post(URL+path,formData,config)
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

		}
	})
}