import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { Link } from "react-router-dom";

class Comment extends Component {

    showRepliesButtonIfChildren() {
        if (this.props.children > 0){
            return (<a href='#'>Show replies</a>);
        }
    }

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
                src={this.props.userImage}
              />
              <p>{this.props.username}</p>
            </div>
            <div
              style={{
                paddingLeft: "150px"
              }}
            >
              <p>{this.props.content}

                {this.showRepliesButtonIfChildren()}

              </p>

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
