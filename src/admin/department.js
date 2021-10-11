import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Typography, Card, CardActionArea, Button, Icon } from "@material-ui/core";
import styles from "../styles/admin/Department.module.css";

export default function Vendor(props){

	const id = props.match.params.id;
	const [department,setDepartment] = useState({});

	useEffect(()=>{
		setDepartment({
			"name": "XYZ",
			"count": 20,
			"employees": [
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				},
				{
					"id": "1234",
					"name": "John Doe"
				}
			]
		})
	},[id])

	return (
		<>
			<Helmet>
				<title>View department - {appName}</title>
			</Helmet>
			<Header
				title = "View Department"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				{

					department.name && (
						<>
							<div className={styles.meta}>
								<div className={styles.initial}>{department.name[0]}</div>
								<div className={styles.info}>
									<Typography variant="subtitle1">{id}</Typography>
									<Typography variant="h5">{department.name}</Typography>
									<Typography variant="subtitle1">Employees Count :- {department.count}</Typography>
								</div>
							</div>
							<div className={styles.options}>
								<Button className={styles.input} variant="outlined" color="primary">
									<Icon>edit</Icon> Rename Department
								</Button>
								<Button className={styles.input} variant="outlined" color="primary">
									<Icon>delete</Icon> Delete Department
								</Button>
							</div>
							<div className={styles.complaints}>
								<div className={styles.title}>
									<div className={styles.line}></div>
									<Typography variant="h6" className={styles.content}>Employees</Typography>
								</div>
								{
									department.employees && department.employees.map((e,i)=>(
										<Card className={styles.complaint} variant="outlined">
											<CardActionArea href={"/vendor/"+e.id} className={styles.inner}>
												<div className={styles.meta}>
													<div className={styles.initial}>{e.name[0]}</div>
													<div className={styles.info}>
														<Typography variant="subtitle1">{e.id}</Typography>
														<Typography variant="h5">{e.name}</Typography>
													</div>
												</div>
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