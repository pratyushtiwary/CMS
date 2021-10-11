import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/NewAnnouncement.module.css";
import { TextField, Button } from "@material-ui/core";

export default function NewAnnouncement(props){

	function post(e){
		e.preventDefault();
	}

	return (
		<>
			<Helmet>
				<title>New Announcement - {appName}</title>
			</Helmet>
			<Header
				title = "New Announcement"
				items = {["Home","New User","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_user","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","person_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<form className={styles.cont} onSubmit={post}>
				<TextField
					label="Announcement Body"
					variant="outlined"
					autoFocus
					rows={15}
					multiline
					required
					className={styles.body}
				/>
				<Button type="submit" variant="contained" color="primary" className={styles.post}>Post</Button>
			</form>
		</>
	)
}