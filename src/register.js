import { Helmet } from "react-helmet";
import { Typography, TextField, Button, Select, FormControl, InputLabel, MenuItem } from "@material-ui/core";
import styles from "./styles/register.module.css";
import PasswordField from "./components/PasswordField";
import { createRef, useState } from "react";


function Form1(props){
	const userTypes = ["Employee","Vendor"];
	const [name, setName] = useState("");
	const [errors,setErrors] = useState(["",""]);
	const nameRef = createRef();
	const emailRef = createRef();
	const [value,setValue] = useState(0);

	function changeUserType(e){
		setValue(e.target.value);
	}

	function onSubmit(e){
		e.preventDefault();
		const r = [nameRef.current,emailRef.current];
		if(name.split(" ").length > 1){
			setErrors(["",""]);
			props.onSubmit && props.onSubmit(name);
		}
		else{
			r[0].querySelector("input").focus();
			setErrors(["Please enter your full name",""]);
		}
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
	    <FormControl variant="outlined" className={styles.input}>
	        <InputLabel htmlFor="userType" variant="outlined">User Type</InputLabel>
	        <Select
	          color="primary"
	          value={value}
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

	function changePh(e){
		const val = e.target.value;
		if(val.match(/^[\d]*$/) && val.length<=10){
			setPh((val));
		}
	}


	return (
	<form onSubmit={props.onSubmit} className={styles.main+" "+props.className}>
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
		 required
		/>

		<PasswordField 
		 label="Confirm Password"
		 id="cpwd"
		 className={styles.input}
		 required
		/>
		<div className={styles.btns}>
			<Button variant="outlined" color="primary" className={styles.back} onClick={props.onBack}>Back</Button>
			<Button type="submit" variant="contained" color="primary" className={styles.reg} >Register</Button>
		</div>
	</form>
	)
}

export default function Register(props){

	const [currForm,setCurrForm] = useState(["",styles.hidden]);


	function submit1(name){
		console.log(name);
		setCurrForm([styles.hidden,""]);
	}

	function submit2(e){
		e.preventDefault();
		console.log("Hi");
	}

	function back(){
		setCurrForm(["",styles.hidden]);
	}

	return (
		<>
			<Helmet>
				<title>Register - {props.appName}</title>
			</Helmet>
			<div className={styles.cont}>
				<div className={styles.bg}></div>
				<div className={styles.opacity}></div>
				<div className={styles.mainCont}>
					<Typography variant="h4" className={styles.title}>Register</Typography>
					<Typography variant="subtitle2" className={styles.subtitle}>Already have an account? <a href="/login">Login</a></Typography>
					<Form1 onSubmit={submit1} className={currForm[0]}/>
					<Form2 onSubmit={submit2} className={currForm[1]} onBack={back}/>
				</div>
			</div>
		</>
	)
}