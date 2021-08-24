import Header from "../components/Header";
import { Helmet } from "react-helmet";
import { useState, createRef, useEffect } from "react";
import { Typography, Button, TextField, IconButton, Icon } from "@material-ui/core";
import styles from "../styles/user/NewComplaint.module.css";
import { appName } from "../globals";
import Alert from "../components/Alert";
import Loading from "../components/Loading";

export default function NewComplaint(props){
	const [imgs,setImgs] = useState([]);
	const fileInput = createRef();
	const [alertMsg,setAlertMsg] = useState(null);
	const [alertVisibile, setAlertVisibility] = useState(false);
	const [loader,setLoader] = useState(false);

	useEffect(()=>{
		console.log(1)
	},[imgs])

	function closeAlert(){
		setAlertVisibility(false);
	}

	function fileChooser(){
		const input = fileInput.current;
		input.click();
	}

	function processFile(e){
		let file = e.target.files;
		setImgs((imgs)=>{
			if(imgs.length>=5){
				setAlertMsg("You can only add 5 images");
				setAlertVisibility(true);
				return [...imgs];
			}
			else{
				let is = imgs;
				for(let i=0;i<file.length;i++){
					if(is.length<5){
						is.push(file[i])
					}
					else{
						setAlertMsg("You can only add 5 images, only 5 images from your selection have been added");
						setAlertVisibility(true);
						break;
					}
				}
				return [...is]
			}
		});			
	}

	function removeImg(e){
		let elem = e.target.parentElement.parentElement.parentElement,
		parent = elem.parentElement,
		index = Array.prototype.indexOf.call(parent.children,elem);
		let is = imgs;
		is.splice(index,1);
		setImgs([...is]);
	}

	function submitComplaint(e){
		e.preventDefault();
		setLoader(true);
		setTimeout(()=>{
			setLoader(false);
		},5000)
	}

	return (
		<>
			<Helmet>
				<title>New Complaint - {appName}</title>
			</Helmet>
			<Header
				title = "New Complaint"
				hideNewComplaint = {true}
				items = {["Home"]}
				icons = {["home"]}
				links = {["/"]}
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
				<div className={styles.imgs}>
					{
						imgs.length!==0 && imgs.map((e,i)=>{
							let img = new Blob([e]);
							img = window.URL.createObjectURL(img);
							return (
								<div key={i} className={styles.img}>
									<IconButton className={styles.remove} onClick={removeImg}>
										<Icon>close</Icon>
									</IconButton>
									<div 
										className={styles.image}
										style = {{
											backgroundImage: 'url('+img+')'
										}}
									></div>
								</div>
							)
						})
					}
					<Button className={styles.upload} variant="outlined" onClick={fileChooser}>
						<Typography variant="h5">+</Typography>
						<Typography variant="subtitle2">Upload Image</Typography>
					</Button>
					<input
						type="file"
						accept="image/*"
						ref={fileInput}
						className={styles.hide}
						onChange={processFile}
						multiple
					/>
				</div>
				<Button 
					type = "submit"
					variant="contained" 
					color="primary"
					className={styles.submit}
				>Submit</Button>
			</form>
			<Alert
				title = "Alert"
				msg = {alertMsg}
				open = {alertVisibile}
				onClose = {closeAlert}
			/>
			<Loading
				open = {loader}
				msg = "Saving..."
			/>
		</>
	)
}