import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Login from "./login";
import Register from "./register";
import User from "./user/index";
import Vendor from "./vendor/index";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#000000",
    },
    secondary: {
      // This is green.A700 as hex.
      main: '#afafaf',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});


function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/login">
              <Login/>
            </Route>
            <Route path="/register">
              <Register/>
            </Route>
            <Route path="/" exact>
              <Vendor/>
            </Route>
            <Route path="/*">
              <Vendor/>
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
