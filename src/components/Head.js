import { Helmet } from "react-helmet-async";

export default function Head(props) {
	return (
		<Helmet>
			{props.children}
		</Helmet>
	)
}