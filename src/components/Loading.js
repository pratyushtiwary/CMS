import { Typography, Dialog, DialogContent, DialogContentText, CircularProgress, Zoom } from "@material-ui/core";
import styles from "../styles/components/Loading.module.css";

export default function Loading(props){

	return (
		<>
			<Dialog
				open={props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className = {styles.loader}
				TransitionComponent={Zoom}
			>
				<DialogContent>
		          <DialogContentText id="alert-dialog-description" className={styles.cont}>
		            <CircularProgress 
		            	className={styles.loader} 
		            	width = "50px"
		            	height = "50px"
		            />
		            <Typography variant="h5" className={styles.msg}>{props.msg||"Loading..."}</Typography>
		          </DialogContentText>
		        </DialogContent>
			</Dialog>
		</>
	)
}