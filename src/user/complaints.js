import { appName } from "../globals";
import Head from "../components/Head";
import Header from "../components/Header";
import styles from "../styles/user/Complaints.module.css";
import { Button, Card, TextField, CardActionArea, Typography, CircularProgress } from "@material-ui/core"; 
import first from "../assets/user/main/first.png";
import { useState, useEffect } from "react";
import Session from "../components/Session";
import hit from "../components/hit";

const limit = 10;
let current = limit;
let timer = null;
let sOffset = 0;
export default function Complaints(props){
	const [complaints,setComplaints] = useState(null);
	const [loaded,setLoaded] = useState(false);
	const token = Session.login().token;
	const [next,setNext] = useState(false);
	const [searchVal,setSearchVal] = useState("");
	const [loadingNext,setLoadingNext] = useState(false);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [searching,setSearching] = useState(false);
	const [noComplaints,setNoComplaints] = useState(false);

	useEffect(()=>{
		hit("api/employee/getComplaints",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				if(c.success.msg.count <= 0){
					setComplaints(null);
					setLoaded(null)
				}
				else{

					if(c.success.msg.count > limit){
						setNext(true);
						setLoadingNext(false);
					}

					setLoaded(true);
					setComplaints(c.success.msg.complaints);
				}
			}
			else{
				setComplaints(null);
				setLoaded(null)
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[]);

	function loadAllComplaints(){
		setNoComplaints(null);
		hit("api/employee/getComplaints",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			setLoadingNext(false);
			setNext(false);
			setSearching(false);
			if(c.success){
				if(c.success.msg.count <= 0){
					setComplaints(null);
					setLoaded(null)
				}
				else{

					if(c.success.msg.count > limit){
						setNext(true);
						setLoadingNext(false);
					}
					setLoaded(true);
					setComplaints(c.success.msg.complaints);
				}
			}
			else{
				setComplaints(null);
				setLoaded(null)
			}
		});
	}

	function loadMore(){
		setLoadingMsg("Loading");
		setLoadingNext(true);
		hit("api/employee/getComplaints",{
			"token": token,
			"offset": current
		}).then((c)=>{
			if(c.success){
				const newComplaints = c.success.msg.complaints
				const allComplaints = [...complaints,...newComplaints]
				if(c.success.msg.count <= 0){
					setNext(false);
					setLoadingNext(false);
				}
				else{

					if(c.success.msg.count > allComplaints.length){
						setNext(true);
						setLoadingNext(false);
					}
					else{
						setNext(false);
						setLoadingNext(false);
					}

					setLoaded(true);
					setComplaints((c)=>[...c,...newComplaints]);
				}

				current += limit;
			}
		})
	}

	function doSearch(val){
		setNoComplaints(false);
		hit("api/employee/searchComplaint",{
			"token": token,
			"term": val,
			"offset": sOffset
		}).then((c)=>{
			setLoadingNext(false);
			if(c.success){
				if(c.success.msg.length === 0 && sOffset === 0){
					setSearching(false);
					setNext(false);
					setNoComplaints(true);
				}
				else{
					sOffset += limit;
					if(c.success.msg.length === limit){
						setNext(true);
					}
					else{
						setNext(false);
					}

					const cs = c.success.msg;
					setComplaints((e)=>[...e,...cs]);
				}
			}
		})
	}

	function search(e){
		const val = e.currentTarget.value;
		setSearchVal(val);
		clearTimeout(timer);
		timer = setTimeout(()=>{
			setComplaints([]);
			if(val.replace(/ /g,"")!==""){
				sOffset = 0;
				setSearching(true);
				setNext(true);
				setLoadingNext(true);
				setLoadingMsg("Searching");
				setNoComplaints(false);
				doSearch(val);
			}
			else{
				setLoadingNext(true);
				setNext(true);
				setLoadingMsg("Loading...");
				loadAllComplaints()
			}
		},1500);
	}

	function searchMore() {
		doSearch(searchVal);
	}

	return (
		<>
			<Head>
				<title>Complaints - {appName}</title>
			</Head>
			<Header
				title="Complaints"
				items = {["Home","Announcements","Settings"]}
				links = {["/","/announcements","/settings"]}
				icons = {["home","campaign","settings"]}
				search
			/>
			{
				!complaints && loaded===null && (
					<div className={styles.notFound}>
						<img 
							src = {first}
							alt = "No Complaints Found Illustration"
							width = "300px"
							heigth = "300px"
							className = {styles.img}
						/>
						<div className={styles.msg}>
							<Typography variant="h5" className={styles.title}>No Complaints Found</Typography>
							<Typography variant="subtitle2" className={styles.subtitle}>To register a complaint click on the "New Complaint" button above</Typography>
						</div>
					</div>
				) 
			}
			<div className={styles.cont}>
				{
					complaints && loaded===true && (
						<div className={styles.search}>
							<TextField
								placeholder = "Search..."
								variant = "outlined"
								className={styles.searchInput}
								value={searchVal}
								onChange={search}
							/>
						</div>
					)
				}
				{
					noComplaints && (
						<div className={styles.notFound}>
							<img 
								src = {first}
								alt = "No Complaints Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Complaints Found</Typography>
								<Typography variant="subtitle2" className={styles.subtitle}>Try rephrasing the search query.</Typography>
							</div>
						</div>
					) 
				}
				{
					complaints && loaded===true && complaints.map((e,i)=>(
						<Card variant="outlined" key={i} className={styles.complaint} title="Click to view complaint">
							<CardActionArea className={styles.main} href={"/complaint/"+e.complaintId}>
								<div className={styles.all}>
									<Typography variant="subtitle2">Complaint id :- {e.complaintId}</Typography>
									<div className={styles.body}>
										<Typography variant="h5" className={styles.title}>{e.shortTitle}</Typography>
									</div>
									<div className={styles.meta}>
										<Typography variant="subtitle2">{e.date}</Typography>
										<Typography variant="subtitle2" className={styles.status+" "+styles[e.status]}>{e.status}</Typography>
									</div>
								</div>
							</CardActionArea>
						</Card>
					))
				}
				{
					loaded === true && next && !loadingNext && (
						<Button className={styles.loadMore} variant="outlined" color="primary" onClick={searching?searchMore:loadMore}>Load More</Button>
					)
				}
				{
					loaded === true && next && loadingNext && (
						<div className={styles.loadingNext}>
							<CircularProgress size={24} color="primary" className={styles.circle} />
							<Typography variant="subtitle1" className={styles.txt}>{loadingMsg}</Typography>
						</div>
					)
				}
			</div>
			{
				loaded===false && (
					<div className={styles.skeleton} aria-label="Loading Complaints">
						<div className={styles.search}></div>
						<div className={styles.complaint}></div>
						<div className={styles.complaint}></div>
					</div>
				)
			}
		</>
	)
}