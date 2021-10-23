import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/NewUser.module.css";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";
import { useState, createRef, useEffect } from "react";
import PasswordField from "../components/PasswordField";
import Session from "../components/Session";
import hit from "../components/hit";
import Loading from "../components/Loading";
import { Error, Success } from "../components/Message";

const token = Session.login().token
export default function NewUser(props){
	const userTypes = ["Employee","Vendor","Admin"];
	const [departments,setDepartments] = useState([{
		"id": -1,
		"name": "No Department"
	}]);
	const [errors,setErrors] = useState([null,null,null,null]);
	const [UserType,setUserType] = useState(0);
	const [Department,setDepartment] = useState(0);
	const [values,setValues] = useState(["","",""]);
	const refs = [createRef(),createRef(),createRef()];
	const [RoomType,setRoomType] = useState(0);
	const roomTypes = ["For Bachelor","For Family"];
	const [errorMsg,setErrorMsg] = useState(null);
	const [successMsg,setSuccessMsg] = useState(null);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [eid,setEid] = useState("");
	const [email,setEmail] = useState("");
	const [pwd,setPwd] = useState("");
	const [vid,setVid] = useState("");
	const [aid,setAid] = useState("");
	const [deptLoaded,setDeptLoaded] = useState(false);

	useEffect(()=>{
		setLoadingMsg("Loading Departments...");
		hit("api/fetch/departments",{
			"token": token
		}).then((c)=>{
			setLoadingMsg(null);
			if(c.success){
				setDepartments((e)=>[...e,...c.success.msg.departments]);
				setDeptLoaded(true);
			}
			else{
				setErrorMsg("Unable to load departments, please reload");
				setDeptLoaded(false);
			}
		})
	},[]);

	function changeUserType(e){
		setUserType(e.target.value);
	}

	function changeDepartment(e){
		setDepartment(e.target.value);			
	}

	function changeFullName(e){
		const value = e.target.value;
		let k = errors;
		if(value.split(/ +[\w\W]/).length === 1){
			k[0] = "Please enter full name"
			setErrors([...k]);
		}
		else{
			k[0] = null;
			setErrors([...k]);
		}
		let v = values;
		v[0] = value;
		setValues([...v]);
	}

	function changeRoomNo(e){
		const value = e.target.value;
		let v = values;
		if(value.match(/^([0-9]*)$/)){
			v[1] = value;
			setValues([...v]);
		}
	}

	function changePhoneNo(e){
		const value = e.target.value;
		let v = values;
		if(value.match(/^([0-9]*)$/) && value.length<=10){
			v[2] = value;
			setValues([...v]);
		}
	}

	function create(e){
		e.preventDefault();
		let errs = errors;
		let rs = refs;
		setErrorMsg(null);
		setSuccessMsg(null);
		if(values[0].split(/ +[\w\W]/).length !== 2){
			errs = [null,null,null,null];
			errs[0] = "Please enter full name";
			setErrors([...errs]);
			rs[0].current.querySelector("input").focus();
			return;
		}
		else if(values[2].length!==10){
			errs = [null,null,null,null];
			errs[2] = "Please enter a valid phone no.";
			setErrors([...errs]);
			rs[2].current.querySelector("input").focus();
			return;
		}
		else{
			errs = [null,null,null,null];
			setErrors([...errs]);
			setLoadingMsg("Creating User...");
			const name = values[0],
			phone = values[2];
			let params;
			if(UserType===0){
				params = {
					"name": name,
					"roomNo": values[1],
					"eid": eid,
					"accomodationType": (roomTypes[RoomType]==="For Bachelor"?"bachelor":"family"),
					"email": email,
					"phone": phone,
					"password": pwd,
					"type": "employee"
				}
			}
			else if(UserType===1){
				params = {
					"name": name,
					"email": email,
					"phone": phone,
					"password": pwd,
					"vid": vid,
					"dept": departments[Department].id,
					"type": "vendor"
				}
			}
			else if(UserType===2){
				params = {
					"name": name,
					"email": email,
					"phone": phone,
					"password": pwd,
					"aid": aid,
					"type": "admin"
				}
			}
			params["token"] = token
			hit("api/admin/createNewUser",params)
			.then((c)=>{
				setLoadingMsg(null);
				if(c.success){
					setEid("");
					setRoomType(0);
					setPwd("");
					setEmail("");
					setValues(["","",""]);
					setAid("");
					setDepartment(0);
					setVid("");
					setSuccessMsg(c.success.msg);
				}
				else{
					setErrorMsg(c.error.msg);
				}
			})
		}
	}

	function changeRoomType(e){
		setRoomType(e.target.value);
	}

	return (
		<>
			<Head>
				<title>New User - {appName}</title>
			</Head>
			<Header
				title = "New User"
				items = {["Home","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<form className={styles.cont} onSubmit={create}>
				<Success open={Boolean(successMsg)} message={successMsg}/>
				<Error open={Boolean(errorMsg)} message={errorMsg}/>
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
			        	userTypes.map((e,i)=>{
			        		if(deptLoaded===true && i===1){
					          return <MenuItem value={i} key={i}>{e}</MenuItem>
			        		}
			        		else if(i!==1){
					            return <MenuItem value={i} key={i}>{e}</MenuItem>			        			
			        		}
			        		return null;
			        	})
			        }
			        </Select>
			    </FormControl>
			    <TextField 
			    	variant="outlined" 
			    	color="primary"
			    	label="Full Name"
			    	value={values[0]}
			    	className={styles.input}
			    	required
			    	onChange={changeFullName}
			    	error={Boolean(errors[0])}
			    	helperText={errors[0]}
			    	ref={refs[0]}
			    />
			    {
			    	UserType===0 && (
						<TextField 
					    	variant="outlined" 
					    	color="primary"
					    	label="Room No."
					    	value={values[1]}
					    	className={styles.input}
					    	required
					    	onChange={changeRoomNo}
					    />
		    		)
			    }
			    {
			    	UserType===0 && (
			    		<>
							<TextField 
						    	variant="outlined" 
						    	color="primary"
						    	label="Employee Id Number"
						    	className={styles.input}
						    	required
						    	value={eid}
						    	onChange={(e)=>setEid(e.currentTarget.value)}
						    />
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
					    </>
		    		)
			    }
			    {
			    	UserType===1 && (
						<TextField 
					    	variant="outlined" 
					    	color="primary"
					    	label="Vendor Id Number"
					    	className={styles.input}
					    	value={vid}
					    	onChange={(e)=>setVid(e.currentTarget.value)}
					    	required
					    />
		    		)
			    }
			    {
			    	UserType===2 && (
						<TextField 
					    	variant="outlined" 
					    	color="primary"
					    	label="Admin Id Number"
					    	value={aid}
					    	className={styles.input}
					    	required
					    	onChange={(e)=>setAid(e.currentTarget.value)}
					    />
		    		)
			    }
			    {
			    	UserType===1 && (
						<FormControl variant="outlined" className={styles.input} error={Boolean(errors[3])}>
					        <InputLabel htmlFor="userType" variant="outlined">Department</InputLabel>
					        <Select
					          color="primary"
					          value={Department}
					          variant="outlined"
					          label="Department"
					          onChange={changeDepartment}
							  required
					        >
					        {
					        	departments.map((e,i)=>(
						          <MenuItem value={i} key={i}>{e.name}</MenuItem>
					        	))
					        }
					        </Select>
					        <FormHelperText>{errors[3]}</FormHelperText>
					    </FormControl>
		    		)
			    }
			    <TextField 
			    	type="email"
			    	variant="outlined" 
			    	color="primary"
			    	label="Email"
			    	className={styles.input}
			    	required
			    	value={email}
			    	onChange={(e)=>setEmail(e.currentTarget.value)}
			    />
			    <TextField 
			    	variant="outlined" 
			    	color="primary"
			    	label="Phone No."
			    	onChange={changePhoneNo}
			    	value={values[2]}
			    	className={styles.input}
			    	error={Boolean(errors[2])}
			    	helperText={errors[2]}
			    	ref={refs[2]}
			    	required
			    />
				<PasswordField 
					label="Password"
					id="pwd"
					className={styles.input}
					required
					value={pwd}
					onChange={(e)=>setPwd(e.currentTarget.value)}
				/>
			    <Button type="submit" variant="contained" color="primary" className={styles.create}>Create</Button>
			</form>
			<Loading
				open={Boolean(loadingMsg)}
				msg={loadingMsg}
			/>
		</>
	)
}