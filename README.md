# CMS
To run it locally on your PC, pull the repo and run the following commands on terminal/command prompt

`npm install`

`npm start`

If you get any errors, try deleting the `.lock` file

## Folder Structure

- public
- src
	- admin
	- assets
	- components
	- styles
	- user
	- vendor

`public` :- This folder contains all the public assets, things like favicon, index.html and all

`src` :- This folder contains all the logic and views for this project

## Components

### Alert
A simple alert popup

#### Usage
```jsx
import Alert from "../components/Alert";
export default function myComponent(props){
	return (
		<Alert
			title = "Your Alert Title"
			msg = "Message to show"
			open = {a_state_for_toggling_the_alert}
			onClose = {handler_when_alert_is_closed}
		/>
	)
}
```
### Dialog
`Dialog` displays a popup message to the user, unlike `Alert` you can add buttons and actions to a `Dialog`.

#### Usage
```jsx
import Dialog from "../components/Dialog"

export default function myComponent(props){
	return (
		<Dialog
			msg = "Like content but styled differently"
			open = {state_to_toggle_dialog_open}
			fullScreen = true|false
			maxWidth = "defaults to sm"
			buttons = {
				[
					{
						"title": "myButton1",
						"onClick": someEvent1
					},
					{
						"title": "myButton2",
						"onClick": someEvent2
					}
				]
			}
		>
			Content of the dialog
		<Dialog>
	)
}
```
For maxWidth take a look at [here](https://mui.com/components/dialogs/#optional-sizes)

### Header
This component is the most-used component in this project. As the name suggests this component provides header to pages.

#### Usage
```jsx
import Header from "../components/Header";
export default function myComponent(props){
	<Header
		title = "Page title"
		items = {["Item1","this is optional"]}
		links = {["link for item1","this is also optional"]}
		icons = {["icon for item1","this also is optional"]}
		hideNewComplaint
	/>
}

```
`hideNewComplaint` is optional

For icons visit [Icons - Google Fonts](https://fonts.google.com/icons)

### hit
This component provides ability to send a request to backend.
It uses [`Axios`](https://www.npmjs.com/package/axios)

#### Usage
```jsx
import hit from "../components/hit";
import {useEffect} from "react";

export default function myComponent(props){
	...
	useEffect(()=>{
		hit("url",{...params})
		.then(c=>{
			// c will have the result sent from the 
			// backend.
		})
	},[]);
	...
}

```

### Loading
This is an extension of the `Dialog` component, it shows a `Dialog` with `CircularLoader` and some text.

#### Usage
```jsx
import Loading from "../components/Loading";

export default function myComponent(props){
	return (
		<Loading
			open = {state_to_toggle_loading}
			msg = "Optional message to show, defaults to Loading..."
		/>
	)
}
```

### Message
2 Components comes under this, `Error` and `Success`
This acts as an alert to show to the user.

```jsx
import { Error, Success } from "../components/Message"
export default function myComponent(props){
	return (
		<>
			<Error 
				open={state_to_toggle_error}
				message="Error Message"
			/>
			<Success
				open={state_to_toggle_success}
				message="Success Message"
			/>
		</>
	)
}
```

### Page
This used the `Dialog` component along with `fullScreen` prop.

#### Usage
```jsx
import Page from "../components/Page";
export default function myComponent(props){
	return (
		<Page
			open={state_to_toggle_page_visibility}
			onClose={event_to_handle_close_event}
			title="Title for the Page"
		>
			some content for the page,
			you can use other components here
		</Page>
	)
}
```

### PasswordField
Used in `Login`, `Register` and pages which requires user to enter a password.

#### Usage
```jsx
import PasswordField from "../components/PasswordField"
import { useState } from "react"
export default function myComponent(props){
	const [myPassword,setMyPassword] = useState("");
	function changeMyPassword(e){
		setMyPassword(e.currentTarget.value)
	}

	return (
		<PasswordField
			label="Label for the password field"
			id="custom id for the password field [optional]"
			required
			value={myPassword}
			onChange={changeMyPassword}
		/>
	)
}

```

### ResendOtp
Used in `Login`,`Register` and `Forget Password` page,
just a simple `Button` with a timer on it that enables and disables it.

#### Usage
```jsx
import ResendOtp from "../components/ResendOtp"
export default function myComponent(props){
	function doSomething(){
		//some code
	}

	return (
		<ResendOtp onClick={doSomething}/>
	)

}
```

### Session
One of the most important component, without this user will not be able to login and nothing will work.

#### Usage
```jsx
import Session from "../components/Session"
import { Button } from "@material-ui/core"
// to fetch login token, to communicate with backend
const token = Session.login().token;

export default function myComponent(props){
    function saveOrGetSomeVal(){
		let val = "";
		val = Session.get("someKey");
		if(val){
			// previous value is retrieved
		}
		else{
			// no previous value found
			// using `set` to save new value with unique key
			// to update the value just again save some other value, overwriting the previous one.
			Session.set("someKey","someVal")
		}
	}

	return (
		<Button onClick={saveOrGetSomeVal}>Save or Get someval</Button>
	)

}

```

You can also use
`Session.clear(key)` to clear the stored value for some key,

`Session.setSafe(key,val)` same as `Session.set` but encrypts the data before saving,

`Session.getSafe(key)` same as `Session.get` buy decrypts the encrypted data before getting it.

### Uploader
Component which allows `Employees` to upload image(s)

**It only accepts image files**

#### Usage
```jsx
import Uploader from "../components/Uploader"
import { useState } from "react"

export default function myComponent(props){
	const [files,setFiles] = useState([]);
	
	function updateFiles(f){
		setFiles([...f]);
	}

	return (
		<Uploader
			defaultImgs={['some_img_path',"another_img_path"]}
			onFile={updateFiles}
		/>
	)
}

```
### Carousel
Used when displaying images to `Employees`,`Vendors` and `Admin` on the `Complaint` page

#### Usage
```jsx
import Carousel from "../components/Carousel"
export default function myComponent(props){
	const imgs = ["some_img_path","another_img_path"];
	return (
		<Carousel
			imgs={imgs}
		/>
	)
}
```