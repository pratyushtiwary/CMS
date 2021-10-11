import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Main from "./main";
import NewAnnouncement from "./newAnnouncement";
import NewUser from "./newUser";
import NewDepartment from "./newDepartment";
import Employee from "./employee";
import Admin from "./admin";
import Vendor from "./vendor";
import Users from "./users";
import Departments from "./departments";
import Department from "./department";
import Announcements from "./announcements";

export default function User(props){
	return (
		<Router>
			<Switch>
				<Route path="/" exact>
					<Main/>
				</Route>
				<Route path="/new_announcement" exact>
					<NewAnnouncement/>
				</Route>
				<Route path="/new_user" exact>
					<NewUser/>
				</Route>
				<Route path="/new_department" exact>
					<NewDepartment/>
				</Route>
				<Route path="/users" exact>
					<Users/>
				</Route>
				<Route path="/departments" exact>
					<Departments/>
				</Route>
				<Route path="/announcements" exact>
					<Announcements/>
				</Route>
				<Route path="/employee/:id" component={Employee} />
				<Route path="/vendor/:id" component={Vendor} />
				<Route path="/admin/:id" component={Admin} />
				<Route path="/department/:id" component={Department} />
			</Switch>
		</Router>
	)
}