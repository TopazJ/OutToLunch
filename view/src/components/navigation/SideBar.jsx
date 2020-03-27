import React, { Component } from "react";
import {Link} from "react-router-dom";

class SideBar extends Component {
      showTheAccountSettingsIfLoggedIn() {
    if (this.props.loggedIn === true) {
      //just put true there for testing (remove this.props.loggedIn).
      return (
         <Link to ={"/account-settings"}>Account Settings</Link>
      );
    }
  }
  render() {

    return (
        <div className="sidenav">
            <Link to ={"/"}>Reviews</Link>
            <Link to ={"/establishments"}>Establishments</Link>
            {this.showTheAccountSettingsIfLoggedIn()}
        </div>
    );
  }

}

export default SideBar;
