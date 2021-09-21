import { Snackbar as S , Alert} from "@material-ui/core";

export default function Snackbar(props) {
	return (
		<S
			anchorOrigin={{
		        vertical: 'bottom',
		        horizontal: 'left',
	        }}
			open = {Boolean(props.message)}
			onClose={props.onClose}
			autoHideDuration={props.autoHideDuration||5000}
			message={props.message}
		/>
	)
}