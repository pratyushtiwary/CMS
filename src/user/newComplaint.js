import Header from "../components/Header";
import { Helmet } from "react-helmet";
import { useState } from "react";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@material-ui/core";
import styles from "../styles/user/NewComplaint.module.css";
import { appName } from "../globals";
import Uploader from "../components/Uploader";
import Loading from "../components/Loading";

export default function NewComplaint(props){
	const [loader,setLoader] = useState(false);
	const [imgs,setImgs] = useState([]);
	const departments = ["-","XYZ","1234"];
	const [department,setDepartment] = useState(0);
	const [departmentError,setDepartmentError] = useState(null);

	function onFile(e){
		setImgs([...e]);
	}

	function changeDepartment(e){
		if(e.target.value!==0){
			setDepartmentError(null);
		}
		else{
			setDepartmentError("Please choose a valid department");
		}
		setDepartment(e.target.value);
	}

	function submitComplaint(e){
		e.preventDefault();
		if(department===0){
			setDepartmentError("Please choose a valid department");
		}
		else{
			console.log(imgs);
			setLoader(true);
			setTimeout(()=>{
				setLoader(false);
			},5000)
		}
	}

	return (
		<>
			<Helmet>
				<title>New Complaint - {appName}</title>
			</Helmet>
			<Header
				title = "New Complaint"
				hideNewComplaint = {true}
				items = {["Home","Complaints","Settings"]}
				icons = {["home","segment","settings"]}
				links = {["/","/complaints","/settings"]}
			/>
			<form className={styles.cont} onSubmit={submitComplaint}>
				<TextField 
					variant="outlined"
					label = "Complaint Message"
					multiline
					rows={9}
					className={styles.txtAr}
					required
				/>
				<FormControl variant="outlined" className={styles.input} error = {Boolean(departmentError)}>
			        <InputLabel htmlFor="departmentType" variant="outlined">Department</InputLabel>
			        <Select
			          id = "departmentType"
			          color="primary"
			          value={department}
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
			        <FormHelperText>{departmentError}</FormHelperText>
			    </FormControl>
				<Uploader 
					onFile={onFile}
				/>
				<Button 
					type = "submit"
					variant="contained" 
					color="primary"
					className={styles.submit}
				>Submit</Button>
			</form>
			<Loading
				open = {loader}
				msg = "Saving..."
			/>
		</>
	)
}