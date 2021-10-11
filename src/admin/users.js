import Helmet from "react-helmet";
import { appName } from "../globals";
import Header from "../components/Header";
import { Tabs, Tab, Typography, Box, Card, CardActionArea, Icon, TextField } from "@material-ui/core";
import { useState, useEffect } from "react";
import errorImg1 from "../assets/admin/errorImg1.svg";
import errorImg2 from "../assets/admin/errorImg2.svg";
import styles from "../styles/admin/Users.module.css";

function a11yProps(index,name) {
  return {
    id: `tab-${index}`,
    'aria-controls': name+" tabpanel",
  };
}

function TabPanel(props) {
  const { children, value, index, name } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={name+" tab"}
      className={styles.tabPanel}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Users(props){
	const [value,setValue] = useState(0);
	const [employees,setEmployees] = useState([]);
	const [vendors,setVendors] = useState([]);
	const [admins,setAdmins] = useState([]);

	useEffect(()=>{
		setEmployees([{
			"id": "123",
			"name": "XYZ",
			"room": "1234",
			"email": "test@test.com",
			"on": "09/07/2021"
		},{
			"id": "1234",
			"name": "ABC",
			"room": "1234",
			"email": "test@test.com",
			"on": "09/07/2021"
		},{
			"id": "4321",
			"name": "XYZ",
			"room": "1234",
			"email": "test@test.com",
			"on": "09/07/2021"
		},{
			"id": "234",
			"name": "XYZ",
			"room": "1234",
			"email": "test@test.com",
			"on": "09/07/2021"
		}]);

		setAdmins([{
			"id": "123",
			"name": "XYZ",
			"email": "test@test.com",
			"on": "09/07/2021"
		},{
			"id": "1234",
			"name": "ABC",
			"email": "test@test.com",
			"on": "09/07/2021"
		},{
			"id": "4321",
			"name": "XYZ",
			"email": "test@test.com",
			"on": "09/07/2021"
		},{
			"id": "234",
			"name": "XYZ",
			"email": "test@test.com",
			"on": "09/07/2021"
		}]);

		setVendors([
			{
				"XYZ": [
					{
						"id": "123",
						"name": "1234",
						"on": "09/07/2021",
						"email": "john.doe@xyz.com",
						"phone": "1122334455"
					},
					{
						"id": "123",
						"name": "1234",
						"on": "09/07/2021",
						"email": "john.doe@xyz.com",
						"phone": "1122334455"
					}
				],
				"Test": [
					{
						"id": "543",
						"name": "John Doe",
						"on": "09/07/2021",
						"email": "john.doe@xyz.com",
						"phone": "1122334455"
					},
					{
						"id": "543",
						"name": "1234",
						"on": "09/07/2021",
						"email": "john.doe@xyz.com",
						"phone": "1122334455"
					},
					{
						"id": "543",
						"name": "1234",
						"on": "09/07/2021",
						"email": "john.doe@xyz.com",
						"phone": "1122334455"
					}
				]
			}
		]);

	},[])


	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	function renderVendors(){
		if(!vendors[0]){
			return null;
		}
		let block,cont;

		for (let department in vendors[0]){
			cont = null;
			cont = (
				<>
					{cont}
					{
						vendors[0][department].map((e,i)=>(
							<Card className={styles.block} key={i} variant="outlined">
								<CardActionArea href={"/vendor/"+e.id} className={styles.inner}>
									<div className={styles.initials}>{e.name[0]}</div>
									<div className={styles.meta}>
										<Typography className={styles.name} variant="h5">{e.name}</Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s email"}><Icon>email</Icon> <div className={styles.text}>{e.email}</div></Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s phone no."}><Icon>phone</Icon> <div className={styles.text}>{e.phone}</div></Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s account creation date"}><Icon>today</Icon> <div className={styles.text}>{e.on}</div></Typography>
									</div>
								</CardActionArea>
							</Card>
						))
					}
				</>
			)
			block = (
				<>
					{block}
					<details className={styles.dept}>
						<summary className={styles.title} title={"Department "+department}>{department}</summary>
						{cont}
					</details>
				</>
			)
		}
		return (
			<>
				{block}
			</>
		)
	}


	return (
		<>
			<Helmet>
				<title>Users - {appName}</title>
			</Helmet>
			<Header
				title="Users"
				items = {["Home","New User","New Announcement","New Department","Announcements","Departments","Complaints","Settings"]}
				links = {["/","/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/settings"]}
				icons = {["home","person_add","notification_add","plus_one","campaign","domain","segment","settings"]}
				hideNewComplaint
			/>
			<div className={styles.cont}>
				<Tabs value={value} onChange={handleChange} aria-label="User Tabs" indicatorColor="primary" variant="fullWidth">
					<Tab label="Employees" {...a11yProps(0,"Employees")}/>
					<Tab label="Vendors" {...a11yProps(1,"Vendors")}/>
					<Tab label="Admin" {...a11yProps(2,"Admin")}/>
				</Tabs>
				<TabPanel value={value} index={0} name="Employees">
					{
						(!employees || employees.length===0) &&  (
							<div className={styles.notFound}>
								<img 
									src = {errorImg1}
									alt = "No Employees Found Illustration"
									width = "300px"
									heigth = "300px"
									className = {styles.img}
								/>
								<div className={styles.msg}>
									<Typography variant="h5" className={styles.title}>No Employees Found</Typography>
								</div>
							</div>
						)
					}
					{
						employees.length!==0 && employees && (
							<TextField
								variant="outlined"
								placeholder="Search Employees..."
								className={styles.input}
							/>
						)
					}
					{
						employees.length!==0 && employees && employees.map((e,i)=>(
							<Card className={styles.block} key={i} variant="outlined">
								<CardActionArea href={"/employee/"+e.id} className={styles.inner}>
									<div className={styles.initials}>{e.name[0]}</div>
									<div className={styles.meta}>
										<Typography className={styles.name} variant="h5">{e.name}</Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s email"}><Icon>email</Icon> <div className={styles.text}>{e.email}</div></Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s room no"}><Icon>door_front</Icon> <div className={styles.text}>{e.room}</div></Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s account creation date"}><Icon>today</Icon> <div className={styles.text}>{e.on}</div></Typography>
									</div>
								</CardActionArea>
							</Card>
						))
					}
				</TabPanel>
				<TabPanel value={value} index={1} name="Vendors">
					{
						(!vendors || vendors.length===0) &&  (
							<div className={styles.notFound}>
								<img 
									src = {errorImg2}
									alt = "No Vendors Found Illustration"
									width = "300px"
									heigth = "300px"
									className = {styles.img}
								/>
								<div className={styles.msg}>
									<Typography variant="h5" className={styles.title}>No Vendors Found</Typography>
								</div>
							</div>
						)
					}
					{
						vendors[0] && (
							<TextField
								variant="outlined"
								placeholder="Search Vendors..."
								className={styles.input}
							/>
						)
					}
					{
						renderVendors()
					}
				</TabPanel>
				<TabPanel value={value} index={2} name="Admin">
					{
						(!admins || admins.length===0) &&  (
							<div className={styles.notFound}>
								<img 
									src = {errorImg2}
									alt = "No Admins Found Illustration"
									width = "300px"
									heigth = "300px"
									className = {styles.img}
								/>
								<div className={styles.msg}>
									<Typography variant="h5" className={styles.title}>No Admins Found</Typography>
								</div>
							</div>
						)
					}
					{
						admins[0] && (
							<TextField
								variant="outlined"
								placeholder="Search Admins..."
								className={styles.input}
							/>
						)
					}
					{
						admins.length!==0 && employees && employees.map((e,i)=>(
							<Card className={styles.block} key={i} variant="outlined">
								<CardActionArea href={"/admin/"+e.id} className={styles.inner}>
									<div className={styles.initials}>{e.name[0]}</div>
									<div className={styles.meta}>
										<Typography className={styles.name} variant="h5">{e.name}</Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s email"}><Icon>email</Icon> <div className={styles.text}>{e.email}</div></Typography>
										<Typography className={styles.content} variant="subtitle1" title={e.name.split(" ")[0]+"'s account creation date"}><Icon>today</Icon> <div className={styles.text}>{e.on}</div></Typography>
									</div>
								</CardActionArea>
							</Card>
						))
					}
				</TabPanel>
			</div>
		</>
	)
}