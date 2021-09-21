import { Helmet } from "react-helmet";
import Header from "../components/Header";
import { useState, useEffect, createRef } from "react";
import styles from "../styles/admin/Main.module.css";
import first from "../assets/admin/first.png";
import second from "../assets/admin/second.png";
import { Typography, Button, useMediaQuery, Fab, Icon, MenuList, Popover, Paper, ClickAwayListener } from "@material-ui/core";
import { appName } from "../globals";

export default function Main(props){
	const maxWidth = useMediaQuery("(max-width: 700px)")
	const [complaints,setComplaints] = useState(null);
	const [announcement,setAnnouncement] = useState(null);
	const [menu,setMenu] = useState(null);
	const menuRef = createRef();

	useEffect(()=>{
		setComplaints([6,3,2]);
		setAnnouncement({
			"text": "Adipisicing quis irure do fugiat ad duis occaecat incididunt ut ut dolor esse proident labore laboris non cupidatat voluptate nisi magna esse deserunt ullamco sit commodo anim est ea sunt in eu dolore nisi qui nostrud sed ullamco ut pariatur do irure duis aliquip dolor deserunt duis ullamco nisi esse anim fugiat laboris aute ut dolore enim dolore ex dolore nulla aliquip in in laborum culpa dolor do ullamco qui deserunt in magna ullamco ut amet exercitation enim consequat fugiat culpa veniam aliqua ut fugiat officia in esse anim laborum in ut non ullamco esse dolore sed do ut veniam in reprehenderit laboris eiusmod aliquip minim quis dolor excepteur est labore non minim irure culpa irure in tempor fugiat veniam nulla fugiat in labore id anim consequat voluptate voluptate et adipisicing in voluptate exercitation nulla eiusmod qui ex do pariatur reprehenderit veniam eiusmod excepteur incididunt dolor mollit non ut dolor.",
			"author": "Admin",
			"on": "23/08/2021"
		});
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
			<Helmet>
				<title>Dashboard - {appName}</title>
			</Helmet>
			<Header
				title = "Dashboard"
				items = {["New User","New Announcement","New Department","Departments","Complaints","Users","Settings"]}
				links = {["/new_user","/new_announcement","/new_department","/departments","/complaints","/users","/settings"]}
				icons = {["person_add","notification_add","plus_one","domain","segment","people","settings"]}
				hideNewComplaint
			/>
			<Fab color="primary" aria-label="add" className={styles.new} onClick={showMenu} ref={menuRef}>
				<Icon>add</Icon>
			</Fab>
			<div className={styles.cont}>
				{
					!complaints && maxWidth && (
						<div className={styles.notFound}>
							<img 
								src = {first}
								alt = "No Complaints Found Illustration"
								width = "300px"
								heigth = "300px"
								className = {styles.img}
							/>
							<div className={styles.msg}>
								<Typography variant="h5" className={styles.title}>No Complaints Found</Typography>
								<Typography variant="subtitle2" className={styles.subtitle}>To register a complaint click on the "+" button above</Typography>
							</div>
						</div>
					) 
				}
				{
					!complaints && !maxWidth && (
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
					complaints && (
						<div className={styles.complaints}>
							<Button className={styles.block} href="/users">
								<Typography variant="h4" className={styles.title}>{complaints[0]}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total User(s)</Typography>
							</Button>
							<Button className={styles.block} href="/users">
								<Typography variant="h4" className={styles.title}>{complaints[1]}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total Employee(s)</Typography>
							</Button>
							<Button className={styles.block} href="/users">
								<Typography variant="h4" className={styles.title}>{complaints[2]}</Typography>
								<Typography variant="h6" className={styles.subtitle}>Total Vendor(s)</Typography>
							</Button>
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
						!announcement && (
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
						announcement && (
							<div className={styles.content}>
								<div className={styles.block}>
									<Typography variant="subtitle1" className={styles.text}>{announcement.text}</Typography>
									<div className={styles.attr}>
										<Typography variant="subtitle2">{announcement.on}</Typography>
										<Typography variant="subtitle2" className={styles.author}>- {announcement.author}</Typography>
									</div>
								</div>
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