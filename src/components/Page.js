import { Dialog, Icon, DialogContent ,IconButton, Toolbar, AppBar, Typography } from "@material-ui/core";
import styles from "../styles/components/Page.module.css";

export default function Page(props){
	function togglePage(){
		props.onClose && props.onClose();
	}

	return (
		<>
			<Dialog
				open={props.open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				fullScreen
			>
				<DialogContent>
					{
						props.dismissable!==false && (
							<AppBar position="fixed">
								<Toolbar>
									<IconButton edge="start" color="inherit" aria-label="menu" onClick={togglePage}>
											<Icon>close</Icon>
									</IconButton>
									<Typography variant="h6">
										{props.title}
									</Typography>
								</Toolbar>
							</AppBar>
						)
					}
					<div className={styles.cont+" "+props.className} style={props.style}>
						{props.children}
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}