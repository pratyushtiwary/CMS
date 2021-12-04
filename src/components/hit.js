import { URL } from "../globals"
import Session from "./Session"
import axios from "axios"

let isOffline = false;

export default async function Hit(path,params,haveFiles=false){

	return await new Promise((r,e)=>{
		if(!haveFiles){
				axios.post(URL+path,params)
				.then((c)=>{
					r(c.data)
				})
				.catch((err)=>{
					const error = err.response;
					let code = 0;
					if(error===undefined||code===0){
						isOffline = true;
					}
					else{
						isOffline = false;
					}

					if(error){
						code = error.status;
					}
					if(code === 0){
						r({
							error: {
								code: "NETWORK_ERROR",
								msg: "Unable to connect to the server, please check your internet connection."
							}
						})
					}
					else if(code === 408){
						r({
							error: {
								code: "SERVER_TIMEOUT",
								msg: "Please check your internet connection and try again."
							}
						})
					}
					else if(code === 403){
						r({
							error: {
								code: "SESSION_EXPIRED",
								msg: "Session expired, redirecting to login..."
							}
						});
						Session.clear("_id");
						window.location.href = "/login";
					}
					else{
						r({
							error:{
								code: 0,
								msg: "Some internal server error occured"
							}
						})
					}
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
				const error = err.response;
				let code = 0;
				if(error===undefined||code===0){
					isOffline = true;
				}
				else{
					isOffline = false;
				}

				if(error){
					code = error.status;
				}
				if(code === 0){
					r({
						error: {
							code: "NETWORK_ERROR",
							msg: "Unable to connect to the server, please check your internet connection."
						}
					})
				}
				else if(code === 408){
					r({
						error: {
							code: "SERVER_TIMEOUT",
							msg: "Please check your internet connection and try again."
						}
					})
				}
				else if(code === 403){
					r({
						error: {
							code: "SESSION_EXPIRED",
							msg: "Session expired, redirecting to login..."
						}
					})
					Session.clear("_id");
					window.location.href = "/login";
				}
				else{
					r({
						error:{
							code: 0,
							msg: "Some internal server error occured"
						}
					})
				}
			})

		}
	})
}