import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Typography, Card, CardActionArea, Button, Icon, CircularProgress, TextField } from "@material-ui/core";
import styles from "../styles/admin/Employee.module.css";
import Session from "../components/Session";
import hit from "../components/hit";
import errorImg1 from "../assets/admin/errorImg1.svg";
import errorImg2 from "../assets/admin/errorImg2.svg";
import Dialog from "../components/Dialog";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import { Error, Success } from "../components/Message";

const token = Session.login().token;
const limit = 10;
let offset = 0;
let err, suc;
export default function Employee(props){

	const id = props.match.params.id;
	const [employee,setEmployee] = useState(null);
	const [complaints,setComplaints] = useState([]);
	const [loaded,setLoaded] = useState(null);
	const [more,setMore] = useState(false);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [roomNo,setRoomNo] = useState("");
	const [openDialog,setOpenDialog] = useState(null);
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [openAlert,setOpenAlert] = useState(null);
	const [action,setAction] = useState(null);

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
		function loadInitComplaints() {
			hit("api/admin/loadEmployeeComplaints",{
				"token": token,
				"id": id,
				"offset": offset
			}).then((c)=>{
				setLoaded(true);
				if(c.success){
					offset += limit;
					if(c.success.msg.count > offset){
						setMore(true);
					}
					else{
						setMore(false);
					}

					setComplaints([...c.success.msg.complaints]);
				}
			})
		}

		hit("api/admin/loadEmployee",{
			"token": token,
			"id": id
		}).then((c)=>{
			if(c.success){
				loadInitComplaints();
				setEmployee(c.success.msg);
			}
			else{
				setLoaded(false);
			}
		})
	},[id])

	function dismissDialog() {
		setOpenDialog(false);
	}

	function dismissAlert() {
		setOpenAlert(false);
	}

	function dismissActivationAlert() {
		setAction(null);
	}

	function validateRoomNo(e) {
		const val = e.currentTarget.value;
		if(val.match(/^([0-9]*)$/g)){
			setRoomNo(val);
		}
	}

	function openDeactivateAccountAlert() {
		setAction("deactivate");
	}

	function openActivateAccountAlert() {
		setAction("activate");
	}

	function openChangeRoomNoDialog(argument) {
		setRoomNo(employee.roomNo);
		setOpenDialog(true);
	}

	function openDeleteEmployeeAlert(argument) {
		setOpenAlert(true);
	}

	function activateAccount() {
		dismissActivationAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Activating Account...");
		hit("api/admin/toggleEmployeeAccountActivation",{
			"token": token,
			"id": id,
			"active": 1
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				let oldEmpData = employee;
				oldEmpData.active = 1;
				setEmployee(oldEmpData);
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function deactivateAccount() {
		dismissActivationAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Deactivating Account...");
		hit("api/admin/toggleEmployeeAccountActivation",{
			"token": token,
			"id": id,
			"active": 0
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				let oldEmpData = employee;
				oldEmpData.active = 0;
				setEmployee(oldEmpData);
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}


	function deleteEmployee() {
		dismissAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Deleting Employee...");
		hit("api/admin/deleteEmployee",{
			"token": token,
			"id": id
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				setEmployee(null);
				setLoaded(false);
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function changeRoomNo() {
		dismissDialog();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Changing Room No....");
		hit("api/admin/changeEmployeeRoomNo",{
			"token": token,
			"id": id,
			"newRoomNo": roomNo
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				let oldEmpData = employee;
				oldEmpData.roomNo = roomNo;
				setEmployee(oldEmpData);
				setSuccessMsg(c.success.msg)
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function loadComplaints() {
		hit("api/admin/loadVendorComplaints",{
			"token": token,
			"id": id,
			"offset": offset
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				if(c.success.msg.count > offset){
					setMore(true);
				}
				else{
					setMore(false);
				}

				setComplaints((e)=>[...e,...c.success.msg.complaints]);
			}
		})
	}

	function loadMore(){
		setLoadingMsg("Loading...");
		loadComplaints();
		offset += limit;
	}

	return (
		<>
			<Head>
				<title>View Employee - {appName}</title>
			</Head>
			<Header
				title = "View Employee"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<Success open={Boolean(successMsg)} message={successMsg} float />
			<Error open={Boolean(errorMsg)} message={errorMsg} float />
			<div className={styles.cont}>
				{

					employee && loaded === true && (
						<>
							<div className={styles.meta}>
								<div className={styles.initial}>{employee.name[0]}</div>
								<div className={styles.info}>
									<Typography variant="subtitle2">{employee.id}</Typography>
									<Typography variant="h5">{employee.name}</Typography>
									<Typography variant="subtitle1">Room No. :- {employee.roomNo}</Typography>
									<Typography variant="subtitle1">Email :- {employee.email}</Typography>
									<Typography variant="subtitle1">Phone :- {employee.phone}</Typography>
									<Typography variant="subtitle1">{employee.on}</Typography>
								</div>
							</div>
							<div className={styles.options}>
								<Button className={styles.input} variant="outlined" color="primary" onClick={openChangeRoomNoDialog}>
									<Icon>swap_horiz</Icon> Change Room No.
								</Button>
								<Button className={styles.input} variant="outlined" color="primary" onClick={openDeleteEmployeeAlert}>
									<Icon>delete</Icon> Delete Account
								</Button>
								{
									employee.active===1 && (
										<Button className={styles.input} variant="outlined" color="primary" onClick={openDeactivateAccountAlert}>
											<Icon>toggle_off</Icon> Deactivate Account
										</Button>
									)
								}
								{
									employee.active===0 && (
										<Button className={styles.input} variant="outlined" color="primary" onClick={openActivateAccountAlert}>
											<Icon>toggle_on</Icon> Activate Account
										</Button>
									)
								}
							</div>
							<div className={styles.complaints}>
								<div className={styles.title}>
									<div className={styles.line}></div>
									<Typography variant="h6" className={styles.content}>Complaints</Typography>
								</div>
								{
									complaints.length > 0 && complaints && complaints.map((e,i)=>(
										<Card className={styles.complaint} variant="outlined" key={i}>
											<CardActionArea href={"/complaint/"+e.id} className={styles.inner}>
												<Typography variant="h5" className={styles.content}>{e.title}</Typography>
												<Typography variant="subtitle1" className={styles.content}>Status :- <span className={styles[e.status]}>{e.status}</span></Typography>
												<Typography variant="subtitle1" className={styles.content}>Priority :- <span className={styles[e.priority]}>{e.priority}</span></Typography>
												<Typography variant="subtitle1" className={styles.content}>On :- <span>{e.on}</span></Typography>
											</CardActionArea>
										</Card>
									))
								}
								{
									loaded===true && more && !Boolean(loadingMsg) && (
										<Button variant="outlined" className={styles.loadMore} color="primary" onClick={loadMore}>Load More</Button>
									)
								}
								{
									loaded===true && more && Boolean(loadingMsg) && (
										<div className={styles.loadingNext}>
											<CircularProgress size={24} color="primary" className={styles.circle} />
											<Typography variant="subtitle1" className={styles.txt}>{loadingMsg}</Typography>
										</div>	
									)
								}
								{
									complaints.length === 0 && (
										<div className={styles.notFound}>
											<img 
												src = {errorImg2}
												alt = "No Complaints Found Illustration"
												width = "300px"
												heigth = "300px"
												className = {styles.img}
											/>
											<div className={styles.msg}>
												<Typography variant="h5" className={styles.title}>No Complaints Found</Typography>
											</div>
										</div>
									)
								}
							</div>
						</>
					)
				}
				{
					!employee && loaded===false && (
						<div className={styles.notFound}>
							<img 
								src = {errorImg1}
								alt = "No Employee Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Employee Found</Typography>
							</div>
						</div>
					)
				}
				{
					loaded === null && (
						<div className={styles.skeleton}>
							<div className={styles.main}>
								<div className={styles.initial}></div>
								<div className={styles.content}>
									<div className={styles.block1}></div>
									<div className={styles.block2}></div>
									<div className={styles.block2}></div>
								</div>
							</div>
							<div className={styles.options}>
								<div className={styles.btn}></div>
								<div className={styles.btn}></div>
								<div className={styles.btn}></div>
							</div>
							<div className={styles.seperator}></div>
							<div className={styles.complaint}></div>
							<div className={styles.complaint}></div>
							<div className={styles.loadMore}></div>
						</div>
					)
				}
			</div>
			<Alert
				title = "Delete Confirmation"
				buttons = {[{
					content: "Delete",
					onClick: deleteEmployee
				}]}
				onClose = {dismissAlert}
				open = {openAlert}
			>
				Are you sure you want to delete this employee?
				<br/><br/>
				<b>Deleting this employee will delete all of his/her complaints.</b>
			</Alert>
			<Alert
				title = {(action==="activate"?"Activate":"Deactivate")+" Account Confirmation"}
				buttons = {[{
					content: (action),
					onClick: (action==="activate"?activateAccount:deactivateAccount)
				}]}
				onClose = {dismissActivationAlert}
				open = {Boolean(action)}
			>
				Are you sure you want to {action} this employee's account?
			</Alert>
			<Dialog
				title = {"Change Room No."}
				open = {openDialog}
				className={styles.dialog}
				buttons = {[{
					onClick: dismissDialog,
					content: "Dismiss"
				},{
					onClick: changeRoomNo,
					content: "Change"
				}]}
			>
				<TextField
					label="Room No."
					variant="outlined"
					color="primary"
					value={roomNo}
					onChange={validateRoomNo}
				/>
			</Dialog>
			<Loading
				open = {Boolean(loaderMsg)}
				msg = {loaderMsg}
			/>
		</>
	)
}