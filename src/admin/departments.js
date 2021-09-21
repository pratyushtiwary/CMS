import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/Departments.module.css";
import { Card, CardActionArea, Typography, Icon, Button, TextField } from "@material-ui/core";
import { useState, useEffect } from "react";

export default function Departments(props){
	const [departments,setDepartments] = useState(null);

	useEffect(()=>{
		setDepartments([
			{
				"id": 123,
				"name": "Xyz",
				"count": 10	
			},
			{
				"id": 123,
				"name": "Xyz",
				"count": 10	
			},
			{
				"id": 123,
				"name": "Xyz",
				"count": 10	
			},
			{
				"id": 123,
				"name": "Xyz",
				"count": 10	
			},
			{
				"id": 123,
				"name": "Xyz",
				"count": 10	
			},
			{
				"id": 123,
				"name": "Xyz",
				"count": 10	
			}
		]);
	},[])

	function renameDepartment(e){
		e.preventDefault();
	}

	function deleteDepartment(e){
		e.preventDefault();
	}

	return (
		<>
			<Helmet>
				<title>Departments - {appName}</title>
			</Helmet>
			<Header
				title = "Departments"
				items = {["Home","New User","New Announcement","New Department","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","segment","people","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				{
					departments && (
						<TextField
							variant="outlined"
							color="primary"
							className={styles.search}
							placeholder="Search..."
						/>
					)
				}
				<div className={styles.departments}>
					{
						departments && departments.map((e,i)=>(
							<Card className={styles.department} key={i} variant="outlined">
								<CardActionArea className={styles.inner} href={"/department/"+e.id}>
									<Typography variant="h4" className={styles.name}>{e.name}</Typography>
									<Typography variant="subtitle1" className={styles.emps}><Icon classNames={styles.icon}>groups</Icon><span className={styles.content}>{e.count} employees</span></Typography>
									<div className={styles.options}>
										<Button className={styles.rename} variant="outlined" onClick={renameDepartment}><Icon>edit</Icon><span className={styles.content}>Rename Department</span></Button>
										<Button className={styles.delete} variant="outlined" onClick={deleteDepartment}><Icon>delete</Icon><span className={styles.content}>Delete Department</span></Button>
									</div>
								</CardActionArea>
							</Card>
						))
					}
				</div>
			</div>
		</>
	)
}