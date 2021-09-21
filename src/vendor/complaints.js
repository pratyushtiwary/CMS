import { appName } from "../globals";
import Helmet from "react-helmet";
import Header from "../components/Header";
import styles from "../styles/vendor/Complaints.module.css";
import { Typography, Card, TextField, CardActionArea } from "@material-ui/core";
import { useState, useEffect } from "react";
import error from "../assets/vendor/error.svg";

export default function Complaints(props){
	const [complaints,setComplaints] = useState(null);

	useEffect(()=>{
		setComplaints([
			{
				"id": "1234",
				"title": "Dolore mollit elit mollit est aute qui reprehenderit nostrud consectetur dolor irure velit minim esse laboris ea consectetur exercitation laboris ut dolore dolor reprehenderit nisi exercitation excepteur sed.",
				"on": "30/08/2021",
				"priority": "high",
				"status": "pending"
			},
			{
				"id": "1234",
				"title": "Some Title",
				"on": "30/08/2021",
				"priority": "mid",
				"status": "resolved"
			},
			{
				"id": "1234",
				"title": "Some Title",
				"on": "30/08/2021",
				"priority": "low",
				"status": "error"
			},
			{
				"id": "1234",
				"title": "Some Title",
				"on": "30/08/2021",
				"priority": "high",
				"status": "pending"
			},
			{
				"id": "1234",
				"title": "Some Title",
				"on": "30/08/2021",
				"priority": "high",
				"status": "pending"
			}
		]);
	},[props])

	return (
		<>
			<Helmet>
				<title>Complaints - {appName}</title>
			</Helmet>
			<Header
				title="Complaints"
				hideNewComplaint
				items = {["Home","Settings"]}
				icons = {["home","settings"]}
				links = {["/","/settings"]}
			/>
			<div className={styles.cont}>
				{
					complaints && (
						<>
							<div className={styles.search}>
								<TextField
									placeholder="Search..."
									variant="outlined"
									className={styles.searchInput}
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
						</>
					)
				}
				{
					!complaints && (
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
			</div>
		</>
	)
}