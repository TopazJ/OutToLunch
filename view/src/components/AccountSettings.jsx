import React, { Component } from "react";

class AccountSettings extends Component {

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
                  <h2>{this.props.user.username}</h2>
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
