import React, { Component } from "react";
import {Switch, Route, Redirect, withRouter} from "react-router-dom";
import LoginForm from "./LoginForm.jsx"
import "./App.css"
import "./styles.css"
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import NavBar from "./navigation/NavBar.jsx";
import CreateAccount from "./CreateAccount.jsx";
import Logout from "./Logout.jsx"
import Homepage from "./Homepage.jsx";
import User from "./User.jsx"
import CreatePost from "./createPost.jsx";
import SideBar from "./navigation/SideBar.jsx";
import EstablishmentsPage from "./EstablishmentsPage.jsx";

class App extends Component {

    constructor(props) {
        super(props);
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.setLogout = this.setLogout.bind(this);
        this.initButtons = this.initButtons.bind(this);
    }

    state = {
        url:this.props.url,
        navLinks:[
            {id:'login/', text:'Login', component:LoginForm, props:{login:this.login, url:this.props.url}},
            {id:'create-account/', text:'Create Account', component:CreateAccount, props:{url:this.props.url}},
        ],
        location:this.props.location.pathname,
        loggedIn:false, //You can make this true by default for testing everything with the user as logged in.
        userId:0,
        userElo:0
    };

    initButtons() {
        let url = this.state.url + '/auth/status/';
        fetch(url, {
            method: 'GET',
        }).then(res => res.json())
            .then(data => {
                if (data.status==='user'){
                    this.login(data.elo, data.userid);
                }
                else{
                    this.setLogout();
                }
            })
            .catch(err => console.error("Error:", err));
    };

    login(elo, userid) {
        this.setState({
            navLinks: [{id: "logout", text: "Logout", component: Logout, props: {logout: this.logout, url:this.state.url}}],
            userElo: elo,
            userId: userid,
            loggedIn:true
        });
    }


    logout(){
        let url = this.state.url + '/auth/logout/';
        fetch(url, {
            method:"GET"
        }).then(res => res.json())
            .then(data => {
                if (data.status === 'success') {
                    this.setLogout();
                }
            });
    }

    setLogout(){
        this.setState({
            navLinks:[
                {id:'login/', text:'Login', component:LoginForm, props:{login:this.login, url:this.props.url}},
                {id:'create-account/', text:'Create Account', component:CreateAccount, props:{url:this.props.url}}
                ],
            loggedIn:false
        });
    }

    createRouteForCreateEstablishment() {
        if (this.state.userElo>=1000) {
            return (
                <Route path="/create-establishment/">
                    <div className="homepage">
                        <CreatePost userId={this.state.userId}/>
                    </div>
                </Route>);
        }
    }

    createRouteForCreatePost() {
        if (this.state.loggedIn) {
            return (
                 <Route path="/create-post/">
                        <div className="homepage">
                            <CreatePost userId={this.state.userId}/>
                        </div>
                 </Route>);
        }
    }

    render() {
        return (
            <React.Fragment>
                    <NavBar
                        initButtons={this.initButtons}
                        buttonLinks={this.state.navLinks}/>
                    <div className='homepage'>
                        <SideBar loggedIn={this.state.loggedIn}/> {/*TODO Sidebar needs to receive the options it lists as props as these will change with the user's status.*/}
                    </div>
                    <Switch>
                        {this.state.navLinks.map(link => (
                            <Route
                                key={link.id}
                                exact path={"/" + link.id}
                                render={() => (
                                    <React.Fragment>
                                        <div className="homepage">
                                            <link.component props={link.props}/>
                                        </div>
                                    </React.Fragment>
                                )}
                            />
                        ))}
                        {this.createRouteForCreatePost()}
                        {this.createRouteForCreateEstablishment()}
                        <Route path="/establishments/">
                            <div className="homepage">
                                <EstablishmentsPage
                                    request = {this.state.url}
                                    loggedIn={this.state.loggedIn}
                                    userElo={this.state.userElo}
                                />
                            </div>
                        </Route>
                        <Route path="/user/:id/">
                            <div className="homepage">
                                <User request = {this.state.url}
                                          url={this.props.location.pathname}
                                          loggedIn={this.state.loggedIn}
                                          header={'Posts By '}
                                />
                            </div>
                        </Route>
                        <Route path="/">
                            <div className="homepage">
                                <Homepage request = {this.state.url}
                                          url={'/'}
                                          loggedIn={this.state.loggedIn}
                                          header = {'Most Recent Reviews'}
                                />
                            </div>
                        </Route>
                        <Route>
                            <Redirect push to="/"/>
                        </Route>
                    </Switch>
            </React.Fragment>

        );
    }
}

export default withRouter(App);
