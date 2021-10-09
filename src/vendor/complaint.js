import { useState, useEffect } from "react";
import { Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@material-ui/core";
import styles from "../styles/vendor/Complaint.module.css";
import { appName } from "../globals";
import Helmet from "react-helmet";
import Header from "../components/Header";
import Uploader from "../components/Uploader";
import Dialog from "../components/Dialog";
import errorImg from "../assets/vendor/error.svg";
import hit from "../components/hit";
import Session from "../components/Session";
import Loading from "../components/Loading";
import { Error, Success } from "../components/Message";

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
		// hit("api/vendor/getComplaint",{
		// 	"token": token,
		// 	"cid": id
		// }).then((c)=>{
		// 	if(c.success){
		// 		setComplaint(c.success.msg);
		// 		setLoaded(true);
		// 	}
		// 	else{
		// 		setComplaint(null);
		// 		setLoaded(null);
		// 	}
		// })
		setComplaint({
			"desc": "Qui ullamco quis deserunt laborum esse ullamco et veniam eu adipisicing non incididunt ut fugiat cillum deserunt eiusmod ut ut veniam irure occaecat excepteur ullamco ut consequat in proident elit ut nulla mollit reprehenderit voluptate culpa ut magna exercitation consectetur irure culpa ullamco aliquip reprehenderit labore ullamco laborum anim duis aliqua cillum occaecat non non esse consectetur aliqua adipisicing quis officia sint in exercitation laboris ullamco dolore veniam eu culpa occaecat occaecat officia sunt labore quis laboris proident sint elit deserunt ullamco commodo tempor aliqua aute duis quis ut id ex pariatur occaecat dolore in sint incididunt culpa proident ea officia anim non voluptate id nulla pariatur cupidatat ea enim cupidatat pariatur et enim aute labore nisi veniam ut in officia enim adipisicing ut est veniam laboris commodo mollit eiusmod sint exercitation sint occaecat exercitation adipisicing dolor duis elit et elit eu laborum anim ullamco in et pariatur eiusmod consectetur sit consectetur ut ullamco fugiat eu consequat aute dolor do deserunt do eu esse non laborum labore officia incididunt dolore dolor voluptate reprehenderit ut deserunt do adipisicing tempor dolor ut sed qui laboris quis laborum ut dolore dolor in eu duis commodo aliqua eu voluptate commodo laboris anim eu in consequat cupidatat est in reprehenderit duis veniam aliqua proident nisi fugiat officia consectetur incididunt esse ullamco labore ut aliqua laboris aute ut aute.",
			"on": "10/09/2021",
			"status": "pending",
			"priority": "low",
			"adminMsg": "Sunt occaecat eiusmod duis.",
			"msg": "Ut laboris.",
			"user": {
				"name": "Test1234",
				"roomNo": "1234"
			},
			"imgs": []
		});
		setLoaded(true);
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

	return (
		<>
			<Helmet>
				<title>Complaint - {appName}</title>
			</Helmet>
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
							<Success open={Boolean(successMsg)} message={successMsg} width />
							<Error open={Boolean(errorMsg)} message={errorMsg} width />
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
								{
									complaint.imgs && (
										<div className={styles.block}>
											<Typography variant="subtitle2" className={styles.subtitle}>Images: -</Typography>
											<Uploader defaultImgs={complaint.imgs} rem={false} clickable/>
										</div>
									)
								}
								{
									complaint.adminMsg && (
										<div className={styles.block}>
											<Typography variant="subtitle2" className={styles.subtitle}>Message from Admin: -</Typography>
											<Typography variant="subtitle1" className={styles.body}>{complaint.adminMsg}</Typography>
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
											<Typography variant="subtitle2" className={styles.subtitle}>Resolution: -</Typography>
											<Typography variant="subtitle1" className={styles.body}>{complaint.msg}</Typography>
										</div>
									)
								}
							</div>
						</>
					)
				}
				{
					loaded === false && (
						<div className={styles.skeleton}>
							<div className={styles.subheading}></div>
							<div className={styles.desc}></div>
							<div className={styles.subheading}></div>
							<div className={styles.block}></div>
							<div className={styles.block}></div>
							<div className={styles.subheading}></div>
							<div className={styles.block}></div>
							<div className={styles.subheading}></div>
							<div className={styles.block}></div>
							<div className={styles.subheading}></div>
							<div className={styles.block}></div>
							<div className={styles.subheading}></div>
							<div className={styles.img}></div>
							<div className={styles.subheading}></div>
							<div className={styles.block}></div>
							<div className={styles.subheading}></div>
							<div className={styles.block}></div>
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
						    	currStatus!==0 && (
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