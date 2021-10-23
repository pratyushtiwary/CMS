import Header from "../components/Header";
import Head from "../components/Head";
import { useState, useEffect } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import styles from "../styles/user/NewComplaint.module.css";
import { appName } from "../globals";
import Uploader from "../components/Uploader";
import Loading from "../components/Loading";
import hit from "../components/hit";
import { Error, Success } from "../components/Message";
import Session from "../components/Session";

export default function NewComplaint(props){
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [loaded,setLoaded] = useState(false);
	const [imgs,setImgs] = useState([]);
	const [ids,setIds] = useState([0]);
	const [complaint,setComplaint] = useState(null);
	const [departments,setDepartments] = useState(["-"]);
	const [department,setDepartment] = useState(0);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);

	useEffect(()=>{
		let token = Session.login().token;
		hit("api/fetch/departments",{
			"token": token
		})
		.then((c)=>{
			setSuccessMsg(null);
			setErrorMsg(null);
			if(c.success){
				const depts = c.success.msg.departments;
				let newDepartments = [...departments];
				let newIds = [...ids];
				depts.forEach((e,i)=>{
					newIds[i+(ids.length)] = e.id;
					newDepartments[i+(departments.length)] = e.name;
				});
				setIds([...newIds]);
				setDepartments([...newDepartments]);
				setLoaded(true);
			}

			if(c.error){
				setLoaded(null);
				setErrorMsg("Unable to load page, to continue please refresh...");
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);

	function onFile(e){
		setImgs([...e]);
	}

	const updateInput = (func) => (e)=>{
		func(e.target.value);
	}

	function submitComplaint(e){
		e.preventDefault();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Creating new complaint...");
		const formData = new window.FormData();
		let token = Session.login().token;
		formData.append("body",complaint);
		formData.append("dept",ids[department]);
		formData.append("token",token);

		imgs.forEach((e,i)=>{
			formData.append("file"+i,e);
		});

		hit("api/employee/newComplaint",formData)
		.then((c)=>{
			setLoaderMsg(null);
			
			if(c.success){
				setLoaded(null);
				setSuccessMsg(c.success.msg);
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}

		})

	}

	return (
		<>
			<Head>
				<title>New Complaint - {appName}</title>
			</Head>
			<Header
				title = "New Complaint"
				hideNewComplaint = {true}
				items = {["Home","Complaints","Announcements","Settings"]}
				icons = {["home","segment","campaign","settings"]}
				links = {["/","/complaints","/announcements","/settings"]}
			/>
			{
				loaded === null && (
					<div className={styles.cont}>
						<Success open={Boolean(successMsg)} message={successMsg}/>
						<Error open={Boolean(errorMsg)} message={errorMsg}/>
					</div>
				)
			}
			{
				loaded && (
					<form className={styles.cont} onSubmit={submitComplaint}>
						<Error open={Boolean(errorMsg)} message={errorMsg}/>
						{
							Boolean(errorMsg) && <br/>
						}
						<TextField 
							variant="outlined"
							label = "Complaint Message"
							multiline
							rows={9}
							value={complaint}
							onChange={updateInput(setComplaint)}
							className={styles.txtAr}
							required
						/>
						<FormControl variant="outlined" className={styles.input}>
					        <InputLabel htmlFor="departmentType" variant="outlined">Department</InputLabel>
					        <Select
					          id = "departmentType"
					          color="primary"
					          value={department}
					          variant="outlined"
					          label="Department"
					          onChange={updateInput(setDepartment)}
							  required
					        >
					        {
					        	departments.map((e,i)=>(
							          <MenuItem value={i} key={i}>{e}</MenuItem>
					        	))
					        }
					        </Select>
					    </FormControl>
						<Uploader 
							onFile={onFile}
						/>
						<Button 
							type = "submit"
							variant="contained" 
							color="primary"
							className={styles.submit}
						>Submit</Button>
					</form>	
				)
			}

			{
				loaded===false && (
					<div className={styles.skeleton}>
						<div className={styles.complaintInput}></div>
						<div className={styles.departmentSelector}></div>
						<div className={styles.imgSelector}></div>
						<div className={styles.submitButton}></div>
					</div>
				)
			}
			
			<Loading
				open = {Boolean(loaderMsg)}
				msg = {loaderMsg}
			/>
		</>
	)
}