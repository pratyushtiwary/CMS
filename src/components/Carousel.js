import { Carousel as C } from 'react-responsive-carousel';
import Lightbox from 'react-image-lightbox';
import { useState } from "react";
import { Button } from "@material-ui/core";
import styles from "../styles/components/Carousel.module.css";
import { URL } from "../globals";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import 'react-image-lightbox/style.css';


export default function Carousel(props) {
	const [photoIndex,setPhotoIndex] = useState(0);
	const [open,setOpen] = useState(false);

	let showLightbox = (i) => () => {
		setPhotoIndex(i);
		setOpen(true);
	}

	return (
		<>
			{
				props.imgs && (
					<C
						swipeable={true}
						useKeyboardArrows
						showStatus = {false}
						showArrows
						showThumbs = {false}
					>
						{
							props.imgs.map((e,i)=>(
								<Button key={i} className={styles.imgCont} onClick={showLightbox(i)}>
									<img
										src={URL+"images/"+e}
										alt={"Image "+(i+1)}
										height = "300px"
										className={styles.img}
									/>
								</Button>
							))
						}
					</C>
				)
			}
			{
				props.imgs && open && (
					<Lightbox
			            mainSrc={URL+"images/"+props.imgs[photoIndex]}
			            nextSrc={URL+"images/"+props.imgs[(photoIndex + 1) % props.imgs.length]}
			            prevSrc={URL+"images/"+props.imgs[(photoIndex + props.imgs.length - 1) % props.imgs.length]}
			            onCloseRequest={() => setOpen(false)}
			            onMovePrevRequest={() =>
							setPhotoIndex((pI)=>((pI + props.imgs.length - 1) % props.imgs.length) % 4)
			            }
			            onMoveNextRequest={() =>
			            	setPhotoIndex((pI)=>((pI + 1) % props.imgs.length) % 4)
			            }
			          />
				)
			}
		</>
	)
}