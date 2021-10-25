import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Complaints from "./complaints";
import Announcements from "./announcements";
import Complaint from "./complaint";
import NotFound from "./404";

export default function User(props){
	return (
		<Router>
			<Switch>
				<Route path="/complaints">
					<Complaints/>
				</Route>
				<Route path="/announcements">
					<Announcements/>
				</Route>
				<Route path="/complaint/:id" component={Complaint}/>
				<Route path="/*">
					<NotFound/>
				</Route>
			</Switch>
		</Router>
	)
}