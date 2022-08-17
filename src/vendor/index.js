import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Main from "./main";
import Complaints from "./complaints";
import Announcements from "./announcements";
import Complaint from "./complaint";
import NotFound from "./404";
import Settings from "./settings";

export default function User(props) {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Main />
        </Route>
        <Route path="/complaints">
          <Complaints />
        </Route>
        <Route path="/announcements">
          <Announcements />
        </Route>
        <Route path="/complaint/:id" component={Complaint} />
        <Route path="/settings" component={Settings} />
        <Route path="/*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}
