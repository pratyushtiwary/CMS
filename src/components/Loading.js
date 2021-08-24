import { Typography, Button, Dialog, DialogContent, DialogContentText, CircularProgress} from "@material-ui/core";
import styles from "../styles/components/Loading.module.css";

export default function Alert(props){

	return (
		<>
			<Dialog
				open={props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogContent>
		          <DialogContentText id="alert-dialog-description" className={styles.cont}>
		            <CircularProgress 
		            	className={styles.loader} 
		            	width = "50px"
		            	height = "50px"
		            />
		            <Typography variant="h5">{props.msg||"Loading..."}</Typography>
		          </DialogContentText>
		        </DialogContent>
			</Dialog>
		</>
	)
}