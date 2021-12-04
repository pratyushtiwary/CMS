import Page from "./Page";
import { Typography, useMediaQuery } from "@material-ui/core";

export default function OfflineError(props){
    const maxWidth = useMediaQuery("(max-width: 612px)")

    return (
        <Page
            open={true}
            dismissable={false}
            style={{
                position: "unset",
                left: "auto",
                transform: "none"
            }}
        >
            <div style={{
                width: "100%",
                height: "100%"
            }}
            >
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        top: "50%",
                        transform: "translate(-50%,-50%)",
                        width: "97.5%"
                    }}
                >
                    <center>
                        {
                            !maxWidth && (
                                <Typography variant="h2">User Offline</Typography>
                            )
                        }
                        {
                            maxWidth && (
                                <Typography variant="h4">User Offline</Typography>
                            )
                        }
                        <br/>
                        <Typography variant="subtitle1">Please make sure you are not offline, reload the page to continue.</Typography>
                    </center>
                </div>
            </div>
        </Page>
    )
}