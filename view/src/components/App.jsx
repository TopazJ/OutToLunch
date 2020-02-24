import React, { Component } from "react";
import {Switch, Route, BrowserRouter} from "react-router-dom";
import LoginForm from "./LoginForm.jsx"
import "./App.css"
import NavBar from "./navigation/NavBar.jsx";
import CreateAccount from "./CreateAccount.jsx";
import Logout from "./Logout.jsx"
import Home from './Home.jsx'

class App extends Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.setLogout = this.setLogout.bind(this);
        this.initButtons = this.initButtons.bind(this);
    }


    state = {
        homeLinks:[
            {id:'about',text:'About'},
            {id:'contact', text:'Contact'},
            {id:'nowhere', text:'Nich, please change this navbar.'}
        ],
        navLinks:[
            {id:'login', text:'Login', component:LoginForm, props:{login:this.login}},
            {id:'create-account', text:'Create Account', component:CreateAccount},
        ],
        user:{
            status:'anon'
        }
    };

    initButtons() {
        fetch('http://127.0.0.1:8000/auth/status/', {
            method: 'GET',
        }).then(res => res.json())
            .then(data => {
                if (data.status==='user'){
                    this.login();
                }
                else{
                    this.setLogout();
                }
            })
            .catch(err => console.error("Error:", err));
    };

    login() {
        this.setState({
            navLinks: [{id: "logout", text: "Logout", component: Logout, props: {logout: this.logout}}]
        });
    }


    logout(){
        fetch("http://127.0.0.1:8000/auth/logout/", {
            method:"GET"
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    this.setLogout();
                }
            });
    }

    setLogout(){
        this.setState({navLinks:[{id:'login', text:'Login', component:LoginForm, props:{login:this.login}},
                {id:'create-account', text:'Create Account', component:CreateAccount}],user: {status: "anon"}});
    }


    render() {
        return (
            <BrowserRouter>
                <React.Fragment>
                    <NavBar
                        initButtons={this.initButtons}
                        navLinks={this.state.homeLinks}
                        buttonLinks={this.state.navLinks}/>
                    <Switch>
                        {this.state.navLinks.map(link => (
                            <Route
                                key={link.id}
                                path={"/" + link.id}
                                render={() => (
                                    <link.component props={link.props}/>
                                )}
                            />
                        ))}
                        <Route path='*'>
                            <Home/>
                        </Route>
                    </Switch>
                </React.Fragment>
            </BrowserRouter>
        );
    }
}

export default App;
