import Head from "../components/Head";
import { appName } from "../globals";
import Header from "../components/Header";
import { Tabs, Tab, Typography, Box, Card, CardActionArea, Icon, TextField, Button, CircularProgress } from "@material-ui/core";
import { useState, useEffect } from "react";
import errorImg1 from "../assets/admin/errorImg1.svg";
import errorImg2 from "../assets/admin/errorImg2.svg";
import styles from "../styles/admin/Users.module.css";
import hit from "../components/hit";
import Session from "../components/Session";

let empOffset = 0;
let limit = 10;
let vendorOffset = 0;
let seOffset = 0,svOffset = 0;
const token = Session.login().token;
let sE = null, sV = null;
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
	const [employees,setEmployees] = useState(null);
	const [vendors,setVendors] = useState(null);
	const [empLoaded,setEmpLoaded] = useState(null);
	const [vendorLoaded,setVendorLoaded] = useState(null);
	const [moreEmps,setMoreEmps] = useState(false);
	const [empLoadingMsg,setEmpLoadingMsg] = useState(null);
	const [moreVendors,setMoreVendors] = useState(true);
	const [vendorLoadingMsg,setVendorLoadingMsg] = useState(null);
	const [sETerm,setSETerm] = useState("");
	const [sVTerm,setSVTerm] = useState("");
	const [searchingE,setSearchingE] = useState(false);
	const [searchingV,setSearchingV] = useState(false);
	const [notFoundE,setNotFoundE] = useState(null);
	const [notFoundV,setNotFoundV] = useState(null);

	useEffect(()=>{
		hit("api/admin/listAllEmployees",{
			"token": token,
			"offset": 0
		}).then((c)=>{
			if(c.success){
				empOffset += limit;
				if(c.success.msg.count === 0){
					setEmpLoaded(false);
					setEmployees(null);
				}
				else if(c.success.msg.count > 0){
					setEmpLoaded(true);
					setEmployees([...c.success.msg.list]);
				}

				if(empOffset < c.success.msg.count){
					setMoreEmps(true);
				}
				else{
					setMoreEmps(false);
				}
			}
			else{
				setEmpLoaded(false);
				setEmployees(null);
			}
		});
		hit("api/admin/listAllVendors",{
			"token": token,
			"offset": 0
		}).then((c)=>{
			if(c.success){
				if(c.success.msg.count === 0){
					setVendorLoaded(false);
					setVendors(null);
				}
				else{
					setVendorLoaded(true);
					setVendors(c.success.msg.vendors);
				}

				vendorOffset += limit;

				if(c.success.msg.count > vendorOffset){
					setMoreVendors(true);	
				}
				else{
					setMoreVendors(false);
				}

			}
			else{
				setVendorLoaded(false);
				setVendors(null);
			}
		});
	},[])


	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	function renderVendors(){
		if(!vendors){
			return null
		}
		let block,cont;

		for (let department in vendors){
			let dept = vendors[department]
			let d = dept.name;
			if(d==="-"){
				d = "No Department";
			}
			cont = null;
			cont = (
				<>
					{cont}
					{
						dept.vendors.length === 0 && (
							<center><Typography variant="subtitle1">No Vendor Found!</Typography></center>
						)
					}
					{
						dept.vendors.length > 0 && dept.vendors.map((e,i)=>(
							<Card className={styles.block+" "+(e.active?styles.active:styles.inactive)}  title={(e.active?"Vendor's Account is Active":"Vendor's Account is Inactive")} key={i} variant="outlined">
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
						<summary className={styles.title} title={department!=="-"?(d+" Department"):(d)}>{d}</summary>
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

	function loadEmps() {
		hit("api/admin/listAllEmployees",{
			"token": token,
			"offset": empOffset
		}).then((c)=>{
			setEmpLoadingMsg(null);
			if(c.success){
				setEmployees((e)=>[...e,...c.success.msg.list]);
				empOffset += limit;
				if(empOffset < c.success.msg.count){
					setMoreEmps(true);
				}
				else{
					setMoreEmps(false);
				}
			}
		});
	}

	function loadVendors() {
		hit("api/admin/listAllVendors",{
			"token": token,
			"offset": vendorOffset
		}).then((c)=>{
			setVendorLoadingMsg(null);
			if(c.success){
				vendorOffset += limit;
				if(c.success.msg.count === 0){
					setVendorLoaded(false);
					setVendors(null);
				}
				else{
					setVendorLoaded(true);
					setVendors(c.success.msg.vendors);
				}

				vendorOffset += limit;

				if(c.success.msg.count > vendorOffset){
					setMoreVendors(true);	
				}
				else{
					setMoreVendors(false);
				}

			}
			else{
				if(vendorOffset === 0){
					setVendorLoaded(null);
					setVendors(null);
				}
			}
		});
	}

	function loadMoreEmps() {
		setEmpLoadingMsg("Loading...");
		loadEmps();
	}


	function loadMoreVendors() {
		setVendorLoadingMsg("Loading...");
		loadVendors();
	}

	function doSearchEmp(val) {
		hit("api/admin/searchEmployee",{
			"token": token,
			"term": val,
			"offset": seOffset
		}).then((c)=>{
			setEmpLoadingMsg(null);
			if(c.success){
				if(c.success.msg.length === 0 && seOffset === 0){
					setNotFoundE(true);
				}
				seOffset += limit;
				if(c.success.msg.length === limit){
					setMoreEmps(true);
				}
				else{
					setMoreEmps(false);
				}

				setEmployees((e)=>[...e,...c.success.msg])
			}
			else{
				setNotFoundE(true);
			}
		})
	}

	function doSearchVendor(val) {
		hit("api/admin/searchVendor",{
			"token": token,
			"term": val,
			"offset": svOffset
		}).then((c)=>{
			setSearchingV(false);
			setVendorLoadingMsg(null);
			if(c.success){
				if(c.success.msg.length === 0 && svOffset===0){
					setNotFoundV(true);
				}
				svOffset += limit;
				if(c.success.msg.length === limit){
					setMoreVendors(true);
				}
				else{
					setMoreVendors(false);
				}

				setVendors((e)=>[...e,...c.success.msg]);
			}
			else{
				setNotFoundE(true);
			}
		})
	}

	function searchEmp(e) {
		const val = e.currentTarget.value;
		setSETerm(val);
		clearTimeout(sE);
		sE = setTimeout(()=>{
			setNotFoundE(false);
			setEmployees([]);
			if(val!==""){
				setSearchingE(true);
				setEmpLoadingMsg("Searching...");
				seOffset = 0;
				doSearchEmp(val);
			}
			else{
				setSearchingE(false);
				empOffset = 0;
				setEmpLoadingMsg("Loading...");
				loadEmps();
			}
		},1000)
	}

	function searchVendor(e) {
		const val = e.currentTarget.value;
		setSVTerm(val);
		clearTimeout(sV);
		sV = setTimeout(()=>{
			setNotFoundV(false);
			setVendors([]);
			if(val!==""){
				setSearchingV(true);
				setVendorLoadingMsg("Searching...");
				svOffset = 0;
				doSearchVendor(val);
			}
			else{
				vendorOffset = 0;
				setNotFoundV(false);
				setVendorLoadingMsg("Loading...");
				loadVendors();
			}
		},1000)
	}

	function searchMoreEmp() {
		setNotFoundE(false);
		setEmpLoadingMsg("Loading...");
		doSearchVendor(sETerm);
	}

	function searchMoreVendor() {
		setNotFoundV(false);
		setVendorLoadingMsg("Loading...");
		doSearchVendor(sVTerm);
	}

	return (
		<>
			<Head>
				<title>Users - {appName}</title>
			</Head>
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
				</Tabs>
				<TabPanel value={value} index={0} name="Employees">
					{
						!employees && empLoaded === false &&  (
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
						empLoaded===true && employees && (
							<TextField
								variant="outlined"
								placeholder="Search Employees..."
								className={styles.search}
								value={sETerm}
								onChange={searchEmp}
							/>
						)
					}
					{
						empLoaded===true && employees && employees.map((e,i)=>(
							<Card className={styles.block+" "+(e.active?styles.active:styles.inactive)} title={(e.active?"Employee's Account is Active":"Employee's Account is Inactive")} key={i} variant="outlined">
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
					{
						notFoundE &&  (
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
						empLoaded===true && moreEmps && !Boolean(empLoadingMsg) && (
							<Button variant="outlined" color="primary" className={styles.loadMore} onClick={searchingE?searchMoreEmp:loadMoreEmps}>Load More</Button>
						)
					}
					{
						empLoaded===true && Boolean(empLoadingMsg) && (
							<div className={styles.loadingNext}>
								<CircularProgress size={24} color="primary" className={styles.circle} />
								<Typography variant="subtitle1" className={styles.txt}>{empLoadingMsg}</Typography>
							</div>
						)
					}
					{
						empLoaded === null && (
							<div className={styles.skeleton}>
								<div className={styles.search}></div>
								<div className={styles.block}></div>
								<div className={styles.block}></div>
								<div className={styles.loadMore}></div>
							</div>
						)
					}
				</TabPanel>
				<TabPanel value={value} index={1} name="Vendors">
					{
						!vendors && vendorLoaded===false &&  (
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
						vendorLoaded===true && vendors && (
							<TextField
								variant="outlined"
								placeholder="Search Vendors..."
								className={styles.search}
								value={sVTerm}
								onChange={searchVendor}
							/>
						)
					}
					{
						vendorLoaded===true && renderVendors()
					}
					{
						notFoundV &&  (
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
						vendorLoaded === null && (
							<div className={styles.skeleton}>
								<div className={styles.search}></div>
								<div className={styles.block}></div>
								<div className={styles.block}></div>
								<div className={styles.loadMore}></div>
							</div>
						)
					}
					{
						vendorLoaded===true && moreVendors && !Boolean(vendorLoadingMsg) && (
							<Button variant="outlined" color="primary" className={styles.loadMore} onClick={searchingV?searchMoreVendor:loadMoreVendors}>Load More</Button>
						)
					}
					{
						vendorLoaded===true && Boolean(vendorLoadingMsg) && (
							<div className={styles.loadingNext}>
								<CircularProgress size={24} color="primary" className={styles.circle} />
								<Typography variant="subtitle1" className={styles.txt}>{vendorLoadingMsg}</Typography>
							</div>
						)
					}
				</TabPanel>
			</div>
		</>
	)
}