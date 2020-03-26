import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";

class Establishments extends Component {
  render() {
    return (
      <div>
        <div
          className="container border"
          style={{
            background: "aliceblue",
            paddingTop: "10px",
            width: "800px"
          }}
        >
          <div className="row">
            <div className="col-sm">
              <div>
                <h1>Korean BBQ House</h1>
                <div style={{ paddingBottom: "20px" }}>
                  <button
                    className="btn btn-secondary"
                    style={{
                      position: "absolute",
                      right: "20px"
                    }}
                  >
                    Read reviews
                  </button>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Establishments;
