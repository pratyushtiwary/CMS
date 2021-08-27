import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";

export default function Alert(props){
	function handleClose(){
		props.onClose && props.onClose();
	}

	return (
		<>
			<Dialog
				open={props.open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				dismissable="true"
			>
				<DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
				<DialogContent>
		          <DialogContentText id="alert-dialog-description">
		            {props.msg}
		          </DialogContentText>
		        </DialogContent>
		        <DialogActions>
					<Button onClick={handleClose} color="primary">
						Dismiss
					</Button>
		        	{
		        		props.buttons && props.buttons.map((e,i)=>(
							<Button onClick={e.onClick} key={i} color="primary">
								{e.content}
							</Button>
		        		))
		        	}
		        </DialogActions>
			</Dialog>
		</>
	)
}