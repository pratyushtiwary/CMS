import { useState, createRef, useEffect } from "react";
import { Typography, Button, Icon, IconButton } from "@material-ui/core";
import styles from "../styles/components/Uploader.module.css";
import Alert from "./Alert";
import { URL } from "../globals";

export default function Uploader({ defaultImgs, onFile, clickable, rem }){
	const [imgs,setImgs] = useState(defaultImgs||[]);
	const fileInput = createRef();
	const [alertMsg,setAlertMsg] = useState(null);
	const [alertVisibile, setAlertVisibility] = useState(false);
	

	useEffect(()=>{
		if(defaultImgs){
			setImgs([...defaultImgs]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[defaultImgs])

	function fileChooser(){
		fileInput.current.click();
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
				onFile && onFile(is);
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
		setImgs(()=>{
			onFile && onFile(is);
			return [...is];
		});
	}

	function closeAlert(){
		setAlertVisibility(false);
	}
	return (
		<>
			<div className={styles.imgs}>
				{
					imgs.length!==0 && imgs.map((e,i)=>{
						let img;
						if(typeof e === "string"){
							img = URL+"images/"+e;
						}
						else{
							img = new Blob([e]);
							img = window.URL.createObjectURL(img);
						}

						if(clickable){
							return (
								<div key={i} className={styles.img}>
									<a href={img} target="_blank"  rel="noreferrer">
										{
											rem!==false && (
												<IconButton className={styles.remove} onClick={removeImg}>
													<Icon>close</Icon>
												</IconButton>
											)
										}
										<div 
											className={styles.image}
											style = {{
												backgroundImage: 'url('+img+')'
											}}
										></div>
									</a>
								</div>
							)
						}
						return (
							<div key={i} className={styles.img}>
								{
									rem!==false && (
										<IconButton className={styles.remove} onClick={removeImg}>
											<Icon>close</Icon>
										</IconButton>
									)
								}
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
				{
					rem!==false && (
						<Button className={styles.upload} variant="outlined" onClick={fileChooser}>
							<Typography variant="h5">+</Typography>
							<Typography variant="subtitle2">Upload Image</Typography>
						</Button>
					)
				}
				{
					rem!==false && (
						<input
							type="file"
							accept="image/*"
							ref={fileInput}
							className={styles.hide}
							onChange={processFile}
							multiple
						/>
					)
				}
			</div>
			{
				rem!==false && (
					<Alert
						title = "Alert"
						msg = {alertMsg}
						open = {alertVisibile}
						onClose = {closeAlert}
					/>
				)
			}
		</>
	)
}