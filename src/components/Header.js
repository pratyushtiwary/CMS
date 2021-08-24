import React, { useState } from "react";
import { useScrollTrigger, Slide, AppBar, Toolbar, Typography, Button, IconButton, Icon, SwipeableDrawer, List, ListItemIcon, ListItemText } from '@material-ui/core';
import styles from "../styles/components/Header.module.css";

export default function Header(props){
	const { window } = props;
	const [drawer,setDrawer] = useState(false);
	const trigger = useScrollTrigger({ target: window ? window() : undefined });
	const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

	function toggleDrawer(event){
	    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
	      return;
	    }

	    setDrawer((d)=>!d);
	  };

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
									<Button key={i} button href={props.links[i]} className={styles.item}>
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
		          		!props.hideNewComplaint && (
			          		<Button color="inherit" variant="outlined" className={styles.nC} href="new_complaint">+ New Complaint</Button>
			        	)
			        }
		        </Toolbar>
		      </AppBar>
		    </Slide>
	    </div>
    </>
	)
}