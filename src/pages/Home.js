import axios from 'axios'; 
import React,{ useState } from 'react';
import {Component} from 'react'; 
import { Redirect } from 'react-router';
import {Link} from 'react-router-dom';

class Home extends React.Component { 
   
    state = { 
  	  emails : [],
  	  emailBody : '',
  	  emailSub: '',
  	  redirect : false,
      // Initially, no file is selected 
      selectedFile: null,
      id : ''
    }; 
    componentDidMount() {
    	if(this.props.location.state !== undefined)
		if(this.props.location.state.id.localeCompare('')!==0 ){
			let data = []
			axios
		    .get("/api/getdraftdata",{params: { "id" : (this.props.location.state.id)}})
		    	.then(res  => this.setState({emailBody : res.data.emails[0].emailbody,emailSub : res.data.emails[0].subject}))
			    	.catch(err => console.warn(err));
		}
	};
	setData(emailData){
		this.setState({ emailBody : emailData['emailbody'] , emailSub : emailData['subject'] });
	}

     
    // On file select (from the pop up) 
    onFileChange = event => { 
     
      // Update the state 
      this.setState({ selectedFile: event.target.files[0] }); 
     
    }; 
    
     
    // On file upload (click the upload button) 
    onFileUpload = () => { 
     
      let file = this.state.selectedFile;
      let email = this.state.emailBody;
      let subject = this.state.emailSub;
	  const formData = new FormData();

	  formData.append("file", file);
	  formData.append('emailBody', email);
	  formData.append('emailSub', subject);
	  // return fetch("/api/upload",{headers : { 
   //      'Content-Type': 'application/json',
   //      'Accept': 'application/json'
   //     },
	  //  method: 'POST',body:formData}).then(response => {

	  //   return response.json()
	  // })
	   axios
	    .post("/api/upload", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(res => this.setState({ redirect: true }))
	    .catch(err => console.warn(err));
    	
    }; 
    handleChange = event => {
    	this.setState({ emailBody: event.target.value }); 
    };
    handleSubChange = event => {
    	this.setState({ emailSub: event.target.value }); 
    };
     
    // File content to be displayed after 
    // file upload is complete 
    onDarft = () => {
	  let file = this.state.selectedFile;
      let email = this.state.emailBody;
      let subject = this.state.emailSub;
	  const formData = new FormData();
	  if(file==null && email.localeCompare('')==0 && subject.localeCompare('')==0){
	  	return;
	  }
	  formData.append("file", file);
	  formData.append('emailBody', email);
	  formData.append('emailSub', subject);
	   axios
	    .post("/api/saveDraft", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    }).then(res => this.setState({ redirect: true }))
	    .catch(err => console.warn(err));
    };
    fileData = () => { 
     
      if (this.state.selectedFile) { 
          
        return ( 
          <div> 
            <h2>File Details:</h2> 
            <p>File Name: {this.state.selectedFile.name}</p> 
            <p>File Type: {this.state.selectedFile.type}</p> 
            <p> 
              Last Modified:{" "} 
              {this.state.selectedFile.lastModifiedDate.toDateString()} 
            </p> 
          </div> 
        ); 
      } else { 
        return ( 
          <div> 
            <br /> 
            <h4>Choose before Pressing the Upload button</h4> 
          </div> 
        ); 
      } 
    }; 
     
    render() { 
     const { redirect } = this.state;

     if (redirect) {
       return <Redirect to='/'/>;
     }
      return ( 
      <div>
      	<div>
	        <form>
	        <div>
	        <label>
	          Subject:
	          <input type="text" onChange={this.handleSubChange} value={this.state.emailSub}/>
	        </label>
	        </div>
	        <div>
	        <label>
	          Body:
	          <input type="text" onChange={this.handleChange} value={this.state.emailBody} style={{width: '400px',height: '400px'}}/>
	        </label>
	        </div>
	      </form>	     
 	    </div>
        <div>  
            <h3> 
             .csv files for recipients
            </h3> 
            <div> 
                <input type="file" onChange={this.onFileChange} /> 
            </div> 
            <div>
            <button onClick={this.onFileUpload}> 
                  Send
            </button> 
            <button onClick={this.onDarft}> 
                  Save
            </button> 
            </div>
        </div> 
       </div>
      ); 
    } 
  } 
export default Home