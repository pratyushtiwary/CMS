import { Typography, IconButton, Icon, TextField, Button } from "@material-ui/core";
import styles from "../styles/components/Feedback.module.css";
import { useState, useEffect } from "react";
import Loading from "./Loading";
import Session from "./Session";
import hit from "./hit";

const token = Session.login().token;
export default function Feedback(props) {
	const [stars,setStars] = useState([0,0,0,0,0]);
	const [feedback,setFeedback] = useState("");
	const [feedbackErr,setFeedbackErr] = useState(null);
	const [starsErr,setStarsErr] = useState(null);
	const [loadingMsg,setLoadingMsg] = useState(null);
	const [givenFeedback,setGivenFeedback] = useState(props.feedback.given||false);

	useEffect(()=>{
		let s = [0,0,0,0,0];
		for(let i=0;i<props.feedback.rating;i++){
			s[i] = 1;
		}
		setStars([...s]);
		setFeedback(props.feedback.feedback);
	},[props.feedback])

	useEffect(()=>{
		if(feedback!==""){
			setFeedbackErr(null);
		}
	},[feedback])

	let changeStars = (i) => (e) => {
		let oldStars = [0,0,0,0,0];
		setStarsErr(null);
		for(let index=0;index<=i;index++){
			oldStars[index] = 1;
		}
		setStars([...oldStars]);
	}

	function finalSubmit() {
		setLoadingMsg("Submitting Feedback...");
		let rating = 0;
		for(let i=0;i<stars.length;i++){
			if(stars[i]===1){
				rating += 1;
			}
		}
		if(props.for==="employee"){
			hit("api/employee/saveFeedback",{
				"token": token,
				"cid": props.cid,
				"rating": rating,
				"feedback": feedback
			}).then((c)=>{
				setLoadingMsg(null);
				if(c.success){
					props.onFeedback && props.onFeedback({
						"rating": rating,
						"feedback": feedback
					});
					setGivenFeedback(true);
				}
				else{
					props.onError && props.onError(c.error.msg);
				}
			})
		}
		else if(props.for==="vendor"){
			hit("api/vendor/saveFeedback",{
				"token": token,
				"cid": props.cid,
				"rating": rating,
				"feedback": feedback
			}).then((c)=>{
				setLoadingMsg(null);
				if(c.success){
					props.onFeedback && props.onFeedback({
						"rating": rating,
						"feedback": feedback
					});
					setGivenFeedback(true);
				}
				else{
					props.onError && props.onError(c.error.msg);
				}
			})
		}
	}

	function submit() {
		let find = 0;
		for(let i=0;i<stars.length;i++){
			if(stars[i]){
				find = 1;
				break;
			}
		}
		if(find===0){
			setStarsErr("Please select a rating!");
		}
		else{
			if(feedback){
				if(feedback!==""){
					setFeedbackErr(null);
					finalSubmit();
				}
				else{
					setFeedbackErr("Please enter a valid feedback!");
				}
			}
			else{
				setFeedbackErr("Please enter a valid feedback!");
			}
		}
	}


	function editFeedback() {
		props.onEdit && props.onEdit();
		setGivenFeedback(false);
	}


	return (
		<>
			<Typography variant="h6">{props.title||"Feedback"}</Typography>
			<hr/>
			{
				givenFeedback===false && (
					<>
						<div className={styles.stars}>
							{
								stars.map((e,i)=>(
									<IconButton key={i} onClick={changeStars(i)}>
										{
											e === 0 && (
												<Icon className={styles.starOutline}>star_outline</Icon>
											)
										}
										{
											e === 1 && (
												<Icon className={styles.star}>star</Icon>
											)
										}
									</IconButton>
								))
							}
						</div>
						<Typography className={styles.error}>{starsErr}</Typography>
						<TextField
							variant="outlined"
							color="primary"
							multiline
							rows={6}
							label="Feedback"
							required
							className={styles.input}
							error={Boolean(feedbackErr)}
							helperText={feedbackErr}
							value={feedback}
							onChange={(e)=>setFeedback(e.currentTarget.value)}
						/>
						<Button
							variant="outlined"
							color="primary"
							className={styles.submit}
							onClick={submit}
						>Submit</Button>
					</>
				)
			}
			{
				givenFeedback===true && props.feedback && (
					<div className={styles.feedback}>
						<div className={styles.stars}>
							{
								stars.map((e,i)=>{
									if(i < props.feedback.rating){
										return (
											<Icon className={styles.star} key={i}>star</Icon>
										)	
									}
									return (
										<Icon className={styles.starOutline} key={i}>star_outline</Icon>
									)
								})
							}
						</div>
						<Typography className={styles.desc}>{props.feedback.feedback}</Typography>
						{
							!props.noEdit && (
								<Button
									variant="outlined"
									color="primary"
									className={styles.edit}
									onClick={editFeedback}
								>Edit</Button>
							)
						}
					</div>
				)
			}
			<Loading
				open={Boolean(loadingMsg)}
				msg={loadingMsg}
			/>
		</>
	)
}