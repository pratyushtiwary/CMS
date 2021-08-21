import { TextField, Icon, IconButton } from "@material-ui/core";
import styles from "../styles/components/PasswordField.module.css";
import { createRef, useState } from "react"


export default function PasswordField(props){

	const input = createRef();
	const [visibility,setVisibility] = useState("visibility")

	function toggleVisibility(){
		const i = input.current.querySelector("input");
		if(visibility==="visibility"){
			i.type ="text";
			setVisibility("visibility_off")
		}
		else{
			i.type ="password";
			setVisibility("visibility");
		}
	}

	return (
		<div className={styles.pwd}>
			<TextField
				type="password"
				variant="outlined"
				label= {props.label}
				id={props.id}
				className={styles.input+" "+props.className}
				ref={input}
				required={props.required||false}
			/>
			<IconButton className={styles.togglePass} color="primary" onClick={toggleVisibility}>
				<Icon>{visibility}</Icon>
			</IconButton>
		</div>
	)
}