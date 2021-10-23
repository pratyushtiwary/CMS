import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/user/Settings.module.css";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { useState, useEffect } from "react";
import hit from "../components/hit";
import Session from "../components/Session";
import { Success, Error } from "../components/Message";
import Loading from "../components/Loading";
import Alert from "../components/Alert";

const token = Session.login().token;
let err, suc;

export default function Setttings(props){

	const roomTypes = ["For Bachelor","For Family"];
	const [RoomType,setRoomType] = useState(0);
	const [RoomNumber,setRoomNumber] = useState(1234);
	const [name,setName] = useState("");
	const [Email,setEmail] = useState("test@test.com");
	const [notifications,setNotifications] = useState(true);
	const [nameError,setNameError] = useState(null);
	const [ph,setPh] = useState("0000000000");
	const [loaded,setLoaded] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [loading,setLoading] = useState(null);
	const [openAlert,setOpenAlert] = useState(false);

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
		hit("api/employee/fetchDetails",{
			"token": token
		}).then((c)=>{
			if(c.success){
				const data = c.success.msg;

				if(data.accomodation === "family"){
					setRoomType(1);					
				}

				setRoomNumber(data.roomNo);

				setName(data.name);

				setPh(data.phone);

				setEmail(data.email);

				setLoaded(true);

				setNotifications(Boolean(data.notify));


			} else{
				window.location.reload();
			}
		})
	},[]);

	function changeRoomType(e){
		setRoomType(e.target.value);
	}

	function changeRoomNumber(e){
		setRoomNumber(e.target.value);
	}

	function changeEmail(e){
		setEmail(e.target.value);
	}

	function changeName(e){
		const value = e.target.value
		const split = value.split(" ");
		if(split[split.length-1] === ""){
			setNameError("Please Enter Your Full Name")
		}
		else{
			setNameError(null);
		}
		setName(value);
	}

	function changeNotification(){
		setNotifications((n)=>!n)
	}

	function changePh(e){
		const val = e.target.value;
		if(val.match(/^[\d]*$/) && val.length<=10){
			setPh((val));
		}
	}

	function submit(e){
		e.preventDefault();
		setLoading("Saving Settings...");
		setSuccessMsg(null);
		setErrorMsg(null);
		const data = {
			"token": token,
			"name": name,
			"roomNo": RoomNumber,
			"phone": ph,
			"email": Email,
			"accomodation": (RoomType===1?"family":"bachelor"),
			"notify": notifications?"1":"0"
		}
		hit("api/employee/setDetails",data)
		.then((c)=>{
			setLoading(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function dismiss(){
		setOpenAlert(false);
	}

	function resetPass(){
		Session.clear("_id");
		window.location.href = "/forget_password";
	}

	return (
		<>
			<Head>
				<title>Settings - {appName}</title>
			</Head>
			<Header
				title = "Settings"
				items = {["Home","Complaints","Announcements"]}
				links = {["/","/complaints","/announcements"]}
				icons = {["home","segment","campaign"]}
			/>
			{
				loaded===true && (
					<>
						<Success open={Boolean(successMsg)} message={successMsg} float/>
						<Error open={Boolean(errorMsg)} message={errorMsg} float/>
						<form className={styles.cont} onSubmit={submit}>
							<FormControl variant="outlined" className={styles.input}>
						        <InputLabel htmlFor="userType" variant="outlined">Accomodation Type</InputLabel>
						        <Select
						          color="primary"
						          value={RoomType}
						          variant="outlined"
						          label="Accomodation Type"
						          onChange={changeRoomType}
								  required
						        >
						        {
						        	roomTypes.map((e,i)=>(
							          <MenuItem value={i} key={i}>{e}</MenuItem>
						        	))
						        }
						        </Select>
						    </FormControl>
						    <TextField 
							    className={styles.input}
						    	type="text" 
						    	label="Room Number"
						    	variant="outlined"
						    	value={RoomNumber}
						    	onChange={changeRoomNumber}
						    	required
					    	/>
					    	<TextField 
							    className={styles.input}
						    	type="text" 
						    	label="Name"
						    	variant="outlined"
						    	value={name}
						    	error = {Boolean(nameError)}
						    	helperText = {nameError}
						    	onChange={changeName}
						    	required
					    	/>
					    	<TextField 
							    className={styles.input}
						    	type="email" 
						    	label="Email"
						    	variant="outlined"
						    	value={Email}
						    	onChange={changeEmail}
						    	required
					    	/>
					    	<TextField
								type="text"
								variant="outlined"
								label="Phone no."
								id="phone"
								value = {ph}
								onChange = {changePh}
								inputMode = "numeric"
								pattern = "[0-9]*"
								className={styles.input}
								required
							/>
					    	<FormControlLabel
						        control={
						          <Checkbox
						            checked={notifications}
						            onChange={changeNotification}
						            color="primary"
						          />
						        }
						        label="Recieve Notifications (Email and Mobile notifications)"
						      />
					      	<Button
					    		type="submit"
					    		variant="contained"
					    		color="primary"
					    		className={styles.button}
					    	>Save</Button>
						    <Button
								variant="outlined"
					    		color="primary"
					    		className={styles.button}
					    		onClick = {()=>setOpenAlert(true)}
						    >Reset Password</Button>	
						</form>
						<Alert
							title = "Reset Confirmation"
							msg = "You will be logged out and redirected to forget password page. Would you like to continue"
							buttons = {[{
								content: "Reset Password",
								onClick: resetPass
							}]}
							onClose = {dismiss}
							open = {openAlert}
						/>
					</>
				)
			}
			{
				loaded===null && (
					<div className={styles.skeleton}>
						<div className={styles.option}></div>
						<div className={styles.option}></div>
						<div className={styles.option}></div>
						<div className={styles.option}></div>
						<div className={styles.option}></div>
						<div className={styles.option}></div>
						<div className={styles.notify}></div>
						<div className={styles.button}></div>
						<div className={styles.button}></div>
					</div>
				)
			}
			<Loading
				open = {Boolean(loading)}
				msg = {loading}
			/>
		</>
	)
}