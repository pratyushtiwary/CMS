import { Helmet } from "react-helmet";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import styles from "../styles/user/Main.module.css";
import first from "../assets/user/main/first.png";
import second from "../assets/user/main/second.png";
import { Typography, Button, useMediaQuery } from "@material-ui/core";
import { appName } from "../globals";
import hit from "../components/hit";
import Session from "../components/Session";

export default function Main(props){
	const maxWidth = useMediaQuery("(max-width: 700px)")
	const [complaints,setComplaints] = useState(null);
	const [announcement,setAnnouncement] = useState(null);
	const [complaintStatLoaded,setComplaintStatLoaded] = useState(false);
	const [announcementLoaded,setAnnouncementLoaded] = useState(false);

	useEffect(()=>{
		const token = Session.login().token
		hit("api/employee/getComplaintsByStatus",{
			"token": token
		}).then((c)=>{
			if(c.success){
				if(c.success.msg.total===0){
					setComplaintStatLoaded(null)
					setComplaints(null)
				}
				else{
					setComplaintStatLoaded(true)
					setComplaints(c.success.msg)
				}
			}
			else{
				setComplaintStatLoaded(null)
				setComplaints(null)
			}
			
		})
		hit("api/fetch/latestAnnouncement",{
			"token": token
		}).then((c)=>{
			if(c.success){
				setAnnouncement(c.success.msg);
				setAnnouncementLoaded(true);
			}
			else{
				setAnnouncement(null);
				setAnnouncementLoaded(null);
			}
		})
	},[])

	return (
		<>
			<Helmet>
				<title>Dashboard - {appName}</title>
			</Helmet>
			<Header
				title = "Dashboard"
				items = {["Complaints","Announcements","Settings"]}
				links = {["/complaints","/announcements","/settings"]}
				icons = {["segment","campaign","settings"]}
			/>
			<div className={styles.cont}>
				{
					!complaints && complaintStatLoaded===null && maxWidth && (
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
								<Typography variant="subtitle2" className={styles.subtitle}>To register a complaint click on the "+" button above</Typography>
							</div>
						</div>
					) 
				}
				{
					!complaints && complaintStatLoaded===null && !maxWidth && (
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
				{
					complaints && complaintStatLoaded && (
						<div className={styles.complaints}>
							<Button className={styles.block} href="/complaints">
								<Typography variant="h4" className={styles.title}>{complaints.total||0}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total Complaint(s)</Typography>
							</Button>
							<Button className={styles.block} href="/complaints">
								<Typography variant="h4" className={styles.title}>{complaints.resolved||0}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Resolved Complaint(s)</Typography>
							</Button>
							<Button className={styles.block} href="/complaints">
								<Typography variant="h4" className={styles.title}>{complaints.pending||0}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Pending Complaint(s)</Typography>
							</Button>
							<Button className={styles.block} href="/complaints">
								<Typography variant="h4" className={styles.title}>{complaints.error||0}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Complaint(s) with Error</Typography>
							</Button>
						</div>
					)
				}
				{
					complaintStatLoaded===false && (
						<div className={styles.complaintSkeleton}>
							<div className={styles.total}></div>
							<div className={styles.resolved}></div>
							<div className={styles.error}></div>
							<div className={styles.pending}></div>
						</div>
					)
				}
			</div>
			<div className={styles.announcement}>
				<div className={styles.title}>
					<div className={styles.line}></div>
					<Typography variant="h4" className={styles.text}>Announcement</Typography>
				</div>
				<div className={styles.main}>
					{
						!announcement && announcementLoaded===null && (
							<div className={styles.notFound}>
							<img 
								src = {second}
								alt = "No Announcement Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Announcement Found</Typography>
							</div>
						</div>	
						)
					}
					{
						announcement && announcementLoaded && (
							<div className={styles.content}>
								<div className={styles.block}>
									<Typography variant="subtitle" className={styles.text}>{announcement.text}</Typography>
									<div className={styles.attr}>
										<Typography variant="subtitle2">{announcement.on}</Typography>
										<Typography variant="subtitle2" className={styles.author}>- {announcement.author}</Typography>
									</div>
								</div>
								{
									announcement.more && (
										<Button variant="outlined" color="primary" className={styles.more} href="/announcements">View More</Button>
									)
								}
							</div>
						)
					}
					{
						announcementLoaded===false && (
							<div className={styles.announcementSkeleton}>
								<div className={styles.content}></div>
								<div className={styles.more}></div>
							</div>
						)
					}
				</div>
			</div>
		</>
	)
}