import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/Complaint.module.css";
import Carousel from "../components/Carousel";
import Feedback from "../components/Feedback";
import { Typography, useMediaQuery, Button, FormControl, InputLabel, Select, MenuItem, TextField, Card, CardActionArea } from "@material-ui/core";
import Alert from "../components/Alert";
import Dialog from "../components/Dialog";
import { useState, useEffect } from "react";
import errorImg2 from "../assets/admin/errorImg2.svg";
import { Error, Success } from "../components/Message";
import Session from "../components/Session";
import hit from "../components/hit";

const token = Session.login().token;
let err, suc;
export default function Complaint(props) {
	const id = props.match.params.id;
	const maxWidth = useMediaQuery("(max-width: 539px)");
	const [openDeleteAlert,setDeleteAlert] = useState(false);
	const [departments,setDepartments] = useState([{"id": -1,"name": "No Department"}]);
	const [department,setDepartment] = useState(0);
	const [openChangeDeptDialog,setChangeDeptDialog] = useState(false);
	const [openSendMessageDialog,setSendMessageDialog] = useState(false);
	const [openAssignVendorDialog,setAssignVendorDialog] = useState(false);
	const [vendors,setVendors] = useState(null);
	const [selected,setSelected] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [deptLoaded,setDeptLoaded] = useState(false);
	const priority = ["Low","Mid","High"];
	const [currPriority,setCurrPriority] = useState(0);
	const [openChangePriorityDialog,setChangePriorityDialog] = useState(false);
	const [complaint,setComplaint] = useState(null);
	const [loaded,setLoaded] = useState(null);

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
		hit("api/admin/viewComplaint",{
			"token": token,
			"id": id
		}).then((c)=>{
			if(c.success){
				setComplaint(c.success.msg);
				setLoaded(true);
			}
			else{
				setComplaint(null);
				setLoaded(false);
			}
		})
		hit("api/fetch/departments",{
			"token": token
		}).then((c)=>{
			if(c.success){
				setDeptLoaded(true);
				setDepartments((e)=>[...e,...c.success.msg.departments]);
			}
			else{
				setDeptLoaded(false);
			}
		})
		setVendors([
			{
				"id": 1,
				"name": "John Doe",
				"complaintCount": 3
			}
		])
	},[id])

	let updateInput = (func) => (e)=> {
		func(e.target.value);
	}

	function dismissDeleteAlert() {
		setDeleteAlert(false);
	}

	function dismissChangeDeptDialog() {
		setChangeDeptDialog(false);
	}

	function dismissSendMessageDialog() {
		setSendMessageDialog(false);
	}

	function dismissAssignVendorDialog() {
		setAssignVendorDialog(false);
	}

	function closeChangePriorityDialog(argument) {
		setChangePriorityDialog(false);
	}

	function doDelete(){

	}

	function changeDepartment() {
	}

	function sendMessage() {
	}

	function setNewPriority() {
	}

	function assignVendor() {
		if(selected===null){
			setErrorMsg("Please select a vendor first");
		}
		else{
			setErrorMsg(null);
		}
	}

	let selectVendor = (i) => ()=>{
		setSelected(i);
	}

	return (
		<>
			<Head>
				<title>View Complaint - {appName}</title>
			</Head>
			<Header
				title = "View Complaint"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<Success open={Boolean(successMsg)} message={successMsg} float />
			<Error open={Boolean(errorMsg)} message={errorMsg} float />
			<div className={styles.cont}>
				{
					loaded===false && !complaint && (
						<div className={styles.notFound}>
							<img 
								src = {errorImg2}
								alt = "No Complaint Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Complaint Found</Typography>
							</div>
						</div>
					)
				}
				{
					loaded===true && complaint && (
						<>
							{
								complaint.imgs && (
									<div className={styles.imgs}>
										<Carousel
											imgs = {complaint.imgs}
										/>
									</div>
								)
							}
							<div className={styles.main}>
								{
									maxWidth && (
										<div className={styles.options}>
											<Button
												variant="outlined"
												color="primary"
												onClick={()=>setDeleteAlert(true)}
											>Delete</Button>
											<Button
												variant="outlined"
												color="primary"
												onClick={()=>setAssignVendorDialog(true)}
											>Assign Vendor</Button>
											{
												deptLoaded && (
													<Button
														variant="outlined"
														color="primary"
														onClick={()=>setChangeDeptDialog(true)}
													>Change Department</Button>
												)
											}
											<Button
												variant="outlined"
												color="primary"
												onClick={()=>setSendMessageDialog(true)}
											>Send Message</Button>
										</div>
									)
								}
								<div className={styles.content}>
									<div className={styles.block}>
										<Typography variant="h6">Complaint Description :- </Typography>
										<Typography className={styles.p}>{complaint.body}</Typography>
									</div>
									<div className={styles.block+" "+styles.inline}>
										<Typography variant="h6">Complaint Status :- </Typography>
										<Typography className={styles.p+" "+styles[complaint.status]}>{complaint.status}</Typography>
									</div>
									<div className={styles.block+" "+styles.inline}>
										<Typography variant="h6">Complaint Priority :- </Typography>
										<Typography className={styles.p+" "+styles[complaint.priority]}>{complaint.priority}</Typography>
										<Button
											variant="outlined"
											color="primary"
											onClick={()=>setChangePriorityDialog(true)}
										>Change Priority</Button>
									</div>
									<div className={styles.block+" "+styles.inline}>
										<Typography variant="h6">Complaint Date :- </Typography>
										<Typography className={styles.p}>{complaint.on}</Typography>
									</div>
									{
										complaint.adminMsg && (
											<div className={styles.block}>
												<Typography variant="h6">Admin Message :- </Typography>
												<Typography className={styles.p}>{complaint.adminMsg}</Typography>
											</div>
										)
									}
									
									<div className={styles.block}>
										<Typography variant="h6">Complaint By :- </Typography>
										<Typography className={styles.p}>Name :- {complaint.emp.name}</Typography>
										<Typography className={styles.p}>RoomNo :- {complaint.emp.roomNo}</Typography>
										<Typography className={styles.p}>Id :- {complaint.emp.id}</Typography>
										<Button 
											variant="outlined"
											href={"/employee/"+complaint.emp.id}
										>View Employee</Button>
									</div>
								</div>
								<div className={styles.side}>
									<div className={styles.items}>
										{
											!maxWidth && (
												<div className={styles.options}>
													<Button
														variant="outlined"
														color="primary"
														onClick={()=>setDeleteAlert(true)}
													>Delete</Button>
													<Button
														variant="outlined"
														color="primary"
														onClick={()=>setAssignVendorDialog(true)}
													>Assign Vendor</Button>
													{
														deptLoaded && (
															<Button
																variant="outlined"
																color="primary"
																onClick={()=>setChangeDeptDialog(true)}
															>Change Department</Button>
														)
													}
													<Button
														variant="outlined"
														color="primary"
														onClick={()=>setSendMessageDialog(true)}
													>Send Message</Button>
												</div>
											)
										}
										{
											complaint.vendorName && (
												<div className={styles.block}>
													<Typography variant="h6">Vendor Assigned :- </Typography>
													<div className={styles.initial}><span>{complaint.vendorName[0]}</span></div>
													<Typography variant="subtitle1" className={styles.txt}>{complaint.vendorName}</Typography>
													{
														complaint.allotmentDate && (
															<Typography variant="subtitle2" className={styles.txt}>Assigned On :- {complaint.allotmentDate}</Typography>
														)
													}
													{
														complaint.msg && (
															<Typography variant="subtitle2" className={styles.txt}>Vendor Message :- {complaint.msg}</Typography>
														)
													}
													<Button 
														href={"/vendor/"+complaint.vendorId}
														variant="outlined"
														className={styles.viewVendor}
													>View Vendor</Button>
												</div>
											)
										}
										{
											complaint.feedback && (
												<>
													{
														complaint.feedback.vendor && (
															<div className={styles.block}>
																<Feedback 
																	feedback={{
																		given: true,
																		rating: complaint.feedback.vendor.rating,
																		feedback: complaint.feedback.vendor.feedback
																	}} 
																	title = "Vendor Feedback"
																	noEdit
																/>
															</div>
														)
													}
													{
														complaint.feedback.employee && (
															<div className={styles.block}>
																<Feedback 
																	feedback={{
																		given: true,
																		rating: complaint.feedback.employee.rating,
																		feedback: complaint.feedback.employee.feedback
																	}} 
																	title = "Employee Feedback"
																	noEdit
																/>
															</div>
														)
													}
												</>
											)
										}
										
									</div>
								</div>
							</div>
						</>
					)
				}
				{
					loaded===null && (
						<div className={styles.skeleton}>
							<div className={styles.imgs}></div>
							<div className={styles.main}>
								{
									maxWidth && (
										<div className={styles.options}>
											<div className={styles.button}></div>
											<div className={styles.button}></div>
											<div className={styles.button}></div>
											<div className={styles.button}></div>
										</div>
									)
								}
								<div className={styles.content}>
									<div className={styles.block}></div>
									<div className={styles.sblock}></div>
									<div className={styles.sblock}></div>
								</div>
								<div className={styles.side}>
									{
										!maxWidth && (
											<div className={styles.options}>
												<div className={styles.button}></div>
												<div className={styles.button}></div>
												<div className={styles.button}></div>
												<div className={styles.button}></div>
											</div>
										)
									}
									<div className={styles.sblock}></div>
								</div>
							</div>
						</div>
					)
				}
			</div>
			<Alert
				title = "Delete Confirmation"
				msg = "Are you sure you want to delete this complaint?"
				buttons = {[{
					content: "Delete",
					onClick: doDelete
				}]}
				onClose = {dismissDeleteAlert}
				open = {openDeleteAlert}
			/>
			<Dialog
				title = {"Change Department"}
				open = {openChangeDeptDialog}
				className={styles.dialog}
				buttons = {[{
					onClick: dismissChangeDeptDialog,
					content: "Dismiss"
				},{
					onClick: changeDepartment,
					content: "Change"
				}]}
			>
				<Typography className={styles.txt}><b>Changing Department will reassign the vendor to NULL</b></Typography>
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
			<Dialog
				title = {"Send Message"}
				open = {openSendMessageDialog}
				className={styles.dialog}
				buttons = {[{
					onClick: dismissSendMessageDialog,
					content: "Dismiss"
				},{
					onClick: sendMessage,
					content: "Send"
				}]}
			>
				<Typography><b>This message will be visible to the assigned vendor only!</b></Typography>
				<center><Typography><b>Previous Message will be replaced with this one</b></Typography></center>
				<br/>
				<TextField
					className={styles.input}
					multiline
					variant="outlined"
					color="primary"
					label="Message"
					rows={6}
					required
				/>
			</Dialog>
			<Dialog
				title = {"Assign Vendor"}
				open = {openAssignVendorDialog}
				className={styles.dialog}
				fullScreen
				rootClass={styles.dialogRoot}
				buttons = {[{
					onClick: dismissAssignVendorDialog,
					content: "Dismiss"
				},{
					onClick: assignVendor,
					content: "Assign"
				}]}
			>
				<div className={styles.assignCont}>
					<center><Typography><b>Vendors are listed according to the department that this complaint belongs to.</b></Typography></center>
					{
						!vendors && (
							<div className={styles.notFound}>
								<img 
									src = {errorImg2}
									alt = "No Vendors Found Illustration"
									width = "300px"
									heigth = "300px"
									className = {styles.img}
								/>
								<div className={styles.msg}>
									<Typography variant="h5" className={styles.title}>No Vendors Found</Typography>
								</div>
							</div>
						)
					}
					{
						vendors && (
							<TextField
								placeholder="Search..."
								variant="outlined"
								className={styles.search}
							/>
						)
					}
					<div className={styles.vendors}>
						{
							vendors && vendors.map((e,i)=>{
								if(i===selected){
									return (
										<Card className={styles.vendor+" "+styles.selected} key={i} variant="outlined">
											<CardActionArea className={styles.inner}>
												<div className={styles.initial}><span>{e.name[0]}</span></div>
												<div className={styles.sideCont}>
													<Typography variant="subtitle1">{e.name}</Typography>
													<Typography variant="subtitle2">Complaints Alloted :- {e.complaintCount}</Typography>
												</div>
											</CardActionArea>
										</Card>
									)
								}

								return (
									<Card className={styles.vendor} key={i} variant="outlined">
										<CardActionArea className={styles.inner} onClick={selectVendor(i)}>
											<div className={styles.initial}><span>{e.name[0]}</span></div>
											<div className={styles.sideCont}>
												<Typography variant="subtitle1">{e.name}</Typography>
												<Typography variant="subtitle2">Complaints Alloted :- {e.complaintCount}</Typography>
											</div>
										</CardActionArea>
									</Card>
								)
							})
						}
					</div>
				</div>
			</Dialog>
			{
				complaint && (
					<Dialog
						title="Change Priority"
						open={openChangePriorityDialog}
						buttons = {[{
							"content": "Dismiss",
							"onClick": closeChangePriorityDialog
						},
						{
							"content": "Change",
							"onClick": setNewPriority
						}]}
						fullWidth={true}
						maxWidth="sm"
					>
						<div className={styles.statusDialog}>
							<FormControl variant="outlined" className={styles.input}>
						        <InputLabel variant="outlined">Priority</InputLabel>
						        <Select
						          color="primary"
						          value={currPriority}
						          variant="outlined"
						          label="Priority"
						          onChange={updateInput(setCurrPriority)}
						          className={styles.input}
								  required
						        >
						        {
						        	priority.map((e,i)=>{
						        		if(e.toLowerCase() === complaint.priority){
						        			return (
									          <MenuItem value={i} key={i} disabled>{e}</MenuItem>
								        	)
						        		}

						        		return (
								          <MenuItem value={i} key={i}>{e}</MenuItem>
							        	)
							        })
						        }
						        </Select>
						    </FormControl>
					    </div>
					</Dialog>
				)
			}
		</>
	)
}