import Header from "../components/Header";
import Head from "../components/Head";
import { appName } from "../globals";
import { useState, useEffect } from "react";
import second from "../assets/admin/second.png";
import styles from "../styles/admin/Announcements.module.css";
import { Typography, Button, CircularProgress, IconButton, Icon, TextField } from "@material-ui/core";
import hit from "../components/hit";
import Session from "../components/Session";
import Alert from "../components/Alert";
import Dialog from "../components/Dialog";
import Loading from "../components/Loading";
import { Error, Success } from "../components/Message";

const limit = 10;
const token = Session.login().token;
let offset = 0;
let currAnnouncement = -1;
let err, suc;
export default function Announcements(props){
	const [announcements,setAnnouncements] = useState(null);
	const [more,setMore] = useState(false);
	const [isLoading,setIsLoading] = useState(false);
	const [loaded,setLoaded] = useState(false);
	const [openAlert,setOpenAlert] = useState(false);
	const [openDialog,setOpenDialog] = useState(false);
	const [announcementCont,setAnnouncementCont] = useState("");
	const [loadingMsg,setLoadingMsg] = useState(null);
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
		hit("api/admin/loadAnnouncements",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				offset += limit;
				setAnnouncements([...c.success.msg]);
				setLoaded(true);
				if(c.success.msg.length === offset){
					setMore(true);					
				}
			}
			else{
				setLoaded(null);
				setAnnouncements(null)
			}
		});
	},[])

	function dismissAlert() {
		setOpenAlert(false);
	}

	function dismissDialog() {
		setOpenDialog(false);
	}

	function reload(){
		hit("api/admin/loadAnnouncements",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				offset += limit;
				setAnnouncements([...c.success.msg]);
				setLoaded(true);
				if(c.success.msg.length === offset){
					setMore(true);					
				}
			}
			else{
				setLoaded(null);
				setAnnouncements(null)
			}
		});
	}

	function doDelete() {
		dismissAlert();
		setSuccessMsg(null);
		setErrorMsg(null);
		const id = announcements[currAnnouncement].id;
		setLoadingMsg("Deleting Announcement...");
		hit("api/admin/deleteAnnouncement",{
			"token": token,
			"id": id
		}).then((c)=>{
			setLoadingMsg(null);
			setLoaded(false);
			if(c.success){
				reload();
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function doUpdate() {
		dismissDialog();
		setSuccessMsg(null);
		setErrorMsg(null);
		const id = announcements[currAnnouncement].id;
		const newBody = announcementCont;
		setLoadingMsg("Updating Announcement...");
		hit("api/admin/updateAnnouncement",{
			"token": token,
			"id": id,
			"newBody": newBody
		}).then((c)=>{
			setLoadingMsg(null);
			setLoaded(false);
			if(c.success){
				reload();
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function loadMore(e){
		setIsLoading(true);
		hit("/api/vendor/loadAnnouncements",{
			"token": token,
			"offset": offset
		}).then((c)=>{
			setIsLoading(false);
			if(c.success){
				const a = c.success.msg;
				if(a.length<limit){
					setMore(false);
				}
				else{
					offset += limit
				}
				setAnnouncements([...announcements,...a]);

			}
			else{
				setMore(false);
			}
		});
	}

	let showAlert = (i) => () => {
		currAnnouncement = i;
		setOpenAlert(true);
	}

	let showDialog = (i) => ()  => {
		currAnnouncement = i;
		const body = announcements[i].body;
		setAnnouncementCont(body);
		setOpenDialog(true);
	}

	return (
		<>
			<Head>
				<title>Announcements - {appName}</title>
			</Head>
			<Header
				title = "Announcements"
				items = {["Home","New User","New Announcement","New Department","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			{
				!announcements && loaded===null && (
					<div className={styles.notFound}>
						<img 
							src = {second}
							alt = "No Announcements Illustration"
							width = "300px"
							heigth = "300px"
							className = {styles.img}
						/>
						<div className={styles.msg}>
							<Typography variant="h5" className={styles.title}>No Announcements Found</Typography>
						</div>
					</div>
				)
			}
			<Success open={Boolean(successMsg)} message={successMsg} float />
			<Error open={Boolean(errorMsg)} message={errorMsg} float />
			{
				announcements && loaded && (
					<div className={styles.cont}>
						{
							announcements.map((e,i)=>(
								<div className={styles.announcement} key={i}>
									{
										e.byCurrUser && (
											<div className={styles.options}>
												<IconButton className={styles.edit} onClick={showDialog(i)}>
													<Icon>edit</Icon>
												</IconButton>
												<IconButton className={styles.delete} onClick={showAlert(i)}>
													<Icon>delete</Icon>
												</IconButton>
											</div>
										)
									}
									<div className={styles.content}>
										<Typography variant="subtitle1">{e.body}</Typography>
										<div className={styles.attr}>
											<Typography variant="subtitle2">{e.on}</Typography>
											<Typography variant="subtitle2" className={styles.author}>- {e.author}</Typography>
										</div>
									</div>
								</div>
							))
						}
						{
							more && !isLoading && (
								<Button variant="outlined" color="primary" className={styles.loadMore} onClick={loadMore}>Load More</Button>
							)
						}
						{
							more &&	isLoading && (
								<div className={styles.loading}>
									<CircularProgress size={24} className={styles.circle}/>
									<Typography variant="subtitle1">Loading...</Typography>
								</div>
							)
						}
					</div>
				)
			}
			{
				loaded===false && (
					<div className={styles.skeleton}>
						<div className={styles.announcement+" "+styles.announcement1}></div>
						<div className={styles.announcement+" "+styles.announcement2}></div>
						<div className={styles.announcement+" "+styles.announcement3}></div>
						<div className={styles.loadMore}></div>
					</div>
				)
			}
			<Alert
				title = "Delete Confirmation"
				msg = "Are you sure you want to delete this announcement?"
				buttons = {[{
					content: "Delete",
					onClick: doDelete
				}]}
				onClose = {dismissAlert}
				open = {openAlert}
			/>
			<Dialog
				title = "Update Announcement"
				open = {openDialog}
				fullScreen={true}
				className={styles.update}
				buttons = {[{
					onClick: dismissDialog,
					content: "Dismiss"
				},{
					onClick: doUpdate,
					content: "Update"
				}]}
			>
				<TextField
					value={announcementCont}
					multiline
					rows={20}
					label="Announcement"
					variant="outlined"
					color="primary"
					required
					className={styles.announcementCont}
					onChange={(e)=>setAnnouncementCont(e.currentTarget.value)}
				/>
			</Dialog>
			<Loading
				open={Boolean(loadingMsg)}
				msg={loadingMsg}
			/>
		</>
	)

}