import { TextField, Icon, IconButton } from "@material-ui/core";
import styles from "../styles/components/PasswordField.module.css";
import { createRef, useState, useEffect } from "react"


export default function PasswordField(props){
	const [val,setVal] = useState(props.value||"");
	const input = createRef();
	const [visibility,setVisibility] = useState("visibility")

	useEffect(()=>{
		props.value && setVal(props.value);
	},[props.value])

	function changeVal(e){
		const elem = e.currentTarget;
		const val = elem.value;
		setVal(val);
		props.onChange && props.onChange(e);
	}

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
		<div className={styles.pwd+" "+props.className}>
			<TextField
				type="password"
				variant="outlined"
				label= {props.label}
				id={props.id}
				className={styles.input}
				ref={input}
				value={val}
				onChange={changeVal}
				required={props.required||false}
			></TextField>
			<IconButton className={styles.togglePass} color="primary" onClick={toggleVisibility}>
				<Icon>{visibility}</Icon>
			</IconButton>
		</div>
	)
}