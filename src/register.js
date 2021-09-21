import { Helmet } from "react-helmet";
import { Typography, TextField, Button, Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import styles from "./styles/register.module.css";
import PasswordField from "./components/PasswordField";
import { createRef, useState, useEffect } from "react";
import { appName } from "./globals";
import { Success, Error } from "./components/Message";
import ResendOtp from "./components/ResendOtp";
import Loading from "./components/Loading";
import hit from "./components/hit";
import Session from './components/Session';


function Form1(props){
	const userTypes = ["Employee","Vendor"];
	const roomTypes = ["For Bachelor","For Family"];
	const [name, setName] = useState("");
	const [id, setId] = useState("");
	const [errors,setErrors] = useState(["",""]);
	const nameRef = createRef();
	const emailRef = createRef();
	const [UserType,setUserType] = useState(0);
	const [RoomType,setRoomType] = useState(0);
	const [roomNo,setRoomNo] = useState("");

	function changeUserType(e){
		setUserType(e.target.value);
	}

	function changeRoomType(e){
		setRoomType(e.target.value);
	}

	function onSubmit(e){
		e.preventDefault();
		const r = [nameRef.current,emailRef.current];
		if(name.split(" ").length > 1){
			setErrors(["",""]);
			if(UserType===1){
				props.onSubmit && props.onSubmit({
					"name": name,
					"type": userTypes[UserType].toLowerCase(),
					"email": r[1].querySelector("input").value,
					"vendorId": id
				});
			}
			else if(UserType===0){
				props.onSubmit && props.onSubmit({
					"name": name,
					"type": userTypes[UserType].toLowerCase(),
					"email": r[1].querySelector("input").value,
					"empId": id,
					"accomodation": roomTypes[RoomType].toLowerCase().split(" ").pop(),
					"roomNo": roomNo
				});
			}
		}
		else{
			r[0].querySelector("input").focus();
			setErrors(["Please enter your full name",""]);
		}
	}

	function changeId(e){
		setId(e.target.value);
	}

	function changeName(e){
		const val = e.target.value;
		if(name.split(" ").length === 1){
			setErrors(["Please enter your full name",""]);
		}
		else{
			setErrors(["",""]);
		}
		setName(val);
	}

	return (
	<form className={styles.main+" "+props.className} onSubmit={onSubmit}>
		<TextField
			type="text"
			variant="outlined"
			label="Full Name"
			id="name"
			onChange={changeName}
			value = {name}
			className={styles.input}
			error={((errors[0]!=="")?true:false)}
			helperText={errors[0]}
			ref={nameRef}
			required
		/>
		<TextField
			type="text"
			variant="outlined"
			label= {userTypes[UserType]+" Id Number"}
			id="id"
			onChange={changeId}
			value = {id}
			className={styles.input}
			required
		/>
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
	    {
	    	UserType===0 && (
	    		<>
			    	<FormControl variant="outlined" className={styles.input}>
				        <InputLabel htmlFor="userType" variant="outlined">Accomodation Type</InputLabel>
				        <Select
				          color="primary"
				          value={RoomType}
				          variant="outlined"
				          label="Accomodation Type"
				          onChange={changeRoomType}
						  required
				        >
				        {
				        	roomTypes.map((e,i)=>(
					          <MenuItem value={i} key={i}>{e}</MenuItem>
				        	))
				        }
				        </Select>
				    </FormControl>
				    <TextField
						type="text"
						value={roomNo}
						onChange={(e)=>setRoomNo(e.currentTarget.value)}
						variant="outlined"
						label="Room Number"
						id="roomno"
						className={styles.input}
						required
					/>
				</>
		    )
	    }
		<TextField
			type="email"
			variant="outlined"
			label="Email"
			id="email"
			className={styles.input}
			required
			error={((errors[1]!=="")?true:false)}
			helperText={errors[1]}
			ref={emailRef}
		/>
		<Button type="submit" variant="contained" color="primary" className={styles.reg} >Continue</Button>
	</form>
	);
}

function Form2(props){
	const [ph,setPh] = useState("");
	const [pwd,setPwd] = useState("");
	const [cpwd,setCPwd] = useState("");

	function changePh(e){
		const val = e.target.value;
		if(val.match(/^[\d]*$/) && val.length<=10){
			setPh((val));
		}
	}

	function onSubmit(e){
		e.preventDefault();
		if(props.otp==="\0"){
			const r = [pwd,cpwd];
			if(r[0]===r[1]){
				props.error && props.error(null);
				props.onSubmit && props.onSubmit({
					"phone": ph,
					"password": r[0]
				})
			}
			else{
				props.error && props.error("Passwords don't match");
			}
		}
		else{
			props.onRegister && props.onRegister();
		}

		
	}

	function validateOTP(e){
		const elem = e.currentTarget;
		const val = elem.value;
		if(val.match(/^[\d]*$/)&&val.length<=6){
			props.onChange && props.onChange(val);
		}
	}


	return (
	<form onSubmit={onSubmit} className={styles.main+" "+props.className}>
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
		<PasswordField 
		 label="Password"
		 id="pwd"
		 className={styles.input}
		 value={pwd}
		 onChange={(e)=>setPwd(e.currentTarget.value)}
		 required
		/>

		<PasswordField 
		 label="Confirm Password"
		 id="cpwd"
		 className={styles.input}
		 value={cpwd}
		 onChange={(e)=>setCPwd(e.currentTarget.value)}
		 required
		/>
		{
			props.otp!=="\0" && (
				<TextField
					type="text"
					value={props.otp}
					onChange={validateOTP}
					variant="outlined"
					label="Enter OTP"
					className={styles.input}
					required
				/>
			)
		}
		{
			props.otp==="\0" && (
				<div className={styles.btns}>
					<Button variant="outlined" color="primary" className={styles.back} onClick={props.onBack}>Back</Button>
					<Button type="submit" variant="contained" color="primary" className={styles.reg} >Send OTP</Button>
				</div>
			)
		}
		{
			props.otp!=="\0" && (
				<>
					<ResendOtp onClick={props.sendotp} />
					<div className={styles.btns}>
						<Button variant="outlined" color="primary" className={styles.back} onClick={props.onBack}>Back</Button>
						<Button type="submit" variant="contained" color="primary" className={styles.reg}>Register</Button>
					</div>
				</>
			)
		}
		
	</form>
	)
}

export default function Register(props){

	const [currForm,setCurrForm] = useState(["",styles.hidden]);
	const [successMsg,setSuccessMsg] = useState(null);
	const [errorMsg,setErrorMsg] = useState(null);
	const [finalData,setFinalData] = useState({});
	const [loaderMsg,setLoaderMsg] = useState(null);
	const [otp,setOtp] = useState("\0");
	const [allow,setAllow] = useState(false); 
	const [registered,setRegistered] = useState(false);

	useEffect(()=>{
		const loggedin = Session.login();
		if(loggedin){
			window.location.href = "/";
		}else{
			setAllow(true);
		}
	},[]);

	function submit1(data){
		setFinalData(()=>data);
		setCurrForm([styles.hidden,""]);
	}

	function submit2(data){
		let finalD = Object.assign({},finalData,data);
		setFinalData(finalD);
		finalD["by"] = "register";
		setLoaderMsg("Sending OTP...")
		hit("api/sendotp",finalD)
		.then((c)=>{
			setLoaderMsg(null);
			setSuccessMsg(null);
			setErrorMsg(null);
			if(c.success){
				setSuccessMsg("OTP sent successfully!");
				setOtp("");
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}
		})
	}

	function sendotp(){
		let copy = finalData;
		copy["by"] = "register";
		setLoaderMsg("Sending OTP...");
		hit("api/sendotp",copy)
		.then((c)=>{
			setLoaderMsg(null);
			setSuccessMsg(null);
			setErrorMsg(null);
			if(c.success){
				setSuccessMsg("OTP sent successfully!");
				setOtp("");
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}
		})
	}

	function register(){
		const finalD = finalData;
		finalD["otp"] = otp;
		setLoaderMsg("Registering...")
		hit("api/register",finalD)
		.then((c)=>{
			setLoaderMsg(null);
			setSuccessMsg(null);
			setErrorMsg(null);
			if(c.success){
				setRegistered(true);
				setSuccessMsg("Registered successfully! Redirecting...");
				setTimeout(()=>{
					window.location.href = "/login"					
				},2500);
			}

			if(c.error){
				setErrorMsg(c.error.msg);
			}
		})
	}

	function back(){
		setCurrForm(["",styles.hidden]);
	}

	return (
		<>
			<Helmet>
				<title>Register - {appName}</title>
			</Helmet>
			{
				allow && (
					<>
						<div className={styles.cont}>
							<div className={styles.bg}></div>
							<div className={styles.opacity}></div>
							<div className={styles.mainCont}>
								<Typography variant="h4" className={styles.title}>Register</Typography>
								<Typography variant="subtitle2" className={styles.subtitle}>Already have an account? <a href="/login">Login</a></Typography>
								<Success open={Boolean(successMsg)} message={successMsg}/>
								<Error open={Boolean(errorMsg)} message={errorMsg}/>
								{
									!registered && (
										<>
											<Form1 onSubmit={submit1} className={currForm[0]}/>
											<Form2 onSubmit={submit2} className={currForm[1]} onBack={back} error={setErrorMsg} otp={otp} onChange={(v)=>setOtp(v)} sendotp={sendotp} onRegister={register}/>
										</>
									)
								}
							</div>
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