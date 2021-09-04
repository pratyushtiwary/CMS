import { Helmet } from "react-helmet";
import styles from "./styles/login.module.css";
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import PasswordField from "./components/PasswordField";
import { appName } from "./globals";
import { useState } from "react";

export default function Login(props){
	const userTypes = ["Employee","Vendor","Admin"];
	const [UserType,setUserType] = useState(0);

	function submit(e){
		e.preventDefault();
		console.log("Hi")
	}

	function changeUserType(e){
		setUserType(e.target.value);
	}

	return (
		<>
			<Helmet>
				<title>Login - {appName}</title>
			</Helmet>
			<div className={styles.cont}>
				<div className={styles.bg}></div>
				<div className={styles.overlay}></div>
				<form className={styles.main} onSubmit={submit}>
					<Typography variant="h4" className={styles.title}>Login</Typography>
					<Typography variant="subtitle2" className={styles.subtitle}>Don't have an account? <a href="/register">Register Now</a></Typography>
					<FormControl variant="outlined" className={styles.input}>
				        <InputLabel htmlFor="userType" variant="outlined">User Type</InputLabel>
				        <Select
				          color="primary"
				          value={UserType}
				          variant="outlined"
				          label="User Type"
				          onChange={changeUserType}
						  required
				        >
				        {
				        	userTypes.map((e,i)=>(
					          <MenuItem value={i} key={i}>{e}</MenuItem>
				        	))
				        }
				        </Select>
				    </FormControl>
					<TextField
						type="email"
						label="Email"
						id="email"
						variant="outlined"
						className={styles.input}
						required
					/>
					<div className={styles.pwd}>
						<PasswordField 
						 label="Password"
						 id="pwd"
						 required
						/>
						<a href="forgot" className={styles.link}>Forgot Password?</a>
					</div>
					<Button type="submit" variant="contained" color="primary" className={styles.login}>Login</Button>
				</form>
			</div>
		</>
	)
}