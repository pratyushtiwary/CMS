import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Complaints from "./complaints";
import Complaint from "./complaint";

export default function User(props){
	return (
		<Router>
			<Switch>
				<Route path="/complaints">
					<Complaints/>
				</Route>
				<Route path="/complaint/:id" component={Complaint}/>
			</Switch>
		</Router>
	)
}