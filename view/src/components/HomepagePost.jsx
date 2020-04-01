import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { Link } from "react-router-dom";

class HomepagePost extends Component {

  postContentLength(){
     if (this.props.content.length>50){
         return this.props.content.substring(0,50) + "...";
     }
     return this.props.content;
  }

  render() {
    const { postId } = this.props;
    return (
      <div>
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
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={this.props.userImage}
                />
                <Link to={'/user/'+this.props.userId+'/'}>
                    <p>{this.props.username}</p>
                </Link>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic example"
                >
                  <button style={{ width: "50px" }}>🍽{this.props.upvotes}</button>

                  <button style={{ width: "50px" }}>🤮{this.props.downvotes}</button>
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "150px"
                }}
              >
                <h1>{this.props.subject}</h1>
                {this.props.establishmentName}
                <br/>
                <div style={{ height: "200px", width: '500px'}}>
                <img
                  src={this.props.photo}
                  style={{ height: "200px" }}
                />
                </div>
                <StarRatingComponent
                  name="rate1"
                  editing={false}
                  starCount={10}
                  value={this.props.rating}
                />
                <p>{this.postContentLength()}</p>
                 <Link to ={"/post/" + postId + "/"}>
                <button
                  className="btn btn-secondary"
                  style={{
                    position: "absolute",
                    right: "20px"
                  }}
                >
                  View Comments ({this.props.comments})
                </button>
                 </Link>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default HomepagePost;
