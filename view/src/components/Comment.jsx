import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { Link } from "react-router-dom";

class Comment extends Component {

    // TODO Shamez -> Figure out how to do inner comment lazy loading. Show replies does not currently work.

    showRepliesButtonIfChildren() {
        if (this.props.children > 0){
            return (<a href='#'>{"See replies (" + this.props.children + ")"}</a>);
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
             <Link to={'/user/'+this.props.userId+'/'}>
                    <p>{this.props.username}</p>
             </Link>
            </div>
            <div
              style={{
                paddingLeft: "150px"
              }}
            >
              <p>{this.props.content}
                <br/>

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

                {this.showRepliesButtonIfChildren()}
            </div>
          </div>
        );
      }
}

export default Comment;
