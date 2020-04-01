import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import { Link } from "react-router-dom";
import CSRFToken from "./CSRFToken.jsx";

class HomepagePost extends Component {

  state = {
     upVote: 0,
     downVote: 0,
  };

  postContentLength(){
     if (this.props.content.length>50){
         return this.props.content.substring(0,50) + "...";
     }
     return this.props.content;
  }

  postUpvote = (event) =>
  {
      event.preventDefault();
      const values = {
          postId: this.props.postId,
          userId: this.props.currentUser.userId,
          vote: 1
      };
      fetch(this.props.request + '/posts/vote/', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
        .then(data => {
            if (data.success!=='success'){
                alert(data.error);
            }
            else{
                this.setState({upVote:1, downVote:0});
            }
        })
        .catch(err => {
            console.error(err);
        });
  };

  postDownvote = (event) =>
  {
      event.preventDefault();
      const values = {
          postId: this.props.postId,
          userId: this.props.currentUser.userId,
          vote: -1
      };
      fetch(this.props.request + '/posts/vote/', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
        .then(data => {
            if (data.success!=='success'){
                alert(data.error);
            }
            else{
                this.setState({downVote:1, upVote:0});
            }
        })
        .catch(err => {
            console.error(err);
        });
  };

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
                    <form onSubmit={this.postUpvote}>
                        <CSRFToken/>
                        <button type="submit" style={{ width: "50px" }} disabled={this.state.upVote === 1}>🍽{this.props.upvotes + this.state.upVote}</button>
                    </form>

                    <form onSubmit={this.postDownvote}>
                        <CSRFToken/>
                        <button type="submit" style={{ width: "50px" }} disabled={this.state.downVote === 1}>🤮{this.props.downvotes + this.state.downVote}</button>
                    </form>
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
