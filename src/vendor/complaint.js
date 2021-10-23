import { useState, useEffect } from "react";
import { Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel, Icon } from "@material-ui/core";
import styles from "../styles/vendor/Complaint.module.css";
import { appName } from "../globals";
import Head from "../components/Head";
import Header from "../components/Header";
import Dialog from "../components/Dialog";
import errorImg from "../assets/vendor/error.svg";
import hit from "../components/hit";
import Session from "../components/Session";
import Loading from "../components/Loading";
import { Error, Success } from "../components/Message";
import Carousel from "../components/Carousel";
import Feedback from "../components/Feedback";

const token = Session.login().token;
let err, suc;

export default function Complaint(props){
	const id = props.match.params.id;
	const [complaint,setComplaint] = useState(null);
	const [dialog,setDialog] = useState([0,0,0]);
	const status = ["Pending","Error","Resolved"];
	const priority = ["Low","Mid","High"];
	const [currStatus,setCurrStatus] = useState(0);
	const [currPriority,setCurrPriority] = useState(0);
	const [loaded,setLoaded] = useState(false);
	const [desc,setDesc] = useState("");
	const [error,setError] = useState(null);
	const [loading,setLoading] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null); 
	const [errorMsg,setErrorMsg] = useState(null);

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
		hit("api/vendor/getComplaint",{
			"token": token,
			"cid": id
		}).then((c)=>{
			if(c.success){
				setComplaint(c.success.msg);
				setLoaded(true);
			}
			else{
				setComplaint(null);
				setLoaded(null);
			}
		});
	},[id]);

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

	function setNewStatus() {
		if(status[currStatus].toLowerCase() === complaint.status){
			closeDialog();
			return;
		}
		if(desc.replace(/ /g,"")==="" && currStatus !== 0){
			setError("Please enter a Description")
		}
		else{
			setError(null);
			setDialog([0,0,0]);
			setLoading("Changing Status...");
			hit("api/vendor/changeStatus",{
				"token": token,
				"cid": id,
				"newStatus": status[currStatus],
				"desc": desc
			}).then((c)=>{
				setLoading(null);
				document.querySelector("html").style.overflow="auto";
				if(c.success){
					setComplaint((c)=>{
						c.status = status[currStatus].toLowerCase();
						c.msg = desc;
						return c;
					});
					setDesc("");
					setSuccessMsg(c.success.msg);
				}
				else{
					setErrorMsg(c.error.msg);
				}
			})
		}
	}

	function setNewPriority() {
		if(priority[currPriority].toLowerCase() === complaint.priority){
			closeDialog();
			return;
		}
		setDialog([0,0,0])
		setLoading("Changing Priority...");
		hit("api/vendor/changePriority",{
			"token": token,
			"cid": id,
			"newPriority": priority[currPriority]
		}).then((c)=>{
			setLoading(null);
			document.querySelector("html").style.overflow="auto";
			if(c.success){
				setComplaint((c)=>{
					c.priority = priority[currPriority].toLowerCase();
					return c;
				});
				setSuccessMsg(c.success.msg);
			}
			else{
				setErrorMsg(c.error.msg);
			}
		})
	}

	function changeFeedback(newFeedback) {
		const oldComplaint = complaint;
		oldComplaint.feedback = newFeedback;
		setComplaint(oldComplaint);
		setSuccessMsg("Feedback saved successfully!");
	}

	return (
		<>
			<Head>
				<title>Complaint - {appName}</title>
			</Head>
			<Header
				title = "Complaint"
				items = {["Home","Announcements","Complaints","Settings"]}
				links = {["/","/announcements","/complaints","/settings"]}
				icons = {["home","campaign","segment","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				{
					!complaint && loaded === null && (
						<div className={styles.errorCont}>
							<div className={styles.img}>
								<img
									src={errorImg}
									alt="Complaint Not Found Illustration"
								/>
							</div>
							<Typography variant="h4">No Complaint Found!</Typography>
						</div>
					)
				}
				{
					complaint && loaded === true && (
						<>
							<Success open={Boolean(successMsg)} message={successMsg} float />
							<Error open={Boolean(errorMsg)} message={errorMsg} float />
							<div className={styles.complaint}>
								<div className={styles.images}>
									<Carousel imgs={complaint.imgs}/>
								</div>
								<div className={styles.complaintBody}>
									<div className={styles.main}>
										<div className={styles.block}>
											<Typography variant="subtitle2" className={styles.subtitle}>Complaint Description: -</Typography>
											<Typography variant="subtitle1" className={styles.body}>{complaint.desc}</Typography>
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
										{
											complaint.adminMsg && (
												<div className={styles.block}>
													<Typography variant="subtitle2" className={styles.subtitle}>Message from Admin: -</Typography>
													<Typography variant="subtitle1" className={styles.body+" "+styles.adminMsg}>{complaint.adminMsg}</Typography>
												</div>
											)
										}
										{
											complaint.msg && complaint.status === "error" && (
												<div className={styles.block}>
													<Typography variant="subtitle2" className={styles.subtitle}>Message from you: -</Typography>
													<Typography variant="subtitle1" className={styles.body}>{complaint.msg}</Typography>
													{
														complaint.status === "error" && (
															<Typography variant="subtitle2" className={styles.body}>To change this message update status of this complaint.</Typography>
														)
													}
												</div>
											)
										}
										{
											complaint.msg && complaint.status === "resolved" && (
												<div className={styles.block}>
													<Typography variant="subtitle2" className={styles.subtitle}>Solution: -</Typography>
													<Typography variant="subtitle1" className={styles.body}>{complaint.msg}</Typography>
												</div>
											)
										}
								</div>
									</div>
									<div className={styles.side}>
										<div className={(complaint.status==="resolved"?styles.items:styles.item)}>
											<div className={styles.block}>
												<Typography variant="subtitle2" className={styles.subtitle}>By : -</Typography>
												<div className={styles.content}>
													<Typography variant="subtitle1" className={styles.initial}>{complaint.user.name[0]}</Typography>
													<Typography variant="h6" title="Employee Name" className={styles.body}>
														{complaint.user.name}
													</Typography>
													<Typography variant="subtitle1" title="Room No." className={styles.body+" "+styles.iconTxt}>
														<Icon>meeting_room</Icon> {complaint.user.roomNo}
													</Typography>
													<Typography variant="subtitle1" title="Complaint On" className={styles.body+" "+styles.iconTxt}>
														<Icon>schedule</Icon> {complaint.on}
													</Typography>

												</div>
											</div>
											{
												complaint.status==="resolved" && (
													<div className={styles.block+" "+styles.feedback}>
														<Feedback for="vendor" feedback={complaint.feedback} onFeedback={changeFeedback} cid={id} onError={(e)=>setErrorMsg(e)}/>
													</div>
												)
											}
										</div>
									</div>
								</div>
							</div>
						</>
					)
				}
				{
					loaded === false && (
						<div className={styles.skeleton}>
							<div className={styles.images}></div>
							<div className={styles.complaintBody}>
								<div className={styles.main}>
									<div className={styles.block}>
										<div className={styles.subtitle}></div>
										<div className={styles.body+" "+styles.desc}></div>
									</div>
									<div className={styles.block}>
										<div className={styles.subtitle}></div>
										<div className={styles.body}></div>
									</div>
									<div className={styles.block}>
										<div className={styles.subtitle}></div>
										<div className={styles.body}></div>
									</div>
									<div className={styles.block}>
										<div className={styles.subtitle}></div>
										<div className={styles.body}></div>
									</div>
								</div>
								<div className={styles.side}>
									<div className={styles.block}></div>
								</div>
							</div>						
						</div>
					)
				}
			</div>
			{
				complaint && (
					<>
						<Dialog
							title="Change Status"
							open={dialog[0]}
							buttons = {[{
								"content": "Dismiss",
								"onClick": closeDialog
							},
							{
								"content": "Change",
								"onClick": setNewStatus
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
							        	status.map((e,i)=>{
							        		if(e.toLowerCase() === complaint.status){
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
						    {
						    	currStatus!==0 && (currStatus !== 1 || complaint.status !== "error") && (
						    		<TextField
						    			label="Description"
						    			variant="outlined"
						    			multiline = {true}
						    			rows={6}
						    			className={styles.input}
						    			required
						    			value={desc}
						    			onChange={(e)=>setDesc(e.currentTarget.value)}
						    			error={Boolean(error)}
						    			helperText={error}
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
							          onChange={changeCurrPriority}
							          className={styles.prioritySelector}
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
					</>
				)
			}
			<Loading
				open = {Boolean(loading)}
				msg = {loading}
			/>
		</>
	)
}