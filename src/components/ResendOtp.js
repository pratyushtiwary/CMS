import { Button } from "@material-ui/core";
import styles from "../styles/components/ResendOtp.module.css";
import { useState, useEffect, createRef } from "react";

let resetTimeinMinutes = 5,totalTime = resetTimeinMinutes;

export default function ResendOtp({ onClick }){
	const Ref = createRef();
	const [timer,setTimer] = useState("00:00:00");

	const getTimeRemaining = (e)=>{
		const total = Date.parse(e) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor(((total / 1000) / 60) % 60);
		const hours = Math.floor((total / 1000 * 60 * 60) % 24);

		return {
			total, hours, minutes, seconds
		};

	}

	const startTimer = (e)=>{
		let {
			total, hours, minutes, seconds
		} = getTimeRemaining(e);

		if(total > 0){
			setTimer(
				(hours > 9 ? hours : "0"+hours) + ":" +
				(minutes > 9 ? minutes : "0"+minutes) + ":" +
				(seconds > 9 ? seconds : "0"+seconds)
			)
		}

	}
	
	const clearTimer = (e)=>{
		setTimer("00:"+(totalTime > 9 ? totalTime : "0"+totalTime)+":00");

		if(Ref.current) clearInterval(Ref.current);
		const id = setInterval(()=>{
			startTimer(e);
		},1000);
		Ref.current = id;

	}

	const getDeadTime = ()=>{
		let deadline = new Date();

		deadline.setMinutes(deadline.getMinutes() + totalTime);
		return deadline;

	}

	useEffect(()=>{
		clearTimer(getDeadTime());

		return ()=>{
			if(Ref.current){
				clearInterval(Ref.current);
			}
		}

	},[])

	const onClickReset = (e)=>{
		onClick && onClick(e);
		totalTime += resetTimeinMinutes;
		clearTimer(getDeadTime());

	}

	return (
		<>
			<Button 
				variant="outlined"
				color="primary" 
				className={styles.input} 
				onClick={onClickReset}
				disabled={timer!=="00:00:01"}
			>
				Resend OTP {
					timer !== "00:00:01" && (
						<>
							({timer})
						</>
					)
				}
			</Button>
		</>
	)

}