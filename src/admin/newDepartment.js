import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import { TextField, Button } from "@material-ui/core";
import styles from "../styles/admin/NewDepartment.module.css";
import Session from "../components/Session";
import { useEffect, useState } from "react";
import hit from "../components/hit";
import { Error, Success } from "../components/Message";
import Loading from "../components/Loading";

const token = Session.login().token
let err;
export default function NewDepartment(props){
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [name,setName] = useState("");

	useEffect(()=>{
		clearTimeout(err)
		err = setTimeout(()=>{
			setErrorMsg(null);
		},4500);
	},[errorMsg])

	function create(e){
		e.preventDefault();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoadingMsg("Creating Department...");
		const n = name;
		hit("api/admin/createDepartment",{
			"token": token,
			"name": n
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	return (
		<>
			<Head>
				<title>New Department - {appName}</title>
			</Head>
			<Header
				title = "New Department"
				items = {["Home","New User","New Announcement","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<form className={styles.cont} onSubmit={create}>
				<Success open={Boolean(successMsg)} message={successMsg} />
				<Error open={Boolean(errorMsg)} message={errorMsg} />
				{
					!successMsg && (
						<>
							<TextField
								variant="outlined"
								color="primary"
								label="Department Name"
								className={styles.input}
								value={name}
								onChange={(e)=>setName(e.currentTarget.value)}
								required
							/>
							<Button type="submit" variant="contained" color="primary" className={styles.button}>Create</Button>
						</>
					)
				}
				
			</form>
			<Loading
				open={Boolean(loadingMsg)}
				msg={loadingMsg}
			/>
		</>
	)
}