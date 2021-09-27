import { Helmet } from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import styles from "../styles/user/Settings.module.css";
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { useState } from "react";

export default function Setttings(props){

	const roomTypes = ["For Bachelor","For Family"];
	const [RoomType,setRoomType] = useState(0);
	const [RoomNumber,setRoomNumber] = useState(1234);
	const [Email,setEmail] = useState("test@test.com");
	const [notifications,setNotifications] = useState(true);
	const [ph,setPh] = useState("0000000000");

	function changeRoomType(e){
		setRoomType(e.target.value);
	}

	function changeRoomNumber(e){
		setRoomNumber(e.target.value);
	}

	function changeEmail(e){
		setEmail(e.target.value);
	}

	function changeNotification(){
		setNotifications((n)=>!n)
	}

	function changePh(e){
		const val = e.target.value;
		if(val.match(/^[\d]*$/) && val.length<=10){
			setPh((val));
		}
	}

	function submit(e){
		e.preventDefault();
		console.log("Hi");
	}

	return (
		<>
			<Helmet>
				<title>Settings - {appName}</title>
			</Helmet>
			<Header
				title = "Settings"
				items = {["Home","Complaints","Announcements"]}
				links = {["/","/complaints","/announcements"]}
				icons = {["home","segment","campaign"]}
			/>
			<form className={styles.cont} onSubmit={submit}>
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
				    className={styles.input}
			    	type="text" 
			    	label="Room Number"
			    	variant="outlined"
			    	value={RoomNumber}
			    	onChange={changeRoomNumber}
			    	required
		    	/>
		    	<TextField 
				    className={styles.input}
			    	type="email" 
			    	label="Email"
			    	variant="outlined"
			    	value={Email}
			    	onChange={changeEmail}
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
		    	<FormControlLabel
			        control={
			          <Checkbox
			            checked={notifications}
			            onChange={changeNotification}
			            color="primary"
			          />
			        }
			        label="Recieve Notifications (Email and Mobile notifications)"
			      />
		    	<Button
		    		type="submit"
		    		variant="contained"
		    		color="primary"
		    		className={styles.button}
		    	>Save</Button>
			</form>
		</>
	)
}