import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Login from "./login";
import Register from "./register";
import ForgetPassword from "./forget_password";
import User from "./user/index";
import Vendor from "./vendor/index";
import Admin from "./admin/index";
import { useState, useEffect } from "react";
import Session from "./components/Session";

import "./global.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: '#afafaf',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});


function App() {
  const [content,setContent] = useState(null)

  useEffect(()=>{
    const loggedin = Session.login();
    const path = window.location.href.split("/").pop();
    const validPaths = {
      "login": 1,
      "register": 1,
      "forget_password": 1
    }
    if(loggedin){
      console.log(loggedin);
      if(loggedin.type==="employee"){
        setContent(<User/>)
      }
      else if(loggedin.type==="vendor"){
        setContent(<Vendor/>)
      }
      else if(loggedin.type==="admin"){
        setContent(<Admin/>)
      }
      else{
        window.location.href = "/login";
      }
    }
    else if(validPaths[path]){
      return;
    }
    else{
      window.location.href = "/login";
    }
  },[])

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
            <Route path="/forget_password">
              <ForgetPassword/>
            </Route>
            <Route path="/" exact>
              {content}
            </Route>
            <Route path="/*">
              {content}
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </>
  );
}

export default App;
