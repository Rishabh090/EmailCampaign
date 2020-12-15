import React,{ useState } from 'react';
import axios from 'axios'; 
import {Link} from 'react-router-dom';
// import './Navbar.css';
import { IconContext } from 'react-icons';
import { Redirect } from 'react-router'




class drafts extends React.Component {
	state = { 
  	  emails : [],
  	  redirect : false,
  	  id : ''
    }; 
	componentDidMount() {
		axios
		    .get("/api/getdrafts")
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
	getValueFromLi(param){
		this.setState({ id: param });
		this.setState({ redirect: true });//"<li data-value="5fd6637c29049d610060eeb1"><h1>monday first</h1><p>First </p></li>"

	}
	setEmails = () => {
			return(
				<div>
					<ul>
						{this.state.emails.map((item,index) =>{
							return(
								<li key={index} data-value={item.id}>
										<h1>{item.subject}</h1>
										<p>{item.emailbody}</p>
										<button onClick={() => this.getValueFromLi(item.id)}>edit</button>
								</li>
							)
						})}
					</ul>
	        	</div>
        	);
	}

	render() {
		const { redirect,id } = this.state;

	     if (redirect) {
	       return <Redirect to={{ pathname: '/Create', state: { 'id' : id } }} />;
	     }
	    return (
	      <div>
	          {this.setEmails()}    
	 	  </div>
	    );
  	}
  }

export default drafts