import logo from './logo.svg';
import './App.css';
import Navbar from "./components/Navbar"
import Home from './pages/Home'
import CreateEmail from './pages/CreateEmail'
import {BrowserRouter as Router,Switch,Route } from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
    	<Navbar />
    	<Switch>
    		<Route path='/' exact component={Home}/>
    		<Route path='/Create' exact component={CreateEmail}/>
		</Switch>
    </Router>
      
    </>
  );
}

export default App;
