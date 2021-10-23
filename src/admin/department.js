import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Typography, Card, CardActionArea, Button, Icon, CircularProgress, TextField } from "@material-ui/core";
import styles from "../styles/admin/Department.module.css";
import Session from "../components/Session";
import hit from "../components/hit";
import errorImg2 from "../assets/admin/errorImg2.svg";
import Alert from "../components/Alert";
import Dialog from "../components/Dialog";
import Loading from "../components/Loading";
import { Error, Success } from "../components/Message";

const token = Session.login().token
const limit = 10;
let offset = 0;
let err, suc;
export default function Vendor(props){

	const id = props.match.params.id;
	const [department,setDepartment] = useState(null);
	const [employees,setEmployees] = useState(null);
	const [loaded,setLoaded] = useState(null);
	const [more,setMore] = useState(false);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [newDeptName,setNewDeptName] = useState("");
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [openAlert,setOpenAlert] = useState(false);
	const [openDialog,setOpenDialog] = useState(false);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);

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
		function loadEmps() {
			hit("api/admin/loadDepartmentEmployees",{
				"token": token,
				"id": id,
				"offset": offset
			}).then((c)=>{
				setLoaded(true);
				if(c.success){
					offset += limit;
					if(c.success.msg.count > 0){
						setEmployees(c.success.msg.employees)

						if(c.success.msg.count > offset){
							setMore(true);
						}
						else{
							setMore(false);
						}

					}
					else{
						setEmployees(null);
					}
				}
				else{
					setEmployees(null);
				}
			})
		}

		hit("api/admin/loadDepartment",{
			"token": token,
			"id": id
		}).then((c)=>{
			if(c.success){
				setDepartment(c.success.msg);
				loadEmps();
			}
			else{
				setLoaded(false);
				setDepartment(null);
			}
		})
	},[id])

	function load() {
		hit("api/admin/loadDepartmentEmployees",{
				"token": token,
				"id": id,
				"offset": offset
			}).then((c)=>{
				setLoadingMsg(null);
				if(c.success){
					if(c.success.msg.count > 0){
						setEmployees((e)=>[...e,...c.success.msg.employees])

						if(c.success.msg.count > offset){
							setMore(true);
						}
						else{
							setMore(false);
						}

					}
				}
			})
	}

	function rename() {
		setOpenDialog(true);
		setNewDeptName(department.name);
	}

	function del() {
		setOpenAlert(true);
	}

	function dismissAlert() {
		setOpenAlert(false);
	}

	function dismissDialog() {
		setOpenDialog(false);
	}

	function doRename() {
		dismissDialog();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Renaming Department...");
		const newName = newDeptName;
		hit("api/admin/renameDepartment",{
			"token": token,
			"id": id,
			"name": newName
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				setDepartment((e)=>{
					e["name"] = newDeptName;
					return e;
				});
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function doDelete() {
		dismissAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Deleting Department...");
		hit("api/admin/deleteDepartment",{
			"token": token,
			"id": id
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg+" Redirecting...");
				window.location.href = "/departments";
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function loadMore() {
		setLoadingMsg("Loading...");
		offset += limit;
		load();
	}

	return (
		<>
			<Head>
				<title>View department - {appName}</title>
			</Head>
			<Header
				title = "View Department"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<Success open={Boolean(successMsg)} message={successMsg} float />
			<Error open={Boolean(errorMsg)} message={errorMsg} float />
			<div className={styles.cont}>
				{

					department && loaded === true && (
						<>
							<div className={styles.meta}>
								<div className={styles.initial}>{department.name[0]}</div>
								<div className={styles.info}>
									{
										id > 0 && (
											<Typography variant="subtitle1">{id}</Typography>
										)
									}
									<Typography variant="h5">{department.name}</Typography>
									<Typography variant="subtitle1">Employees Count :- {department.count}</Typography>
								</div>
							</div>
							{
								id!=="-1" && (
									<div className={styles.options}>
										<Button className={styles.input} variant="outlined" color="primary" onClick={rename}>
											<Icon>edit</Icon> Rename Department
										</Button>
										<Button className={styles.input} variant="outlined" color="primary" onClick={del}>
											<Icon>delete</Icon> Delete Department
										</Button>
									</div>
								)
							}
							<div className={styles.employees}>
								<div className={styles.title}>
									<div className={styles.line}></div>
									<Typography variant="h6" className={styles.content}>Employees</Typography>
								</div>
								{
									employees && employees.map((e,i)=>(
										<Card className={styles.employee} variant="outlined">
											<CardActionArea href={"/vendor/"+e.id} className={styles.inner}>
												<div className={styles.meta}>
													<div className={styles.initial}>{e.name[0]}</div>
													<div className={styles.info}>
														<Typography variant="subtitle1">{e.id}</Typography>
														<Typography variant="h5">{e.name}</Typography>
													</div>
												</div>
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
									!employees && (
										<div className={styles.notFound}>
											<img 
												src = {errorImg2}
												alt = "No Employees Found Illustration"
												width = "300px"
												heigth = "300px"
												className = {styles.img}
											/>
											<div className={styles.msg}>
												<Typography variant="h5" className={styles.title}>No Employees Found</Typography>
											</div>
										</div>
									)
								}
							</div>
						</>
					)
				}
				{
					!department && loaded===false && (
						<div className={styles.notFound}>
							<img 
								src = {errorImg2}
								alt = "No Department Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Department Found</Typography>
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
							</div>
							<div className={styles.seperator}></div>
							<div className={styles.employee}></div>
							<div className={styles.employee}></div>
							<div className={styles.loadMore}></div>
						</div>
					)
				}
			</div>
			<Alert
				title = "Delete Confirmation"
				buttons = {[{
					content: "Delete",
					onClick: doDelete
				}]}
				onClose = {dismissAlert}
				open = {openAlert}
			>
				Are you sure you want to delete this department?<br/><br/>
				<b>All the vendors will be moved to 'No Department'</b><br/>
				<b>All the complaints will be moved to 'No Department'</b>
			</Alert>
			<Loading
				open = {Boolean(loaderMsg)}
				msg = {loaderMsg}
			/>
			<Dialog
				title = {"Rename Department"}
				open = {openDialog}
				buttons = {[{
					onClick: dismissDialog,
					content: "Dismiss"
				},{
					onClick: doRename,
					content: "Rename"
				}]}
			>
				<TextField
					variant="outlined"
					color="primary"
					label="Department Name"
					value={newDeptName}
					autoFocus
					onChange={(e)=>setNewDeptName(e.currentTarget.value)}
				/>
			</Dialog>
		</>
	)
}