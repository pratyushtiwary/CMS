import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/Departments.module.css";
import { Card, CardActionArea, Typography, Icon, Button, TextField,CircularProgress } from "@material-ui/core";
import { useState, useEffect } from "react";
import errorImg1 from "../assets/admin/errorImg1.svg";
import Session from "../components/Session";
import Alert from "../components/Alert";
import Dialog from "../components/Dialog";
import hit from "../components/hit";
import { Error, Success } from "../components/Message";
import Loading from "../components/Loading";

const token = Session.login().token;
let offset = 0;
const limit = 10;
let currId = -1;
let err, suc;
let s = null;
let sOffset = 0;
export default function Departments(props){
	const [departments,setDepartments] = useState(null);
	const [loaded,setLoaded] = useState(null);
	const [more,setMore] = useState(false);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [openAlert,setOpenAlert] = useState(false);
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [openDialog,setOpenDialog] = useState(false);
	const [newDeptName,setNewDeptName] = useState("");
	const [sTerm,setSTerm] = useState("");
	const [searching,setSearching] = useState(false);
	const [notFound,setNotFound] = useState(null);

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
		hit("api/admin/listAllDepartments",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				offset += limit + 1;
				if(c.success.msg.count === 0){
					setDepartments(null);		
					setLoaded(false);			
				}
				else{
					setDepartments([...c.success.msg.departments]);
					setLoaded(true);
				}

				if(c.success.msg.count > offset){
					setMore(true);
				}
				else{
					setMore(false);
				}

			}
			else{
				setDepartments(null);
				setLoaded(false)
			}
		})
	},[])

	let renameDepartment = (i) => (e) => {
		e.preventDefault();
		currId = i;
		let oldDeptName = departments[currId].name;
		setOpenDialog(true);
		setNewDeptName(oldDeptName);
	}

	let deleteDepartment = (i) => (e) => {
		e.preventDefault();
		currId = i;
		setOpenAlert(true);
	}

	function dismissAlert(){
		setOpenAlert(false);
	}

	function initLoad() {
		setLoaded(null);
		hit("api/admin/listAllDepartments",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				if(c.success.msg.count === 0){
					setDepartments(null);		
					setLoaded(false);			
				}
				else{
					setDepartments([...c.success.msg.departments]);
					setLoaded(true);
				}

				if(c.success.msg.count > offset){
					setMore(true);
				}
				else{
					setMore(false);
				}


			}
			else{
				setDepartments(null);
				setLoaded(false)
			}
		});
	}

	function doRename() {
		dismissDialog();
		setSuccessMsg(null);
		setErrorMsg(null);
		setLoaderMsg("Renaming Department...");
		const id = departments[currId].id;
		const newName = newDeptName;
		hit("api/admin/renameDepartment",{
			"token": token,
			"id": id,
			"name": newName
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
				initLoad();
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
		const id = departments[currId].id;
		hit("api/admin/deleteDepartment",{
			"token": token,
			"id": id
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				setSuccessMsg(c.success.msg);
				initLoad();
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function dismissDialog() {
		setOpenDialog(false);
	}

	function searchDept(val) {
		setSearching(true);
		setLoadingMsg("Searching...");
		hit("api/admin/searchDepartment",{
			"token": token,
			"term": val,
			"offset": sOffset
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				if(c.success.msg.length===0 && sOffset === 0){
					setNotFound(true);
				}

				sOffset += limit;

				if(c.success.msg.length === limit){
					setMore(true);
				}
				else{
					setMore(false);
				}

				setDepartments((e)=>[...e,...c.success.msg]);
			}
		})
	}

	function loadInit() {
		hit("api/admin/listAllDepartments",{
			"token": token,
			"offset": 0
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				setDepartments((d)=>[...d,...c.success.msg.departments]);
				if(c.success.msg.count > offset){
					setMore(true);
				}
				else{
					setMore(false);
				}
			}
		})
	}

	function search(e) {
		const val = e.currentTarget.value;
		setSTerm(val);
		clearTimeout(s)
		s = setTimeout(()=>{
			setNotFound(false);
			setDepartments([]);
			if(val!==""){
				sOffset = 0;
				searchDept(val);				
			}
			else{
				setSearching(false);
				setLoadingMsg("Loading...");
				loadInit();
			}
		},1000)
	}

	function searchMore(){ 
		setNotFound(false);
		setLoadingMsg("Loading...");
		searchDept(sTerm);
	}

	function load() {
		hit("api/admin/listAllDepartments",{
			"token": token,
			"offset": offset
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				setDepartments((d)=>[...d,...c.success.msg.departments]);
				if(c.success.msg.count > offset){
					setMore(true);
				}
				else{
					setMore(false);
				}
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
				<title>Departments - {appName}</title>
			</Head>
			<Header
				title = "Departments"
				items = {["Home","New User","New Announcement","New Department","Announcements","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","segment","people","settings"]}
				hideNewComplaint
			/>
			<Success open={Boolean(successMsg)} message={successMsg} float />
			<Error open={Boolean(errorMsg)} message={errorMsg} float />
			<div className={styles.cont}>
				{
					!departments && loaded === false &&  (
						<div className={styles.notFound}>
							<img 
								src = {errorImg1}
								alt = "No Departments Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Departments Found</Typography>
							</div>
						</div>
					)
				}
				{
					departments && loaded === true && (
						<TextField
							variant="outlined"
							color="primary"
							className={styles.search}
							placeholder="Search..."
							value={sTerm}
							onChange={search}
						/>
					)
				}
				<div className={styles.departments}>
					{
						departments && loaded === true && departments.map((e,i)=>(
							<Card className={styles.department} key={i} variant="outlined">
								<CardActionArea className={styles.inner} href={"/department/"+e.id}>
									<Typography variant="h4" className={styles.name}>{e.name}</Typography>
									<Typography variant="subtitle1" className={styles.emps}><Icon classNames={styles.icon}>groups</Icon><span className={styles.content}>{e.count} employees</span></Typography>
									{
										e.id !== -1 && (
											<div className={styles.options}>
												<Button className={styles.rename} variant="outlined" onClick={renameDepartment(i)}><Icon>edit</Icon><span className={styles.content}>Rename Department</span></Button>
												<Button className={styles.delete} variant="outlined" onClick={deleteDepartment(i)}><Icon>delete</Icon><span className={styles.content}>Delete Department</span></Button>
											</div>
										)
									}
								</CardActionArea>
							</Card>
						))
					}
					{
						notFound===true && loaded === true &&  (
							<div className={styles.notFound}>
								<img 
									src = {errorImg1}
									alt = "No Departments Found Illustration"
									width = "300px"
									heigth = "300px"
									className = {styles.img}
								/>
								<div className={styles.msg}>
									<Typography variant="h5" className={styles.title}>No Departments Found</Typography>
								</div>
							</div>
						)
					}
				</div>
				{
					loaded===true && more && !Boolean(loadingMsg) && (
						<Button variant="outlined" color="primary" className={styles.loadMore} onClick={searching?loadMore:searchMore}>Load More</Button>
					)
				}
				{
					loaded===true && Boolean(loadingMsg) && (
						<div className={styles.loadingNext}>
							<CircularProgress size={24} color="primary" className={styles.circle} />
							<Typography variant="subtitle1" className={styles.txt}>{loadingMsg}</Typography>
						</div>
					)
				}
				{
					loaded === null && (
						<div className={styles.skeleton}>
							<div className={styles.search}></div>
							<div className={styles.departments}>
								<div className={styles.block}></div>
								<div className={styles.block}></div>
							</div>
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