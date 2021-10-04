import { Helmet } from "react-helmet";
import styles from "./styles/login.module.css";
import { Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import PasswordField from "./components/PasswordField";
import { appName } from "./globals";
import { useState, useEffect } from "react";
import hit from "./components/hit";
import Loading from "./components/Loading";
import Session from './components/Session';
import { Success, Error } from "./components/Message";
import ResendOtp from "./components/ResendOtp";

export default function Login(props){
	const userTypes = ["Employee","Vendor","Admin"];
	const [UserType,setUserType] = useState(0);
	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [otp,setOtp] = useState("\0");
	const [allow,setAllow] = useState(false);
	const [logged,setLogged] = useState(false);

	useEffect(()=>{
		const loggedin = Session.login().token;
		if(loggedin){
			window.location.href = "/";
		}else{
			setAllow(true);
		}
	},[]);

	useEffect(()=>{
		setOtp("\0")
	},[UserType])

	function sendOTP(e){
		e.preventDefault();
		setLoaderMsg("Sending OTP...");
		hit("api/sendotp",{
			"type": userTypes[UserType].toLowerCase(),
			"email": email,
			"password": password,
			"by": "login"
		}).then((c)=>{
			setLoaderMsg(null);
			setErrorMsg(null);
			setSuccessMsg(null);
			if(c.success){
				setSuccessMsg("OTP sent successfull!");
				setOtp("");
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}
		});
	}

	function changeUserType(e){
		setUserType(e.target.value);
	}

	function validateOTP(e){
		const elem = e.currentTarget;
		const val = elem.value;
		if(val.match(/^[\d]*$/)&&val.length<=6){
			setOtp(val);
		}
	}

	function submit(e){
		e.preventDefault();
		setLoaderMsg("Loading...");
		hit("api/login",{
			"type": userTypes[UserType].toLowerCase(),
			"email": email,
			"password": password,
			"otp": otp
		}).then((c)=>{
			setLoaderMsg(null);
			setErrorMsg(null);
			setSuccessMsg(null);
			
			if(c.success){
				setLogged(true);
				setSuccessMsg("Login successfull! Redirecting...");
				Session.login(c.success.msg,userTypes[UserType].toLowerCase());
				setTimeout((e)=>{
					window.location.href = "/";
				},2500);
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}

		});
	}

	return (
		<>
			<Helmet>
				<title>Login - {appName}</title>
			</Helmet>
			{
				allow && (
					<>
						<div className={styles.cont}>
							<div className={styles.bg}></div>
							<div className={styles.overlay}></div>
							<form className={styles.main} onSubmit={otp==="\0"?sendOTP:submit}>
								<Typography variant="h4" className={styles.title}>Login</Typography>
								<Typography variant="subtitle2" className={styles.subtitle}>Don't have an account? <a href="/register">Register Now</a></Typography>
								<Success open={Boolean(successMsg)} message={successMsg} />
								<Error open={Boolean(errorMsg)} message={errorMsg} />
								{
									!logged && (
										<>
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
												value = {email}
												onChange = {(e)=>setEmail(e.currentTarget.value)}
												required
											/>
											<div className={styles.pwd}>
												<PasswordField 
												 label="Password"
												 id="pwd"
												 required
												 value={password}
												 onChange={(e)=>setPassword(e.currentTarget.value)}
												/>
												<a href="forget_password" className={styles.link}>Forgot Password?</a>
											</div>
											{
												otp!=="\0" && (
													<TextField
														type="text"
														value={otp}
														onChange={validateOTP}
														variant="outlined"
														label="Enter OTP"
														className={styles.input}
														required
													/>
												)
											}
											{
												otp==="\0" && (
													<Button type="submit" variant="contained" color="primary" className={styles.login}>Send OTP</Button>
												)
											}
											{
												otp!=="\0" && (
													<>
														<ResendOtp onClick={sendOTP} />
														<Button type="submit" variant="contained" color="primary" className={styles.login}>Login</Button>
													</>
												)
											}
										</>
									)
								}
								
							</form>
						</div>
						<Loading
							open={Boolean(loaderMsg)}
							msg = {loaderMsg}
						/>
					</>
				)
			}
			
		</>
	)
}