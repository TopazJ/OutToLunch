import React, { Component } from "react";
import { Link } from "react-router-dom";

class AccountSettings extends Component {

    //TODO Users can update their profile images.

    render() {
    return (
      <div className="background">
        <div className="container border post">
          <div className="row">
            <div className="col-sm">
              <div
                style={{
                  position: "absolute",
                  paddingTop: "10px",
                  paddingLeft: "20px"
                }}
              >
                <h2>Account Settings</h2>
                  <Link to={'/user/'+this.props.user.userId+'/'}>
                    <h2>{this.props.user.username}</h2>
                  </Link>
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={this.props.user.image}
                />
                <h3>Change profile picture:</h3>
                <input type="file" name="fileToUpload" id="fileToUpload" />
                <br />
                 <h2> 🍽 {this.props.user.userElo}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSettings;
