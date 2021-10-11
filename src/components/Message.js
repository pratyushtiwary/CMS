import styles from "../styles/components/Message.module.css";
import { Typography, Icon } from "@material-ui/core";

export function Error({ open, message, float }){

	return (
		<>
			{
				open && (
					<div className={styles.error+" "+(float&&styles.float)}>
						<Icon className={styles.icon}>error</Icon>
						<Typography variant="subtitle1" className={styles.message}>{message}</Typography>
					</div>
				)
			}
		</>
	)

}

export function Success({ open, message, float }){
	return (
		<>
			{
				open && (
					<div className={styles.success+" "+(float&&styles.float)}>
						<Icon className={styles.icon}>check_circle</Icon>
						<Typography variant="subtitle1" className={styles.message}>{message}</Typography>
					</div>
				)
			}
		</>
	)
}