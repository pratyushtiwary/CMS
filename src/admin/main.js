import Head from "../components/Head";
import Header from "../components/Header";
import { useState, useEffect, createRef } from "react";
import styles from "../styles/admin/Main.module.css";
import first from "../assets/admin/first.png";
import second from "../assets/admin/second.png";
import { Typography, Button, useMediaQuery, Fab, Icon, MenuList, Popover, Paper, ClickAwayListener } from "@material-ui/core";
import { appName } from "../globals";
import hit from "../components/hit";
import Session from "../components/Session";

const token = Session.login().token;
export default function Main(props){
	const maxWidth = useMediaQuery("(max-width: 700px)")
	const [users,setUsers] = useState(null);
	const [announcement,setAnnouncement] = useState(null);
	const [menu,setMenu] = useState(null);
	const menuRef = createRef();
	const [statLoaded,setStatLoaded] = useState(null);
	const [announcementLoaded,setAnnouncementLoaded] = useState(null);
	const [more,setMore] = useState(false);

	useEffect(()=>{
		hit("api/admin/getUsersByStat",{
			"token": token
		}).then((c)=>{
			if(c.success){
				const stats = c.success.msg;
				if(stats["total"] > 0){
					setStatLoaded(true);
					setUsers([stats["total"],stats["employees"],stats["vendors"]])					
				}
				else{
					setStatLoaded(false);
					setUsers(null);
				}
			}
			else{
				setStatLoaded(false);
				setUsers(null);
			}
		})
		hit("api/fetch/latestAnnouncement",{
			"token": token
		}).then((c)=>{
			if(c.success){
				setMore(c.success.msg.more);
				setAnnouncement(c.success.msg);
				setAnnouncementLoaded(true);
			}
			else{
				setAnnouncement(null);
				setAnnouncementLoaded(false);
			}
		})
		
	},[])

	function closeMenu(){
		menuRef.current.classList.remove(styles.close);
		setMenu(null);
	}

	function showMenu(e){
		setMenu(e.currentTarget);
		e.currentTarget.classList.add(styles.close);
	}

	return (
		<>
			<Head>
				<title>Dashboard - {appName}</title>
			</Head>
			<Header
				title = "Dashboard"
				items = {["New User","New Announcement","New Department","Announcements","Departments","Complaints","Users","Settings"]}
				links = {["/new_user","/new_announcement","/new_department","/announcements","/departments","/complaints","/users","/settings"]}
				icons = {["person_add","notification_add","plus_one","campaign","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<Fab color="primary" aria-label="add" className={styles.new} onClick={showMenu} ref={menuRef}>
				<Icon>add</Icon>
			</Fab>
			<div className={styles.cont}>
				{
					!users && statLoaded===false && maxWidth && (
						<div className={styles.notFound}>
							<img 
								src = {first}
								alt = "No users Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No users Found</Typography>
								<Typography variant="subtitle2" className={styles.subtitle}>To register a complaint click on the "+" button above</Typography>
							</div>
						</div>
					) 
				}
				{
					!users && statLoaded===false && !maxWidth && (
						<div className={styles.notFound}>
							<img 
								src = {first}
								alt = "No Users Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Users Found</Typography>
							</div>
						</div>
					) 
				}
				{
					users && statLoaded===true && (
						<div className={styles.users}>
							<Button className={styles.block} href="/users">
								<Typography variant="h4" className={styles.title}>{users[0]}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total User(s)</Typography>
							</Button>
							<Button className={styles.block} href="/users">
								<Typography variant="h4" className={styles.title}>{users[1]}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total Employee(s)</Typography>
							</Button>
							<Button className={styles.block} href="/users">
								<Typography variant="h4" className={styles.title}>{users[2]}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total Vendor(s)</Typography>
							</Button>
						</div>
					)
				}
				{
					statLoaded===null && (
						<div className={styles.skeleton}>
							<div className={styles.block}></div>
							<div className={styles.block}></div>
							<div className={styles.block}></div>
						</div>
					)
				}
			</div>
			<div className={styles.announcement}>
				<div className={styles.title}>
					<div className={styles.line}></div>
					<Typography variant="h4" className={styles.text}>Announcement</Typography>
				</div>
				<div className={styles.main}>
					{
						!announcement && announcementLoaded===false && (
							<div className={styles.notFound}>
							<img 
								src = {second}
								alt = "No Announcement Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Announcement Found</Typography>
							</div>
						</div>	
						)
					}
					{
						announcement && announcementLoaded===true && (
							<div className={styles.content}>
								<div className={styles.block}>
									<Typography variant="subtitle1" className={styles.text}>{announcement.text}</Typography>
									<div className={styles.attr}>
										<Typography variant="subtitle2">{announcement.on}</Typography>
										<Typography variant="subtitle2" className={styles.author}>- {announcement.author}</Typography>
									</div>
								</div>
								{
									more && (
										<Button className={styles.viewMore} variant="outlined" href="/announcements">View More</Button>
									)
								}
							</div>
						)
					}
					{
						announcementLoaded===null && (
							<div className={styles.skeleton}>
								<div className={styles.bigBlock}></div>
								<div className={styles.viewMore}></div>
							</div>
						)
					}
				</div>
			</div>
			<Popover
				open={Boolean(menu)}
				anchorEl = {menu}
				placement="top"
				className={styles.menu}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'center',
				}}
				transformOrigin={{
					vertical: 'bottom',
					horizontal: 'right',
				}}
			>
				<ClickAwayListener onClickAway={closeMenu}>
					<Paper>
						<MenuList>
							<Button href="new_announcement" className={styles.menuItem}>New Announcement</Button>
							<Button href="new_user" className={styles.menuItem}>New User</Button>
							<Button href="new_department" className={styles.menuItem}>New Department</Button>
						</MenuList>
					</Paper>
				</ClickAwayListener>
			</Popover>
		</>
	)
}