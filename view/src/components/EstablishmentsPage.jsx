import React, { Component } from "react";
import "./styles.css";
import Establishments from "./Establishments.jsx";

class EstablishmentsPage extends Component {
  state = {
    establishments: [
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
      { id: 7 },
      { id: 8 }
    ]
  };
  render() {
    return (
      <div className="background">
        <b style={{ paddingLeft: "350px" }}>All Establishments</b>
      {this.state.establishments.map(establishments => (
          <div>
            <br />
            <Establishments key={establishments.id} />
            <br />
          </div>
        ))}
      </div>
    );
  }
}

export default EstablishmentsPage;
