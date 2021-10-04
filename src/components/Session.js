import CryptoJS from 'crypto-js';
import { KEY } from "../globals";

const Session = {};

Session.get = (key)=>{
	if(localStorage.getItem(key)!=="\0"){
		return localStorage.getItem(key);
	}
	return undefined;
}

Session.set = (key,value)=>{
	if(!Session.get(key)){
		return localStorage.setItem(key,value);
	}
}

Session.clear = (key)=>{
	localStorage.setItem(key,"\0");
}

Session.setSafe = (key,value)=>{
	let eTxt = CryptoJS.AES.encrypt(value,KEY);
	return localStorage.setItem(key,eTxt);
}

Session.getSafe = (key)=>{
	let txt = localStorage.getItem(key);
	if(txt){
		try{
			txt = CryptoJS.AES.decrypt(txt,KEY).toString(CryptoJS.enc.Utf8);
		}catch{
			return false
		}

	}
	return txt;
}

Session.login = (token=undefined,type="")=>{
	if(token){
		return Session.setSafe("_id",JSON.stringify({"token": token, "type":type}));
	}
	else{
		let data = Session.getSafe("_id");
		if(data){
			data = JSON.parse(data);
		}
		else{
			data = {
				token: false,
				type: false
			}
		}
		return data;
	}
}

export default Session;