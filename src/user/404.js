import Head from "../components/Head";
import { appName } from "../globals";
import { Button, Typography } from "@material-ui/core";
import styles from "../styles/user/NotFound.module.css";
import second from "../assets/user/main/second.png";

export default function NotFound(props){
	return (
		<>
			<Head>
				<title>404 Page Not Found - {appName}</title>
			</Head>
			<div className={styles.cont}>
				<img
					src = {second}
					className = {styles.img}
					alt = "Page not found illustration"
				/>
				<Typography variant="h4">Page not found</Typography>
				<Typography>Make sure you have double checked the URL</Typography>
				<Button
					variant="outlined"
					color="primary"
					href="/"
					className={styles.btn}
				>Goto Home</Button>
			</div>
		</>
	)
}