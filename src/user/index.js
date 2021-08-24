import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./main";
import NewComplaint from "./newComplaint";

export default function User(props){
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<Main/>
				</Route>
				<Route path="/new_complaint" >
					<NewComplaint/>
				</Route>
			</Switch>
		</Router>
	)
}