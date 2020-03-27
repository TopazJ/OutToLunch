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
                <h1>{this.props.name}</h1>
                <div style={{ paddingBottom: "20px" }}>
                    <Link to={'/establishments/'+this.props.id+'/'}>
                  <button
                    className="btn btn-secondary"
                    style={{
                      position: "absolute",
                      right: "20px"
                    }}
                  >
                    Read reviews
                  </button>
                    </Link>
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
