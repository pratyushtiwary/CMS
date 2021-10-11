import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/admin/NewUser.module.css";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";
import { useState, createRef } from "react";
import PasswordField from "../components/PasswordField";


export default function NewUser(props){
	const userTypes = ["Employee","Vendor","Admin"];
	const departments = ["-","1234","Xyz"];
	const [errors,setErrors] = useState([null,null,null,null]);
	const [UserType,setUserType] = useState(0);
	const [Department,setDepartment] = useState(0);
	const [values,setValues] = useState(["","",""]);
	const refs = [createRef(),createRef(),createRef()];

	function changeUserType(e){
		setUserType(e.target.value);
	}

	function changeDepartment(e){
		let errs = errors;
		if(e.target.value===0){
			errs[3] = "Please select a valid department";
			setErrors([...errs]);
		}
		else{
			errs[3] = null;
			setErrors([...errs]);
		}
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
		else if(Department===0){
			errs = [null,null,null,null];
			errs[3] = "Please select a valid department";
			setErrors([...errs]);
			return;
		}
		else{
			errs = [null,null,null,null];
			setErrors([...errs]);
		}
	}

	return (
		<>
			<Helmet>
				<title>New User - {appName}</title>
			</Helmet>
			<Header
				title = "New User"
				items = {["Home","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["home","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<form className={styles.cont} onSubmit={create}>
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
						<TextField 
					    	variant="outlined" 
					    	color="primary"
					    	label="Employee Id Number"
					    	className={styles.input}
					    	required
					    />
		    		)
			    }
			    {
			    	UserType===1 && (
						<TextField 
					    	variant="outlined" 
					    	color="primary"
					    	label="Vendor Id Number"
					    	className={styles.input}
					    	required
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
						          <MenuItem value={i} key={i}>{e}</MenuItem>
					        	))
					        }
					        </Select>
					        <FormHelperText>{errors[3]}</FormHelperText>
					    </FormControl>
		    		)
			    }
			    <TextField 
			    	type="Email"
			    	variant="outlined" 
			    	color="primary"
			    	label="Email"
			    	className={styles.input}
			    	required
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
				/>
			    <Button type="submit" variant="contained" color="primary" className={styles.create}>Create</Button>
			</form>
		</>
	)
}