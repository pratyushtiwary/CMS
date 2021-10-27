import { appName } from "../globals";
import Head from "../components/Head";
import Header from "../components/Header";
import styles from "../styles/vendor/Complaints.module.css";
import { Typography, Card, TextField, CardActionArea, Button, CircularProgress } from "@material-ui/core";
import { useState, useEffect } from "react";
import error from "../assets/vendor/error.svg";
import hit from "../components/hit";
import Session from "../components/Session";

const token = Session.login().token;
const limit = 10;
let current = limit;
const searchAfter = 1000;
let beginSearch;
let sOffset = 0;
export default function Complaints(props){
	const [complaints,setComplaints] = useState(null);
	const [loaded,setLoaded] = useState(null);
	const [moreComplaints,setMoreComplaints] = useState(null);
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [notFound,setNotFound] = useState(null);
	const [searching,setSearching] = useState(false);
	const [searchVal,setSearchVal] = useState("");

	useEffect(()=>{
		hit("api/vendor/getComplaints",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				if(c.success.msg.count > 0){

					if(c.success.msg.count > limit){
						setMoreComplaints(true);
					}
					else{
						setMoreComplaints(false);
					}

					setLoaded(true);
					setComplaints([...c.success.msg.complaints]);					
				}
				else{
					setLoaded(false);
					setComplaints(null);
				}
			}
			else{
				setLoaded(false);
				setComplaints(null);
			}
		});
	},[props])

	function loadAllComplaints(){
		setNotFound(false);
		hit("api/vendor/getComplaints",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success){
				setLoaderMsg(null);
				if(c.success.msg.count > 0){

					if(c.success.msg.count > limit){
						setMoreComplaints(true);
					}
					else{
						setMoreComplaints(false);
					}

					setLoaded(true);
					setComplaints([...c.success.msg.complaints]);					
				}
				else{
					setLoaded(false);
					setComplaints(null);
				}
			}
			else{
				setLoaded(false);
				setComplaints(null);
			}
		});
	}

	function loadMore(){
		setMoreComplaints(false);
		setLoaderMsg("Loading...");
		hit("api/vendor/getComplaints",{
			"token": token,
			"offset": current
		}).then((c)=>{
			setLoaderMsg(null);
			current += limit;
			if(c.success){
				if(c.success.msg.length === 0 && sOffset === 0){
					setComplaints([]);
					setNotFound(true);
				}
				else{
					if(c.success.msg.length === limit){
						setMoreComplaints(true);						
					}
					else{
						setMoreComplaints(false);
					}
					setLoaded(true);
					setComplaints((e)=>[...e,...c.success.msg.complaints]);					
				}
			}
		});
	}

	function doSearch(val){
		hit("api/vendor/searchComplaint",{
			"token": token,
			"term": val,
			"offset": sOffset
		}).then((c)=>{
			setLoaderMsg(null);
			if(c.success){
				const cs = c.success.msg
				if(cs.length === 0 && sOffset === 0){
					setMoreComplaints(false);
					setSearching(false);
					setNotFound(true);
				}
				else{
					sOffset += limit;
					if(cs.length === limit){
						setMoreComplaints(true);
					}
					else{
						setMoreComplaints(false);
					}
					setComplaints((e)=>[...e,...cs]);
				}
			}
		})
	}

	function search(e){
		const val = e.currentTarget.value;
		setSearchVal(val);
		clearTimeout(beginSearch);
		beginSearch = setTimeout(()=>{
			setComplaints([]);
			if(val !== ""){
				sOffset = 0;
				setSearching(true);
				setMoreComplaints(false);
				setNotFound(false);
				setLoaderMsg("Searching...");
				doSearch(val);
			}
			else{
				setSearching(false);
				setLoaderMsg("Loading...");
				loadAllComplaints();
			}
		},searchAfter);
	}

	function searchMore() {
		doSearch(searchVal)
	}

	return (
		<>
			<Head>
				<title>Complaints - {appName}</title>
			</Head>
			<Header
				title="Complaints"
				hideNewComplaint
				items = {["Home","Announcements","Settings"]}
				icons = {["home","campaign","settings"]}
				links = {["/","/announcements","/settings"]}
			/>
			<div className={styles.cont}>
				{
					complaints && loaded===true && (
						<>
							<div className={styles.search}>
								<TextField
									placeholder="Search..."
									variant="outlined"
									className={styles.searchInput}
									value={searchVal}
									onChange={search}
								/>
							</div>
							<div className={styles.complaints}>
								{
									complaints.map((e,i)=>(
										<Card className={styles.main+" "+styles[e.priority]} variant="outlined">
											<CardActionArea href={"/complaint/"+e["id"]} className={styles.body}>
												<Typography variant="h4" className={styles.title}>{e.title}</Typography>
												<Typography variant="sutitle2" className={styles.block}>Created On :- {e.on}</Typography>
												<Typography variant="sutitle2" className={styles.block+" "+styles[e.status]}>Status :- <span>{e.status}</span></Typography>
												<Typography variant="sutitle2" className={styles.block+" "+styles[e.priority]}>Priority :- <span>{e.priority}</span></Typography>
											</CardActionArea>
										</Card>
									))
								}
							</div>
							{
								moreComplaints && (
									<Button className={styles.loadMore} variant="outlined" onClick={(searching===true)?searchMore:loadMore}>
										Load More
									</Button>
								)
							}
							{
								Boolean(loaderMsg) && (
									<div className={styles.searching}>
										<CircularProgress size={24} color="primary" className={styles.circle} />
										<Typography variant="subtitle1" className={styles.txt}>{loaderMsg}</Typography>
									</div>
								)
							}
							
						</>
					)
				}
				{
					!complaints && loaded===false && (
						<div className={styles.errorBlock}>
							<div className={styles.errorImg}>
								<img
									src={error}
									width="100%"
									height="100%"
									alt="No Complaints Found Illustration"
								/>
							</div>
							<Typography variant="h4">No Complaints Found!</Typography>
						</div>
					)
				}
				{
					notFound && (
						<div className={styles.errorBlock}>
							<div className={styles.errorImg}>
								<img
									src={error}
									width="100%"
									height="100%"
									alt="No Complaints Found Illustration"
								/>
							</div>
							<Typography variant="h4">No Complaints Found!</Typography>
						</div>
					)
				}
				{
					loaded===null && (
						<div className={styles.skeleton}>
							<div className={styles.search}></div>
							<div className={styles.complaints}>
								<div className={styles.complaint}></div>
								<div className={styles.complaint}></div>
								<div className={styles.complaint}></div>
								<div className={styles.complaint}></div>
							</div>
							<div className={styles.loadMore}></div>
						</div>
					)
				}
			</div>
		</>
	)
}