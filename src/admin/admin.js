import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { Typography, Button, Icon } from "@material-ui/core";
import styles from "../styles/admin/Admin.module.css";

export default function Admin(props){

	const id = props.match.params.id;
	const [admin,setAdmin] = useState({});

	useEffect(()=>{
		setAdmin({
			"id": id,
			"name": "John Doe",
			"email": "test@test.com",
			"phone": "1122334455",
			"on": "09/08/2021"
		})
	},[id])

	return (
		<>
			<Helmet>
				<title>View admin - {appName}</title>
			</Helmet>
			<Header
				title = "View admin"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/department","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				{

					admin.id && (
						<>
							<div className={styles.meta}>
								<div className={styles.initial}>{admin.name[0]}</div>
								<div className={styles.info}>
									<Typography variant="subtitle2">{admin.id}</Typography>
									<Typography variant="h5">{admin.name}</Typography>
									<Typography variant="subtitle1">Email :- {admin.email}</Typography>
									<Typography variant="subtitle1">Phone :- {admin.phone}</Typography>
									<Typography variant="subtitle1">{admin.on}</Typography>
								</div>
							</div>
							<div className={styles.options}>
								<Button className={styles.input} variant="outlined" color="primary">
									<Icon>delete</Icon> Delete Account
								</Button>
							</div>
						</>
					)
				}
			</div>
		</>
	)
}