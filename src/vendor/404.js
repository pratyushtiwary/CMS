import Head from "../components/Head";
import { appName } from "../globals";
import { Button, Typography } from "@material-ui/core";
import styles from "../styles/vendor/NotFound.module.css";
import error from "../assets/vendor/error.svg";

export default function NotFound(props){
	return (
		<>
			<Head>
				<title>404 Page Not Found - {appName}</title>
			</Head>
			<div className={styles.cont}>
				<img
					src = {error}
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