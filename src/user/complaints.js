import { appName } from "../globals";
import { Helmet } from "react-helmet";
import Header from "../components/Header";
import styles from "../styles/user/Complaints.module.css";
import { Card, TextField, MenuItem, Menu, ListItemIcon, ListItemText, IconButton, Icon, CardActionArea, Typography } from "@material-ui/core"; 
import first from "../assets/user/main/first.png";
import { useState, useEffect } from "react";

export default function Complaints(props){
	const [complaints,setComplaints] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);

	useEffect(()=>{
		setComplaints([{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "pending"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "resolved"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "error"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "pending"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "resolved"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "error"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "pending"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "resolved"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "error"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "pending"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "resolved"
		},{
			"complaintId": Math.round(Math.random() * 1000),
			"shortTitle": "Lorem ipsum excepteur non...",
			"longText": "Lorem ipsum qui laboris veniam ut incididunt officia veniam ut sed sint in tempor nostrud minim in amet aute et qui anim consectetur aliqua do dolore ea deserunt id commodo ad adipisicing reprehenderit mollit in proident cupidatat aute qui cupidatat.",
			"date": "24/08/2021",
			"status": "error"
		}])
	},[props]);

	const handleClose = (e) => {
		document.querySelector("html").style.overflowY = "auto";
		setAnchorEl(null);
	};

	function showMenu(e){
		e.preventDefault();
		document.querySelector("html").style.overflowY = "hidden";
		setAnchorEl(e.currentTarget);
	}


	return (
		<>
			<Helmet>
				<title>Complaints - {appName}</title>
			</Helmet>
			<Header
				title="Complaints"
				items = {["Home","Settings"]}
				links = {["/","/settings"]}
				icons = {["home","settings"]}
				search
			/>
			<div className={styles.cont}>
				{
					!complaints && (
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
								<Typography variant="subtitle2" className={styles.subtitle}>To register a complaint click on the "New Complaint" button above</Typography>
							</div>
						</div>
					) 
				}
				{
					complaints && (
						<div className={styles.search}>
							<TextField
								placeholder = "Search..."
								variant = "outlined"
								className={styles.searchInput}
							/>
						</div>
					)
				}
				{
					complaints && complaints.map((e,i)=>(
						<Card variant="outlined" key={i} className={styles.complaint} title="Click to view complaint">
							<CardActionArea className={styles.main} href={"/complaint/"+e.complaintId}>
								<div className={styles.all}>
									<Typography variant="subtitle2">Complaint id :- {e.complaintId}</Typography>
									<div className={styles.body}>
										<Typography variant="h5">{e.shortTitle}</Typography>
										<IconButton className={styles.menu} onClick={showMenu}>
											<Icon>more_vert</Icon>
										</IconButton>
									</div>
									<div className={styles.meta}>
										<Typography variant="subtitle2">{e.date}</Typography>
										<Typography variant="subtitle2" className={styles.status+" "+styles[e.status]}>{e.status}</Typography>
									</div>
								</div>
							</CardActionArea>
						</Card>
					))
				}
			</div>
			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}
				keepMounted
			>
				<MenuItem onClick={handleClose}>
					<ListItemIcon><Icon>edit</Icon></ListItemIcon>
					<ListItemText>Update</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon><Icon>restart_alt</Icon></ListItemIcon>
					<ListItemText>Repost</ListItemText>
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon><Icon>delete</Icon></ListItemIcon>
					<ListItemText>Delete</ListItemText>
				</MenuItem>
			</Menu>
		</>
	)
}