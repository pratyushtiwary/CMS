import { useEffect, useState } from "react";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import { Helmet } from "react-helmet";
import { appName } from "../globals";
import first from "../assets/user/main/first.png";
import { Typography, TextField, Button, ListItemText, ListItemIcon, Icon, FormControl, Select, InputLabel, MenuItem } from "@material-ui/core";
import styles from "../styles/user/Complaint.module.css";
import Alert from "../components/Alert";
import Uploader from "../components/Uploader";
import hit from "../components/hit";
import Session from "../components/Session";
import Loading from "../components/Loading";
import { Error, Success } from "../components/Message";

const token = Session.login().token
let err, suc;

export default function Complaint(props){
	const id = props.match.params.id;
	const [complaint,setComplaint] = useState(null);
	const [openDialog,setOpenDialog] = useState(false);
	const [dialogTitle,setDialogTitle] = useState("Update");
	const [val,setVal] = useState("");
	const [openAlert,setOpenAlert] = useState(false);
	const [loaded,setLoaded] = useState(false);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [imgs,setImgs] = useState([]);
	const [loading,setLoading] = useState(null);
	const [ids,setIds] = useState([0]);
	const [departments,setDepartments] = useState(["-"]);
	const [department,setDepartment] = useState(0);


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
		hit("api/fetch/departments",{
			"token": token
		}).then((c)=>{
			if(c.success.msg){
				const is = [];
				const names = [];
				const res = c.success.msg.departments;
				res.forEach((e,i)=>{
					is.push(e.id);
					names.push(e.name);
				});
				setIds((e)=>[...e,...is]);
				setDepartments((e)=>[...e,...names]);
			}
		})
		hit("api/employee/getComplaint",{
			"token": token,
			"cid": id
		}).then((c)=>{
			if(c.success){
				setLoaded(true);
				setComplaint(c.success.msg);
				setImgs([...c.success.msg.imgs]);
			}
			else{
				setLoaded(null);
				setComplaint(1);
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[id]);

	const updateInput = (func) => (e)=>{
		func(e.target.value);
	}

	function changeTextField(e){
		setVal(e.target.value);
	}

	function updateFile(e){
		setImgs([...e]);
	}

	function del(){
		document.querySelector("html").style.overflow = "hidden";
		setOpenAlert(true);
	}

	function update(){
		setVal(complaint.longText);
		setDialogTitle("Update");
		let dept = complaint.dept;
		if(typeof dept === "object"){
			dept = 0;
		}
		let index = 0;
		for(let i=0;i<ids.length;i++){
			if(parseInt(ids[i])===parseInt(dept)){
				index = i;
				break;
			}
		}
		setDepartment(index);
		document.querySelector("html").style.overflow = "hidden";
		setOpenDialog(true);
	}

	function dismiss(){
		document.querySelector("html").style.overflow = "auto";
		setOpenDialog(false);
		setOpenAlert(false);
	}

	function doUpdate(){
		dismiss();
		setLoading("Updating...");
		const formData = new window.FormData();
		const body = val;
		const oldImgs = [];
		const cid = id;
		let dept = ids[department];
		formData.append("cid",cid);
		formData.append("body",body);
		formData.append("dept",dept);
		formData.append("token",token);
		imgs.forEach((e,i)=>{
			if(typeof e === "string"){
				oldImgs.push(e);
			}
			else{
				formData.append("file"+i,e);
			}
		});
		formData.append("oldImgs",JSON.stringify(oldImgs));
		hit("api/employee/updateComplaint",formData,true)
		.then((c)=>{
			setLoading(null);
			setLoaded(false);
			if(c.success){
				setSuccessMsg("Complaint Updated Successfully!");
				hit("api/employee/getComplaint",{
					"token": token,
					"cid": id
				}).then((c)=>{
					if(c.success){
						setLoaded(true);
						setComplaint(c.success.msg);
					}
					else{
						setLoaded(null);
						setComplaint(1);
					}
				});
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function doRepost(){
		dismiss();
		setLoading("Reposting...");
		const formData = new window.FormData();
		const body = val;
		const oldImgs = [];
		const cid = id;
		let dept = ids[department];
		formData.append("cid",cid);
		formData.append("body",body);
		formData.append("dept",dept);
		formData.append("token",token);
		imgs.forEach((e,i)=>{
			if(typeof e === "string"){
				oldImgs.push(e);
			}
			else{
				formData.append("file"+i,e);
			}
		});
		formData.append("oldImgs",JSON.stringify(oldImgs));
		hit("api/employee/repostComplaint",formData,true)
		.then((c)=>{
			setLoading(null);
			if(c.success){
				setSuccessMsg("New Complaint Opened Successfully!");
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function doDelete(){
		dismiss();
		setLoading("Deleting...");
		hit("api/employee/deleteComplaint",{
			"token": token,
			"cid": id
		}).then((c)=>{
			setLoading(null);
			setSuccessMsg(null);
			setErrorMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
				window.location.href = "/complaints";
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function repost(){
		setVal(complaint.longText);
		setDialogTitle("Repost");
		let dept = complaint.dept;
		if(typeof dept === "object"){
			dept = 0;
		}
		let index = 0;
		for(let i=0;i<ids.length;i++){
			if(parseInt(ids[i])===parseInt(dept)){
				index = i;
				break;
			}
		}
		setDepartment(index);
		document.querySelector("html").style.overflow = "hidden";
		setOpenDialog(true);
	}

	return (
		<>
			<Helmet>
				<title>Complaint {id} - {appName}</title>
			</Helmet>
			<Header
				title = {"Complaint"}
				items = {["Home","Complaints","Announcements","Settings"]}
				links = {["/","/complaints","/announcements","/settings"]}
				icons = {["home","segment","campaign","settings"]}
			/>
			<div className={styles.cont}>
				<Success open={Boolean(successMsg)} message={successMsg} />
				<Error open={Boolean(errorMsg)} message={errorMsg} />
				{
					complaint!==1 && loaded===true && complaint && (
						<>
							<div className={styles.complaint} style={{minHeight:"80vh"}}>
								<div className={styles.main+" "+styles.first+" "+styles.inline}>
									<Typography variant="subtitle2" className={styles.title}>Complaint ID :- </Typography>
									<Typography variant="subtitle1">{id}</Typography>
								</div>
								<div className={styles.main}>
									<Typography variant="subtitle2" className={styles.title}>Complaint Description :-</Typography>
									<Typography variant="subtitle1">{complaint.longText}</Typography>
								</div>
								<div className={styles.main}>
									{
										complaint.imgs.length > 0 && (
											<>
												<Typography variant="subtitle2" className={styles.title}>Images :-</Typography>
												<div className={styles.image}>
													{
														<Uploader 
															defaultImgs={complaint.imgs}
															clickable
															rem={false}
														/>
													}
												</div>
											</>
										)
									}
								</div>
								<div className={styles.main+" "+styles.inline}>
									<Typography variant="subtitle2" className={styles.title}>Complaint Date :- </Typography>
									<Typography variant="subtitle1">{complaint.date}</Typography>
								</div>
								<div className={styles.main+" "+styles.inline}>
									<Typography variant="subtitle2" className={styles.title}>Complaint Status :- </Typography>
									<Typography variant="subtitle1" className={styles.status+" "+styles[complaint.status]}>{complaint.status}</Typography>
								</div>
								{
									complaint.status === "resolved" && complaint.msg && (
										<div className={styles.main+" "+styles.inline}>
											<Typography variant="subtitle2" className={styles.title}>Resolution :- </Typography>
											<Typography variant="subtitle1">{complaint.msg}</Typography>
										</div>

									)
								}
								{
									complaint.status === "error" && complaint.msg && (
										<div className={styles.main+" "+styles.inline}>
											<Typography variant="subtitle2" className={styles.title}>Error :- </Typography>
											<Typography variant="subtitle1">{complaint.msg}</Typography>
										</div>

									)
								}

								<div className={styles.actions}>
									{
										complaint.status !== "resolved" && (
											<Button variant="outlined" color="primary" onClick={update} className={styles.action}>
												<ListItemIcon><Icon>edit</Icon></ListItemIcon>
												<ListItemText>Update</ListItemText>
											</Button>
										)
									}
									<Button variant="outlined" color="primary" onClick={repost} className={styles.action}>
										<ListItemIcon><Icon>restart_alt</Icon></ListItemIcon>
										<ListItemText>Repost</ListItemText>
									</Button>
									<Button variant="outlined" color="primary" onClick={del} className={styles.action}>
										<ListItemIcon><Icon>delete</Icon></ListItemIcon>
										<ListItemText>Delete</ListItemText>
									</Button>
								</div>
							</div>
							<Dialog
								title = {dialogTitle+" Complaint"}
								open = {openDialog}
								className={styles.update}
								fullScreen={true}
								buttons = {[{
									onClick: dismiss,
									content: "Dismiss"
								},{
									onClick: ((dialogTitle==="Update")?doUpdate:doRepost),
									content: dialogTitle
								}]}
							>
								<div className={styles.cont}>
									<TextField
										multiline
										rows={10}
										variant="outlined"
										label="Complaint Description"
										value={val}
										onChange={changeTextField}
										className={styles.input}
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
									<div className={styles.image}>
										<Typography variant="subtitle2" className={styles.title}>Images</Typography>
										<Uploader 
											defaultImgs={complaint.imgs}
											onFile={updateFile}
										/>
									</div>
								</div>
							</Dialog>
							<Alert
								title = "Delete Confirmation"
								msg = "Are you sure you want to delete this complaint?"
								buttons = {[{
									content: "Delete",
									onClick: doDelete
								}]}
								onClose = {dismiss}
								open = {openAlert}
							/>
						</>
					)
				}
				{
					complaint===1 && loaded===null && (
						<div className={styles.notFound}>
							<img 
								src = {first}
								alt = "No Complaints Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>Complaint {id} not found</Typography>
							</div>
						</div>
					) 
				}
				{
					loaded===false && (
						<div className={styles.skeleton}>
							<div className={styles.id}></div>
							<div className={styles.desc}></div>
							<div className={styles.date}></div>
							<div className={styles.status}></div>
						</div>
					)
				}	
			</div>
			<Loading
				open = {Boolean(loading)}
				msg = {loading}
			/>
		</>
	)
}