import { useState, useEffect } from "react";
import { Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import styles from "../styles/vendor/Complaint.module.css";
import { appName } from "../globals";
import Helmet from "react-helmet";
import Header from "../components/Header";
import Uploader from "../components/Uploader";
import Dialog from "../components/Dialog";
import err from "../assets/vendor/error.svg";


export default function Complaint(props){
	const id = props.match.params.id;
	const [complaint,setComplaint] = useState(null);
	const [dialog,setDialog] = useState([0,0,0]);
	const status = ["Pending","Error","Resolved"];
	const priority = ["Low","Mid","High"];
	const [currStatus,setCurrStatus] = useState(0);
	const [currPriority,setCurrPriority] = useState(0);

	useEffect(()=>{
		setComplaint({
			"desc": "Mollit magna labore ullamco cillum occaecat nulla exercitation ex dolore cillum officia in minim dolor sunt culpa eiusmod dolor anim dolore non aliqua id sit aliquip quis sed amet pariatur incididunt aliqua eiusmod ea in ex dolor irure fugiat occaecat laboris enim aliqua nisi aliqua reprehenderit cupidatat cillum velit id in mollit quis et minim anim amet sit eu cillum exercitation excepteur exercitation amet ex labore culpa dolor velit dolore velit non elit ex occaecat laborum consectetur cillum veniam ut proident aliqua pariatur reprehenderit cillum quis in qui et esse dolore culpa nulla in laborum nisi cillum enim sunt sint dolor aliquip adipisicing eu velit veniam laboris irure consequat ex reprehenderit voluptate aute qui laborum excepteur aliqua elit ut sit exercitation in nostrud dolor sit sit tempor ex in in esse culpa deserunt sed ut nisi labore ea ea reprehenderit non quis mollit incididunt reprehenderit dolor sint sed laborum eiusmod nulla commodo est dolore et qui amet et nulla ut.",
			"status": "pending",
			"priority": "high",
			"on": "30/08/2021",
			"adminMsg": "Dolor amet mollit sed ad elit mollit laboris adipisicing dolor eu qui dolore fugiat.",
			"msg": null,
			"user": {
				"name": "Test1234",
				"roomNo": "1234"
			}
		});
	},[props]);

	function changeStatus(){
		let val = complaint.status[0].toUpperCase() + complaint.status.slice(1);
		let i = Array.prototype.indexOf.call(status,val);
		setCurrStatus(i);
		document.querySelector("html").style.overflow="hidden";
		setDialog([1,0,0]);
	}

	function changePriority(){
		let val = complaint.priority[0].toUpperCase() + complaint.priority.slice(1);
		let i = Array.prototype.indexOf.call(priority,val);
		setCurrPriority(i);
		document.querySelector("html").style.overflow="hidden";
		setDialog([0,1,0]);
	}

	function closeDialog(){
		setDialog([0,0,0])
		document.querySelector("html").style.overflow="auto";
	}

	function changeCurrStatus(e){
		setCurrStatus(e.target.value);
	}

	function changeCurrPriority(e){
		setCurrPriority(e.target.value);
	}

	return (
		<>
			<Helmet>
				<title>Complaint - {appName}</title>
			</Helmet>
			<Header
				title = "Complaint"
				items = {["Home","Complaints","Settings"]}
				links = {["/","/complaints","/settings"]}
				icons = {["home","segment","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				{
					!complaint && (
						<div className={styles.errorCont}>
							<div className={styles.img}>
								<img
									src={err}
									alt="Complaint Not Found Illustration"
								/>
							</div>
							<Typography variant="h4">No Complaint Found!</Typography>
						</div>
					)
				}
				{
					complaint && (
						<div className={styles.complaint}>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Complaint Description: -</Typography>
								<Typography variant="subtitle1" className={styles.body}>{complaint.desc}</Typography>
							</div>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Complaint By: -</Typography>
								<Typography variant="subtitle1" className={styles.body}>
									Name :- {complaint.user.name}<br/>
									Room No. :- {complaint.user.roomNo}
								</Typography>
							</div>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Complaint On: -</Typography>
								<Typography variant="subtitle1" className={styles.body}>{complaint.on}</Typography>
							</div>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Priority: -</Typography>
								<div className={styles.status}>
									<Typography variant="subtitle1" className={styles.body+" "+styles[complaint.priority]}>{complaint.priority}</Typography>
									{
										complaint.status!=="resolved" && (
											<Button color="primary" variant="outlined" className={styles.changeStatus} onClick={changePriority}>Change Priority</Button>
										)
									}
								</div>
							</div>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Status: -</Typography>
								<div className={styles.status}>
									<Typography variant="subtitle1" className={styles.body+" "+styles[complaint.status]}>{complaint.status}</Typography>
									{
										complaint.status!=="resolved" && (
											<Button color="primary" variant="outlined" className={styles.changeStatus} onClick={changeStatus}>Change Status</Button>
										)
									}
								</div>
							</div>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Images: -</Typography>
								<Uploader default={["https://images.unsplash.com/photo-1540206395-68808572332f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bmF0dXJlfGVufDB8MXwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"]} rem={false} clickable/>
							</div>
							<div className={styles.block}>
								<Typography variant="subtitle2" className={styles.subtitle}>Message from Admin: -</Typography>
								<Typography variant="subtitle1" className={styles.body}>{complaint.adminMsg}</Typography>
							</div>
							{
								complaint.msg && (
									<div className={styles.block}>
										<Typography variant="subtitle2" className={styles.subtitle}>Message from you: -</Typography>
										<Typography variant="subtitle1" className={styles.body}>{complaint.msg}</Typography>
										<Typography variant="subtitle2" className={styles.body}>To change this message update status of this complaint.</Typography>
									</div>
								)
							}
						</div>
					)
				}
			</div>
			<Dialog
				title="Change Status"
				open={dialog[0]}
				buttons = {[{
					"content": "Dismiss",
					"onClick": closeDialog
				},
				{
					"content": "Change"
				}]}
				fullWidth={true}
				maxWidth={"sm"}
			>
				<div className={styles.statusDialog}>
					<FormControl variant="outlined" className={styles.input}>
				        <InputLabel htmlFor="userType" variant="outlined">Status</InputLabel>
				        <Select
				          color="primary"
				          value={currStatus}
				          variant="outlined"
				          label="Status"
				          onChange={changeCurrStatus}
				          className={styles.statusSelector}
						  required
				        >
				        {
				        	status.map((e,i)=>(
					          <MenuItem value={i} key={i}>{e}</MenuItem>
				        	))
				        }
				        </Select>
			    </FormControl>
			    {
			    	currStatus!==0 && (
			    		<TextField
			    			label="Description"
			    			variant="outlined"
			    			multiline = {true}
			    			rows={6}
			    			className={styles.input}
			    			required
			    		/>
			    	)
			    }
		    </div>
		</Dialog>
		<Dialog
				title="Change Priority"
				open={dialog[1]}
				buttons = {[{
					"content": "Dismiss",
					"onClick": closeDialog
				},
				{
					"content": "Change"
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
				          onChange={changeCurrPriority}
				          className={styles.prioritySelector}
						  required
				        >
				        {
				        	priority.map((e,i)=>(
					          <MenuItem value={i} key={i}>{e}</MenuItem>
				        	))
				        }
				        </Select>
			    </FormControl>
		    </div>
		</Dialog>
		</>
	)
}