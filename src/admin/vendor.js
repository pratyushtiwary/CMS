import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Typography, Card, CardActionArea, Button, Icon, CircularProgress, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import styles from "../styles/admin/Vendor.module.css";
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
let err, suc;
let offset = 0;
export default function Vendor(props){

	const id = props.match.params.id;
	const [vendor,setVendor] = useState(null);
	const [complaints,setComplaints] = useState([]);
	const [loaded,setLoaded] = useState(null);
	const [more,setMore] = useState(false);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [departments,setDepartments] = useState([{
		"id": -1,
		"name": "No Department"
	}])
	const [openDialog,setOpenDialog] = useState(false);
	const [openAlert,setOpenAlert] = useState(false);
	const [action,setAction] = useState(null);
	const [department,setDepartment] = useState(0);
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [deptLoaded,setDeptLoaded] = useState(false);

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
			hit("api/admin/loadVendorComplaints",{
				"token": token,
				"id": id,
				"offset": offset
			}).then((c)=>{
				setLoaded(true);
				hit("api/fetch/departments",{
					"token": token
				}).then((c)=>{
					if(c.success){
						let depts = [...departments,...c.success.msg.departments]
						setDepartments(depts);			
						setDeptLoaded(true);			
					}
					else{
						setErrorMsg("Unable to load departments! Try Refreshing...");
						setDeptLoaded(false);
					}
				});


				if(c.success){
					offset += limit;

					if(c.success.msg.count > offset){
						setMore(true);
					}
					else{
						setMore(false);
					}

					setComplaints(c.success.msg.complaints);
				}
				else{
					setComplaints([]);
				}
			})
		}

		hit("api/admin/loadVendor",{
			"token": token,
			"id": id
		}).then((c)=>{
			if(c.success){
				loadInitComplaints();
				setVendor(c.success.msg);
			}
			else{
				setLoaded(false);
				setVendor(null);
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[id]);

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

	let updateInput = (func) => (e)=> {
		func(e.target.value);
	}

	function openChangeDeptDialog() {
		let currDept = vendor.deptId;
		departments.forEach((e,i)=>{
			if(e.id === currDept){
				setDepartment(i);
			}
		})
		setOpenDialog(true);
	}

	function openDeleteVendorAlert() {
		setOpenAlert(true);
	}

	function dismissDialog() {
		setOpenDialog(false);
	}

	function dismissActivationAlert() {
		setAction(null);
	}

	function dismissAlert() {
		setOpenAlert(false);
	}

	function deleteVendor() {
		dismissAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Deleting Vendor...");
		hit("api/admin/deleteVendor",{
			"token": token,
			"id": id
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
				setLoaded(false);
				setVendor(null);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function changeDepartment() {
		dismissDialog();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Changing Department...");
		const newDept = departments[department].id;
		const newDeptName = departments[department].name;
		if(newDept !== vendor.deptId){
			hit("api/admin/changeVendorDepartment",{
				"token": token,
				"id": id,
				"deptId": newDept
			}).then((c)=>{
				setLoaderMsg(null);
				if(c.success){
					let oldEmpData = vendor;
					oldEmpData.deptId = newDept;
					oldEmpData.department = newDeptName;
					setVendor(oldEmpData);
					setSuccessMsg(c.success.msg);
				}
				else{
					setErrorMsg(c.error.msg);
				}
			})
		}
		else{
			setLoaderMsg(null);
		}
	}

	function openDeactivateAccountAlert() {
		setAction("deactivate");
	}

	function openActivateAccountAlert() {
		setAction("activate");
	}

	function activateAccount() {
		dismissActivationAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Activating Account...");
		hit("api/admin/toggleVendorAccountActivation",{
			"token": token,
			"id": id,
			"active": 1
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				let oldEmpData = vendor;
				oldEmpData.active = 1;
				setVendor(oldEmpData);
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
		hit("api/admin/toggleVendorAccountActivation",{
			"token": token,
			"id": id,
			"active": 0
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				let oldEmpData = vendor;
				oldEmpData.active = 0;
				setVendor(oldEmpData);
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
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
				<title>View Vendor - {appName}</title>
			</Head>
			<Header
				title = "View Vendor"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<Success open={Boolean(successMsg)} message={successMsg} float />
			<Error open={Boolean(errorMsg)} message={errorMsg} float />
			<div className={styles.cont}>
				{

					vendor && loaded===true && (
						<>
							<div className={styles.meta}>
								<div className={styles.initial}>{vendor.name[0]}</div>
								<div className={styles.info}>
									<Typography variant="subtitle2">{vendor.id}</Typography>
									<Typography variant="h5">{vendor.name}</Typography>
									<Typography variant="subtitle1">Department :- {vendor.department}</Typography>
									<Typography variant="subtitle1">Email :- {vendor.email}</Typography>
									<Typography variant="subtitle1">Phone :- {vendor.phone}</Typography>
									<Typography variant="subtitle1">{vendor.on}</Typography>
								</div>
							</div>
							<div className={styles.options}>
								{
									deptLoaded && (
										<Button className={styles.input} variant="outlined" color="primary" onClick={openChangeDeptDialog}>
											<Icon>swap_horiz</Icon> Change Department
										</Button>
									)
								}
								<Button className={styles.input} variant="outlined" color="primary" onClick={openDeleteVendorAlert}>
									<Icon>delete</Icon> Delete Account
								</Button>
								{
									vendor.active===1 && (
										<Button className={styles.input} variant="outlined" color="primary" onClick={openDeactivateAccountAlert}>
											<Icon>toggle_off</Icon> Deactivate Account
										</Button>
									)
								}
								{
									vendor.active===0 && (
										<Button className={styles.input} variant="outlined" color="primary" onClick={openActivateAccountAlert}>
											<Icon>toggle_on</Icon> Activate Account
										</Button>
									)
								}
							</div>
							<div className={styles.complaints}>
								<div className={styles.title}>
									<div className={styles.line}></div>
									<Typography variant="h6" className={styles.content}>Complaints Alloted</Typography>
								</div>
								{
									complaints.length > 0 && complaints.map((e,i)=>(
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
					!vendor && loaded===false && (
						<div className={styles.notFound}>
							<img 
								src = {errorImg1}
								alt = "No Vendor Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Vendor Found</Typography>
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
					onClick: deleteVendor
				}]}
				onClose = {dismissAlert}
				open = {openAlert}
			>
				Are you sure you want to delete this vendor?
				<br/><br/>
				<b>Deleting vendor will deallocate all the complaints alloted to this vendor.</b>
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
				Are you sure you want to {action} this vendor's account?
			</Alert>
			<Dialog
				title = {"Change Department"}
				open = {openDialog}
				className={styles.dialog}
				buttons = {[{
					onClick: dismissDialog,
					content: "Dismiss"
				},{
					onClick: changeDepartment,
					content: "Change"
				}]}
			>
				<Typography className={styles.txt}><b>Changing Department will not deallocate all the alloted complaints to this vendor</b></Typography>
				<br/>
				<FormControl variant="outlined" className={styles.input}>
			        <InputLabel htmlFor="departmentType" variant="outlined">Department</InputLabel>
			        <Select
			          id = "departmentType"
			          color="primary"
			          value={department}
			          variant="outlined"
			          label="Department"
			          className={styles.input}
			          onChange={updateInput(setDepartment)}
					  required
			        >
			        {
			        	departments.map((e,i)=>(
					          <MenuItem value={i} key={i}>{e.name}</MenuItem>
			        	))
			        }
			        </Select>
			    </FormControl>
			</Dialog>
			<Loading
				open = {Boolean(loaderMsg)}
				msg = {loaderMsg}
			/>
		</>
	)
}