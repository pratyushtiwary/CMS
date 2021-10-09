import Header from "../components/Header";
import { Helmet } from "react-helmet";
import { appName } from "../globals";
import { useState, useEffect } from "react";
import second from "../assets/user/main/second.png";
import styles from "../styles/vendor/Announcements.module.css";
import { Typography, Button, CircularProgress } from "@material-ui/core";
import hit from "../components/hit";
import Session from "../components/Session";

const limit = 10;
const token = Session.login().token;
let offset = 0;
export default function Announcements(props){
	const [announcements,setAnnouncements] = useState(null);
	const [more,setMore] = useState(false);
	const [isLoading,setIsLoading] = useState(false);
	const [loaded,setLoaded] = useState(false);

	useEffect(()=>{
		hit("api/vendor/loadAnnouncements",{
			"token": token,
			"offset": "0"
		}).then((c)=>{
			if(c.success.msg){
				offset += limit;
				setAnnouncements([...c.success.msg]);
				setLoaded(true);
				setMore(true);
			}
			else{
				setLoaded(null);
				setAnnouncements(null)
			}
		});
	},[])

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

	return (
		<>
			<Helmet>
				<title>Announcements - {appName}</title>
			</Helmet>
			<Header
				title = "Announcements"
				items = {["Home","Complaints","Setting"]}
				links = {["/","/complaints","/settings"]}
				icons = {["home","segment","settings"]}
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
			{
				announcements && loaded && (
					<div className={styles.cont}>
						{
							announcements.map((e,i)=>(
								<div className={styles.announcement} key={i}>
									<Typography variant="subtitle1">{e.body}</Typography>
									<div className={styles.attr}>
										<Typography variant="subtitle2">{e.on}</Typography>
										<Typography variant="subtitle2" className={styles.author}>- {e.author}</Typography>
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
		</>
	)

}