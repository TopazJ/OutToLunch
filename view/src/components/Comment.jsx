import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { Link } from "react-router-dom";

class Comment extends Component {
  state = {};
  render() {
    return (
      <div style={{ background: "#fff0f1" }} className="border">
        <div
          style={{
            position: "absolute",
            paddingTop: "10px",
            paddingLeft: "20px"
          }}
        >
          <img
            style={{ width: "100px", height: "100px" }}
            src="https://www.sadanduseless.com/wp-content/uploads/2019/07/funny-dog-tongues1.jpg"
          />
          <p>Nich</p>
        </div>
        <div
          style={{
            paddingLeft: "150px"
          }}
        >
          <p>Why would you review the bookstore are you stupid?</p>

          <textarea
            required
            style={{ width: "450px", height: "50px" }}
            placeholder="Respond to this comment"
            className="form-control"
          />
          <div style={{ paddingBottom: "10px" }}>
            <button className="btn btn-secondary"> Post Comment </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
