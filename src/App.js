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
import { HelmetProvider } from 'react-helmet-async';
import "./global.css";
import { Offline } from "react-detect-offline";
import { motion } from "framer-motion";

let theme = createTheme({
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
  const [content,setContent] = useState(null);
  const errorMsg = "No Internet Connection";

  useEffect(()=>{
    const loggedin = Session.login();
    let path = window.location.href.split("?")[0];
    path = path.split("/").pop();
    const validPaths = {
      "login": 1,
      "register": 1,
      "forget_password": 1
    }
    const temp = window.location.href.split("/").slice(3).join("/")
    let redirectPath = "/login";
    if(temp!==""){
      redirectPath += "?redirect_url="+temp;
    }
    if(loggedin.token){
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
        window.location.href = redirectPath;
      }
    }
    else if(validPaths[path]){
      return;
    }
    else{
      window.location.href = redirectPath;
    }
  },[]);

  return (
    <>
  	  <Offline>
  	  	<motion.div 
          className="offlineMsg"
          initial={{x: "-100vw"}}
          animate={{x:0}}
        >{errorMsg}</motion.div>
  	  </Offline>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <motion.div
            initial = {{opacity: 0}}
            animate = {{opacity: 1}}
          >
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
          </motion.div>
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
