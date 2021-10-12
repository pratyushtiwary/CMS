import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/NewAnnouncement.module.css";
import { TextField, Button } from "@material-ui/core";
import Loading from "../components/Loading";
import { useState, useEffect } from "react";
import { Error, Success } from "../components/Message";
import Session from "../components/Session";
import hit from "../components/hit";

const token = Session.login().token
let err;
export default function NewAnnouncement(props){
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [body,setBody] = useState("");

	useEffect(()=>{
		clearTimeout(err)
		err = setTimeout(()=>{
			setErrorMsg(null);
		},4500);
	},[errorMsg])

	function post(e){
		e.preventDefault();
		setLoadingMsg("Creating Announcement...");
		const b = body;
		hit("api/admin/createAnnouncement",{
			"token": token,
			"body": b
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				setSuccessMsg("Announcement created successfully!");
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	return (
		<>
			<Helmet>
				<title>New Announcement - {appName}</title>
			</Helmet>
			<Header
				title = "New Announcement"
				items = {["Home","New User","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<form className={styles.cont} onSubmit={post}>
				<Success open={Boolean(successMsg)} message={successMsg} />
				<Error open={Boolean(errorMsg)} message={errorMsg} />
				{
					!successMsg && (
						<>
							<TextField
								label="Announcement Body"
								variant="outlined"
								autoFocus
								rows={15}
								multiline
								required
								className={styles.body}
								value={body}
								onChange={(e)=>setBody(e.currentTarget.value)}
							/>
							<Button type="submit" variant="contained" color="primary" className={styles.post}>Post</Button>
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