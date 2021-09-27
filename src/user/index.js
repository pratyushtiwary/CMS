import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./main";
import NewComplaint from "./newComplaint";
import Announcements from "./announcements";
import Complaints from "./complaints";
import Complaint from "./complaint";
import Settings from "./settings";

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
				<Route path="/announcements" >
					<Announcements/>
				</Route>
				<Route path="/complaints" >
					<Complaints/>
				</Route>
				<Route path="/complaint/:id" component={Complaint} />
				<Route path="/settings">
					<Settings/>
				</Route>
			</Switch>
		</Router>
	)
}