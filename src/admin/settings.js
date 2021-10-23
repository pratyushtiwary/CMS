import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/Settings.module.css";
import { Typography, TextField, Button } from "@material-ui/core";
import Session from "../components/Session";
import hit from "../components/hit";
import { useState, useEffect } from "react";
import { Error, Success } from "../components/Message";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

const token = Session.login().token
let err, suc;
export default function Settings() {
	const [name,setName] = useState("");
	const [phone,setPhone] = useState("");
	const [aid,setAid] = useState("");
	const [email,setEmail] = useState("");
	const [loaded,setLoaded] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [openAlert,setOpenAlert] = useState(false);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [openResetPassAlert,setOpenResetPassAlert] = useState(false);

	useEffect(()=>{
		clearTimeout(suc)
		suc = setTimeout(()=>{
			setSuccessMsg(null);
		},4500);
	},[successMsg])

	useEffect(()=>{
		clearTimeout(err)
		err = setTimeout(()=>{
			setErrorMsg(null);
		},4500);
	},[errorMsg])

	useEffect(()=>{
		hit("api/admin/fetchDetails",{
			"token": token
		}).then((c)=>{
			if(c.success){
				setName(c.success.msg.name);
				setEmail(c.success.msg.email);
				setPhone(c.success.msg.phone);
				setAid(c.success.msg.adminId);
				setLoaded(true);
			}
			else{
				setErrorMsg(c.error.msg);
				setLoaded(false);
			}
		})
	},[])

	function dismissAlert() {
		setOpenAlert(false);
	}

	function dismissResetPassAlert() {
		setOpenResetPassAlert(false);
	}

	function doDelete() {
		dismissAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoadingMsg("Deleting Account...");
		hit("api/admin/deleteAccount",{
			"token": token
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
				Session.clear("_id");
				setTimeout(()=>{
					window.location.href = "/login";
				},3000);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function resetPass() {
		setSuccessMsg(null);
		setErrorMsg(null);
		dismissResetPassAlert();
		setLoadingMsg("Loggging Out...");
		Session.clear("_id");
		window.location.href = "/login";
	}

	function save(e) {
		e.preventDefault();
		setLoadingMsg("Saving...");
		setSuccessMsg(null);
		setErrorMsg(null);
		hit("api/admin/saveSettings",{
			"token": token,
			"name": name,
			"email": email,
			"phone": phone,
			"aid": aid
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
				<title>Settings - {appName}</title>
			</Head>
			<Header
				title = "Settings"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people"]}
				hideNewComplaint
			/>
			<Success open={successMsg} message={successMsg} float/>
			<Error open={errorMsg} message={errorMsg} float/>
			<form className={styles.cont} onSubmit={save}>
				{
					loaded===true && (
						<>
							<TextField
								label="Full Name"
								variant="outlined"
								color="primary"
								value={name}
								onChange={(e)=>setName(e.currentTarget.value)}
								className={styles.input}
								required
							/>
							<TextField
								label="Email"
								variant="outlined"
								color="primary"
								value={email}
								onChange={(e)=>setEmail(e.currentTarget.value)}
								className={styles.input}
								required
							/>
							<TextField
								label="Phone"
								variant="outlined"
								color="primary"
								value={phone}
								onChange={(e)=>setPhone(e.currentTarget.value)}
								className={styles.input}
								required
							/>
							<TextField
								label="Admin Id"
								variant="outlined"
								color="primary"
								value={aid}
								onChange={(e)=>setAid(e.currentTarget.value)}
								className={styles.input}
								required
							/>
							<div className={styles.btnGrp}>
								<Button
									className={styles.btn}
									variant="outlined"
									color="primary"
									onClick={()=>setOpenResetPassAlert(true)}
								>
									Reset Password
								</Button>
								<Button
									className={styles.btn+" "+styles.warning}
									variant="outlined"
									color="primary"
									onClick={()=>setOpenAlert(true)}
								>
									Delete Account
								</Button>
							</div>
							<Button
								className={styles.btn}
								variant="contained"
								color="primary"
								type="submit"
							>
								Save
							</Button>
						</>
					)
				}
				
				{
					loaded === null && (
						<div className={styles.skeleton}>
							<div className={styles.input}></div>
							<div className={styles.input}></div>
							<div className={styles.input}></div>
							<div className={styles.input}></div>
							<div className={styles.btnGrp}>
								<div className={styles.btn+" "+styles.left}></div>
								<div className={styles.btn+" "+styles.right}></div>
							</div>
							<div className={styles.btn}></div>
						</div>
					)
				}
			</form>
			<Alert
				title = "Delete Confirmation"
				buttons = {[{
					content: "Delete",
					onClick: doDelete
				}]}
				onClose = {dismissAlert}
				open = {openAlert}
			>
				<center>
					<Typography><b>All your announcements will be deleted</b></Typography>
					<br/>
					<Typography><b>This action can't be undone</b></Typography>
					<br/>
					<Typography><b>Are you sure you want to delete your account?</b></Typography>
				</center>
			</Alert>
			<Alert
				title = "Reset Password Confirmation"
				buttons = {[{
					content: "Continue",
					onClick: resetPass
				}]}
				onClose = {dismissResetPassAlert}
				open = {openResetPassAlert}
			>
				<center>
					You will be logged out and redirected to the forget_password page
				</center>
			</Alert>
			<Loading
				open={Boolean(loadingMsg)}
				msg={loadingMsg}
			/>
		</>
	)
}