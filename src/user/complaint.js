import { useEffect, useState } from "react";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import { Helmet } from "react-helmet";
import { appName } from "../globals";
import first from "../assets/user/main/first.png";
import { Typography, TextField, Button, ListItemText, ListItemIcon, Icon } from "@material-ui/core";
import styles from "../styles/user/Complaint.module.css";
import Alert from "../components/Alert";
import Uploader from "../components/Uploader";


export default function Complaint(props){
	const id = props.match.params.id;
	const [complaint,setComplaint] = useState(null);
	const [openDialog,setOpenDialog] = useState(false);
	const [dialogTitle,setDialogTitle] = useState("Update");
	const [val,setVal] = useState("");
	const [openAlert,setOpenAlert] = useState(false);

	useEffect(()=>{
		const status = ["pending","error","resolved"][Math.round(Math.random()*1000) % 3];
		let text = "Pariatur culpa aliqua magna in esse est amet aute cillum sed elit minim sit enim do exercitation irure voluptate occaecat et anim laboris magna labore esse in irure dolore sunt amet culpa tempor laborum culpa do dolor aliquip sed nulla est mollit pariatur magna consectetur quis voluptate dolore nulla in exercitation ut commodo ea ut consectetur mollit enim labore aliqua ex in in proident nisi quis id proident proident tempor consequat exercitation aliqua dolore cupidatat irure irure ut duis pariatur labore amet exercitation laboris nostrud ex et nostrud excepteur adipisicing est dolor anim quis adipisicing labore eu occaecat aliquip esse pariatur dolore nostrud amet laborum reprehenderit et commodo amet adipisicing qui sit voluptate ea reprehenderit anim reprehenderit fugiat sed proident culpa amet pariatur aliqua irure in dolore ullamco elit pariatur ex consequat consectetur sunt veniam ut nostrud ea irure id magna dolor in laboris excepteur velit minim adipisicing aliquip voluptate qui ad id ut aliquip sint deserunt est amet minim laborum dolore sit anim magna esse fugiat occaecat id ut mollit est non consectetur id tempor excepteur nisi sint minim ut ut ut irure sit sunt occaecat culpa consequat."
		if(id<=1000){
			setComplaint({
				"longText": text,
				"date": "24/08/2021",
				"status": status
			});
			setVal(text);
		}
		else{
			setComplaint(1);
		}
	},[id]);

	function changeTextField(e){
		setVal(e.target.value);
	}

	function del(){
		document.querySelector("html").style.overflow = "hidden";
		setOpenAlert(true);
	}

	function update(){
		setVal(complaint.longText);
		setDialogTitle("Update");
		document.querySelector("html").style.overflow = "hidden";
		setOpenDialog(true);
	}

	function dismiss(){
		document.querySelector("html").style.overflow = "auto";
		setOpenDialog(false);
		setOpenAlert(false);
	}

	function doUpdate(){
		console.log("Update")
		dismiss();
	}

	function doRepost(){
		console.log("Repost")
		dismiss();
	}

	function doDelete(){
		console.log("Delete")
		dismiss();
	}

	function repost(){
		setVal(complaint.longText);
		setDialogTitle("Repost");
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
				items = {["Home","Complaints","Settings"]}
				links = {["/","/complaints","/settings"]}
				icons = {["home","segment","settings"]}
			/>
			<div className={styles.cont}>
				{
					complaint!==1 && complaint && (
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
									<Typography variant="subtitle2" className={styles.title}>Images :-</Typography>
									<div className={styles.image}>
										{
											<Uploader 
												default={["https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081"]}
												rem={false}
											/>
										}
									</div>
								</div>
								<div className={styles.main+" "+styles.inline}>
									<Typography variant="subtitle2" className={styles.title}>Complaint Date :- </Typography>
									<Typography variant="subtitle1">{complaint.date}</Typography>
								</div>
								<div className={styles.main+" "+styles.inline}>
									<Typography variant="subtitle2" className={styles.title}>Complaint Status :- </Typography>
									<Typography variant="subtitle1" className={styles.status+" "+styles[complaint.status]}>{complaint.status}</Typography>
								</div>
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
									<div className={styles.image}>
										<Typography variant="subtitle2" className={styles.title}>Images</Typography>
										<Uploader 
											default={["https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=webp&v=1530129081"]}
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
						complaint===1 && (
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
			</div>
		</>
	)
}