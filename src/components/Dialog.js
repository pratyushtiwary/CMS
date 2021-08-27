import React from 'react';
import { Button, Dialog as D, DialogContent, DialogContentText, DialogActions, DialogTitle} from "@material-ui/core";

export default function Dialog(props){

	return (
		<D open={props.open} fullScreen={true}>
		    <center><DialogTitle>{props.title}</DialogTitle></center>
		    <DialogContent className={props.className}>
		      <DialogContentText>
		        {props.msg}
		      </DialogContentText>
		      {props.children}
		    </DialogContent>
		    <DialogActions>
		      {
		      	props.buttons && props.buttons.map((e,i)=>{
		      		return (
		      			<Button onClick={e.onClick} key={i} variant="outlined" color="primary">{e.content}</Button>
		      		)
		      	})
		      }
		    </DialogActions>
		</D>
	)
}