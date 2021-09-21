import React, { useState } from "react";
import { useScrollTrigger, Slide, AppBar, useMediaQuery, Toolbar, Typography, Button, IconButton, Icon, SwipeableDrawer, List, ListItemIcon, ListItemText } from '@material-ui/core';
import styles from "../styles/components/Header.module.css";
import Session from "./Session";

export default function Header(props){
	const { window } = props;
	const maxWidth = useMediaQuery("(max-width: 700px)")
	const [drawer,setDrawer] = useState(false);
	const trigger = useScrollTrigger({ target: window ? window() : undefined });
	const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

	function toggleDrawer(event){
		if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
		  return;
		}

		setDrawer((d)=>!d);
	};

	function logout(){
		Session.clear("_id");
	}


	return (
	<>
		{
			props.items && props.items.length && (
				<SwipeableDrawer
					open={drawer}
					onClose={toggleDrawer}
					onOpen={toggleDrawer}
					disableBackdropTransition={!iOS} 
					disableDiscovery={iOS}
				>
					<List className={styles.drawer} component="nav">
						{
							props.items.map((e,i)=>{
								return (
									<Button key={i} href={props.links[i]} className={styles.item}>
										{
											props.icons && props.icons[i] && (
												<ListItemIcon className={styles.itemIcon}><Icon>{props.icons[i]}</Icon></ListItemIcon>
											)
										}

										<ListItemText>{e}</ListItemText>
									</Button>
								)
							})
						}
						<Button onClick={logout} href="/login" className={styles.item}>
							<ListItemIcon className={styles.itemIcon}><Icon>logout</Icon></ListItemIcon>
							<ListItemText>Logout</ListItemText>
						</Button>
					</List>
				</SwipeableDrawer>
			)
		}

		<div className={styles.headerCont}>
			<Slide appear={false} direction="down" in={!trigger}>
		      <AppBar position="fixed" className={styles.header}>
		        <Toolbar>
		          {
		          	props.items && props.items.length && (
		          		<IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
							<Icon>menu</Icon>
						</IconButton>
					)
		  	      }
		          <Typography variant="h6" className={styles.title}>
		            {props.title}
		          </Typography>
		        	{
		          		!props.hideNewComplaint && !maxWidth && (
			          		<Button color="inherit" variant="outlined" className={styles.nC} href="/new_complaint">+ New Complaint</Button>
			        	)
			        }
			        {
		          		!props.hideNewComplaint && maxWidth && (
			          		<Button color="inherit" variant="outlined" className={styles.nC+" "+styles.add} href="/new_complaint">+</Button>
			        	)
			        }
		        </Toolbar>
		      </AppBar>
		    </Slide>
	    </div>
    </>
	)
}