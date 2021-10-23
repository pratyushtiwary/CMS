import { Snackbar as S, SnackbarContent } from "@material-ui/core";

export default function Snackbar(props) {

	return (
		<S
			anchorOrigin={{
		        vertical: 'bottom',
		        horizontal: 'left',
	        }}
			open = {props.open}
			autoHideDuration={props.autoHideDuration||5000}
		>
			<SnackbarContent
				classes = {{
					root: props.className,
					message: props.className
				}}
				message = {props.children}
			/>
		</S>
	)
}