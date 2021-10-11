import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Typography, Card, CardActionArea, Button, Icon } from "@material-ui/core";
import styles from "../styles/admin/Vendor.module.css";

export default function Vendor(props){

	const id = props.match.params.id;
	const [employee,setEmployee] = useState({});

	useEffect(()=>{
		setEmployee({
			"id": id,
			"name": "John Doe",
			"department": "XYZ",
			"email": "test@test.com",
			"phone": "1122334455",
			"on": "09/08/2021",
			"complaints": [
				{
					"id": "1234",
					"title": "Quis ex quis sunt est excepteur et ullamco tempor enim.",
					"on": "09/08/2021",
					"status": "pending",
					"priority": "high"
				},
				{
					"id": "1234",
					"title": "Quis ex quis sunt est excepteur et ullamco tempor enim.",
					"on": "09/08/2021",
					"status": "pending",
					"priority": "high"
				},
				{
					"id": "1234",
					"title": "Quis ex quis sunt est excepteur et ullamco tempor enim.",
					"on": "09/08/2021",
					"status": "pending",
					"priority": "high"
				},
				{
					"id": "1234",
					"title": "Quis ex quis sunt est excepteur et ullamco tempor enim.",
					"on": "09/08/2021",
					"status": "pending",
					"priority": "high"
				},
				{
					"id": "1234",
					"title": "Quis ex quis sunt est excepteur et ullamco tempor enim.",
					"on": "09/08/2021",
					"status": "pending",
					"priority": "high"
				}
			]
		})
	},[id])

	return (
		<>
			<Helmet>
				<title>View Employee - {appName}</title>
			</Helmet>
			<Header
				title = "View Employee"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				{

					employee.id && (
						<>
							<div className={styles.meta}>
								<div className={styles.initial}>{employee.name[0]}</div>
								<div className={styles.info}>
									<Typography variant="subtitle2">{employee.id}</Typography>
									<Typography variant="h5">{employee.name}</Typography>
									<Typography variant="subtitle1">Department :- {employee.department}</Typography>
									<Typography variant="subtitle1">Email :- {employee.email}</Typography>
									<Typography variant="subtitle1">Phone :- {employee.phone}</Typography>
									<Typography variant="subtitle1">{employee.on}</Typography>
								</div>
							</div>
							<div className={styles.options}>
								<Button className={styles.input} variant="outlined" color="primary">
									<Icon>swap_horiz</Icon> Change Department
								</Button>
								<Button className={styles.input} variant="outlined" color="primary">
									<Icon>delete</Icon> Delete Account
								</Button>
							</div>
							<div className={styles.complaints}>
								<div className={styles.title}>
									<div className={styles.line}></div>
									<Typography variant="h6" className={styles.content}>Complaints Alloted</Typography>
								</div>
								{
									employee.complaints && employee.complaints.map((e,i)=>(
										<Card className={styles.complaint} variant="outlined">
											<CardActionArea href={"/complaint/"+e.id} className={styles.inner}>
												<Typography variant="h5" className={styles.content}>{e.title}</Typography>
												<Typography variant="subtitle1" className={styles.content}>Status :- <span className={styles[e.status]}>{e.status}</span></Typography>
												<Typography variant="subtitle1" className={styles.content}>Priority :- <span className={styles[e.priority]}>{e.priority}</span></Typography>
												<Typography variant="subtitle1" className={styles.content}>On :- <span>{e.on}</span></Typography>
											</CardActionArea>
										</Card>
									))
								}
							</div>
						</>
					)
				}
			</div>
		</>
	)
}