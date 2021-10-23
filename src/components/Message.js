import styles from "../styles/components/Message.module.css";
import { Typography, Icon } from "@material-ui/core";
import Snackbar from "./Snackbar";
import { motion } from "framer-motion"

export function Error({ open, message, float }){

	return (
		<>
			{
				float && (
					<Snackbar open={open} className={styles.errFloat} variant="error">
						<Icon className={styles.icon}>error</Icon>
						<Typography variant="subtitle1" className={styles.message}>{message}</Typography>
					</Snackbar>
				)
			}
			{
				!float && open && (
					<motion.div 
						className = {styles.error}
						initial = {{scale: 0}}
						animate = {{scale: 1}}
					>
						<Icon className={styles.icon}>error</Icon>
						<Typography variant="subtitle1" className={styles.message}>{message}</Typography>
					</motion.div>
				)
			}			
		</>
	)

}

export function Success({ open, message, float }){
	return (
		<>
			{
				float && (
					<Snackbar open={open} className={styles.successFloat} variant="success">
						<Icon className={styles.icon}>error</Icon>
						<Typography variant="subtitle1" className={styles.message}>{message}</Typography>
					</Snackbar>
				)
			}	
			{
				!float && open && (
					<motion.div 
						className= {styles.success}
						initial = {{scale: 0}}
						animate = {{scale: 1}}
					>
						<Icon className={styles.icon}>check_circle</Icon>
						<Typography variant="subtitle1" className={styles.message}>{message}</Typography>
					</motion.div>
				)
			}
		</>
	)
}