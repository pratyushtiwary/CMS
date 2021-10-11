import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import { TextField, Button } from "@material-ui/core";
import styles from "../styles/admin/NewDepartment.module.css";

export default function NewDepartment(props){

	function create(e){
		e.preventDefault();
	}

	return (
		<>
			<Helmet>
				<title>New Department - {appName}</title>
			</Helmet>
			<Header
				title = "New Department"
				items = {["Home","New User","New Announcement","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_announcement","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","notification_add","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<form className={styles.cont} onSubmit={create}>
				<TextField
					variant="outlined"
					color="primary"
					label="Department Name"
					className={styles.input}
					required
				/>
				<Button type="submit" variant="contained" color="primary" className={styles.button}>Create</Button>
			</form>
		</>
	)
}