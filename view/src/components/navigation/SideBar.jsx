import React, { Component } from "react";
import {Link} from "react-router-dom";

class SideBar extends Component {
  render() {

    return (
        <div className="sidenav">
            <Link to ={"/Homepage"}>Reviews</Link>
            <Link to ={"/establishments"}>Establishments</Link>
            <a href="#">Account Settings</a>
        </div>
    );
  }

}

export default SideBar;
