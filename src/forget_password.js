import Head from "./components/Head";
import { appName } from "./globals"
import styles from "./styles/forget_password.module.css"
import { Typography, TextField, Button, useMediaQuery, FormControl, InputLabel, Select, MenuItem} from  "@material-ui/core"
import { useState, useEffect } from "react"
import PasswordField from "./components/PasswordField";
import { Success, Error } from "./components/Message";
import ResendOtp from "./components/ResendOtp";
import Loading from "./components/Loading";
import hit from "./components/hit";
import Session from "./components/Session";

function Form1(props){
	const [ph,setPh] = useState("");
	const userTypes = ["Employee","Vendor","Admin"];
	const [UserType,setUserType] = useState(0);
	const [email,setEmail] = useState("")

	function changeUserType(e){
		setUserType(e.target.value);
	}

	function changePh(e){
		const val = e.target.value;
		if(val.match(/^[\d]*$/) && val.length<=10){
			setPh((val));
		}
	}

	function onSubmit(e){
		e.preventDefault();

		props.onSubmit && props.onSubmit({
			"phone": ph,
			"email": email,
			"type": userTypes[UserType].toLowerCase()
		})

	}

	return (
		<form className={props.className} onSubmit={onSubmit}>
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
				variant="outlined"
				color="primary"
				label="Email"
				value={email}
				onChange={(e)=>setEmail(e.currentTarget.value)}
				className={styles.input}
				required
			/>
			<TextField
				type="text"
				variant="outlined"
				label="Phone no."
				id="phone"
				value = {ph}
				onChange = {changePh}
				inputMode = "numeric"
				pattern = "[0-9]*"
				className={styles.input}
				required
			/>
			<Button type="submit" variant="contained" color="primary" className={styles.button}>Send OTP</Button>							
		</form>
	)

}


function Form2(props){
	const [otp,setOtp] = useState("");
	const [pwd,setPwd] = useState("");
	const [cpwd,setCpwd] = useState("");


	function validateOTP(e){
		const elem = e.currentTarget;
		const val = elem.value;
		if(val.match(/^[\d]*$/)&&val.length<=6){
			setOtp(val);
		}
	}

	function onSubmit(e){
		e.preventDefault();
		props.success && props.success(null);
		if(pwd===cpwd){
			props.error && props.error(null);
			props.onSubmit && props.onSubmit({
				"otp": otp,
				"password": pwd
			})
		}
		else{
			props.error && props.error("Passwords don't match!")
		}
		
	}

	return (
		<form className={props.className} onSubmit={onSubmit}>
			<TextField
				type="text"
				value={otp}
				onChange={validateOTP}
				variant="outlined"
				label="Enter OTP"
				className={styles.input}
				required
			/>
			<PasswordField
				value={pwd}
				onChange={(e)=>setPwd(e.currentTarget.value)}
				variant="outlined"
				label="Enter New Password"
				className={styles.input}
				required
			/>
			<PasswordField
				value={cpwd}
				onChange={(e)=>setCpwd(e.currentTarget.value)}
				variant="outlined"
				label="Confirm New Password"
				className={styles.input}
				required
			/>
			<ResendOtp onClick={props.sendOTP} />
			<Button type="submit" variant="contained" color="primary" className={styles.button}>Reset Password</Button>
		</form>
	)

}

export default function ForgetPassword(props){
	const maxWidth = useMediaQuery("(max-width: 352px)")
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [visible,setVisible] = useState(["",styles.hidden])
	const [finalData,setFinalData] = useState({});
	const [allow,setAllow] = useState(false); 
	const [reset,setReset] = useState(false);

	useEffect(()=>{
		const loggedin = Session.login().token;
		if(loggedin){
			window.location.href = "/";
		}else{
			setAllow(true);
		}
	},[]);


	function sendOTP(e=undefined){
		let temp;
		if(e){
			const finalD = e;
			setFinalData(finalD);
			temp = finalD;
		}
		else{
			temp = finalData;
		}
		temp["by"] = "forget_password"
		setLoaderMsg("Sending OTP...");
		hit("api/sendotp",temp).then((c)=>{
			setLoaderMsg(null);
			setSuccessMsg(null);
			setErrorMsg(null);

			if(c.success){
				setSuccessMsg("OTP sent successfully!");
				setVisible([styles.hidden,""]);
			}

			if(c.error){
				setVisible(["",styles.hidden]);
				setErrorMsg(c.error.msg);
			}

		})
	}

	function forgetPassword(data){
		setLoaderMsg("Resetting Password...");
		const finalD = finalData;
		finalD["otp"] = data["otp"];
		finalD["password"] = data["password"];
		setFinalData(finalD);
		hit("api/forget_password",finalD)
		.then((c)=>{
			setLoaderMsg(null);
			setSuccessMsg(null);
			setErrorMsg(null);

			if(c.success){
				setReset(true);
				setSuccessMsg("Password reset successfully! Redirecting...");
				setTimeout(()=>{
					window.location.href="/login"
				},2500);
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}

		})
	}

	return (
		<>
			<Head>
				<title>Forget Password - {appName}</title>
			</Head>
			{
				allow && (
					<>
						<div className={styles.cont}>
							<div className={styles.main}>
								{
									maxWidth && (
										<Typography variant="h5" className={styles.title}>Forget Password</Typography>
									)
								}
								{
									!maxWidth && (
										<Typography variant="h4" className={styles.title}>Forget Password</Typography>
									)
								}
								<Success open={Boolean(successMsg)} message={successMsg}/>
								<Error open={Boolean(errorMsg)} message={errorMsg}/>
								{
									!reset && (
										<>
											<Form1 onSubmit={sendOTP} className={visible[0]} />
											<Form2 onSubmit={forgetPassword} error={setErrorMsg} className={visible[1]} sendOTP={sendOTP} success={setSuccessMsg}/>
										</>
									)
								}
							</div>
							<div className={styles.opacity} tabIndex={-1}></div>
							<div className={styles.bg} tabIndex={-1}></div>
						</div>
						<Loading
							open={Boolean(loaderMsg)}
							msg={loaderMsg}
						/>
					</>
				)
			}
			<Loading
				open={Boolean(loaderMsg)}
				msg={loaderMsg}
			/>
		</>
	)
}