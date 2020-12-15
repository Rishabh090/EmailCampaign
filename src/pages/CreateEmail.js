import React,{ useState } from 'react';
import axios from 'axios'; 
import {Link} from 'react-router-dom';
// import './Navbar.css';
import { IconContext } from 'react-icons'

// function CreateEmail() {
// 	const [emailBody , setEmailBody] = useState("");

// 	function changeEmailBody(event){
// 		setEmailBody(event.target.value);
// 	}
// 	function handleSubmit(event){
// 		const data = {emailBody : "Testing with none"};
// 		console.log('submit');
//     	console.log(emailBody);
// 		fetch("/result", {
// 	        method:"POST",
// 	        cache: "no-cache",
// 	        headers:{
// 	            "content_type":"application/json",
// 	        },
// 	        body:JSON.stringify(this.emailBody)
//         }
// 	    ).then(response => {

// 	    return response.json()
// 	  })
// 	  .then(json => {
// 		setEmailBody({emailBody: json[0]})
// 	  })
// 	}
	
// 		return(
// 			<>
// 				<div>
// 			        <form onSubmit={handleSubmit} action="http://localhost:5000/result" method="POST">
// 			        <label>
// 			          Player ID:
// 			          <input type="text" name="emailBody"/>
// 			          <input type="submit" onChange={changeEmailBody} />
// 			        </label>
// 			        </form>
// 		        	<h1> Player Name: {changeEmailBody} </h1>
// 		        </div>
// 			</>
// 		);
// }


class CreateEmail extends React.Component {
	state = { 
  	  emails : []
    }; 
	componentDidMount() {
		axios
		    .get("/api/getemails")
		    	.then(res => this.setState({ emails : res.data['emails'] })).then(this.setEmails())
			    	.catch(err => console.warn(err));
	}
	componentDidUpdate(prevProps, prevState) {
		// only update if not match I don't know what's your data is so add a 
		// simple check like we use for strings.
		  if (prevState.data !== this.state.data) {
		    axios
		    .get("/api/getemails")
		    	.then(res => this.setState({ emails : res.data['emails'] })).then(this.setEmails())
			    	.catch(err => console.warn(err));
		  }
	}
	// componentDidUpdate() {
	// 	axios
	// 	    .get("/api/getemails")
	// 	    	.then(res => this.setState({ emails : res.data['emails'] })).then(this.setEmails())
	// 		    	.catch(err => console.warn(err));
	// }
	getValueFromLi  = event => {
		let data = event.target;
	}
	setEmails = () => {
			return(
				<div>
					<ul>
						{this.state.emails.map((item,index) =>{
							return(
								<li onClick={this.getValueFromLi} data-value={item.id}>
										<h1>{item.subject}</h1>
										<p>{item.emailbody}</p>
								</li>
							)
						})}
					</ul>
	        	</div>
        	);
	}

	render() {
	    return (
	      <div>
	          {this.setEmails()}    
	 	  </div>
	    );
  	}
  }

export default CreateEmail