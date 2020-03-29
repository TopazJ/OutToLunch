import React, { Component } from "react";

class AccountSettings extends Component {
  state = { username: "nich", elo: 100 };
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
                  <h2>{this.state.username}</h2>
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={this.state.userImage}
                />
                <h3>Change profile picture:</h3>
                <input type="file" name="fileToUpload" id="fileToUpload" />
                <br />
                 <h2> 🍽 {this.state.elo}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSettings;
