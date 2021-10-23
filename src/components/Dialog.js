import React from 'react';
import { Button, Dialog as D, DialogContent, DialogContentText, DialogActions, DialogTitle, Zoom, Fade} from "@material-ui/core";

export default function Dialog(props){

	return (
		<D 
			open={props.open} 
			fullScreen={props.fullScreen} 
			fullWidth={props.fullWidth||false} 
			maxWidth={props.maxWidth||"sm"}
			TransitionComponent={props.fullScreen?Fade:Zoom}
		>
		    <center><DialogTitle>{props.title}</DialogTitle></center>
		    <DialogContent 
		    	className={props.className}
		    	classes = {{
		    		root: props.rootClass
		    	}}
	    	>
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