import React, { Component } from "react";
import HomepagePost from "./HomepagePost.jsx";
import Post from "./Post.jsx";
import "./styles.css";
import { Link, Switch, Route, withRouter } from "react-router-dom";
import { ModalRoute } from "react-router-modal";

import Establishments from "./Establishments.jsx";

class Homepage extends Component {
  state = {
    posts: [
      { id: 1, userId: 0 },
      { id: 2, userId: 2 },
      { id: 3, userId: 0 },
      { id: 4, userId: 2 },
      { id: 5, userId: 6 }
    ]
  };



  showThePostReviewButtonIfLoggedIn() {
    if (this.props.loggedIn === true) {
      return (
        <Link to="/create-post">
          <button
            className="btn btn-secondary"
            style={{ position: "absolute", right: "10px" }}
          >
            Post New Review
          </button>
        </Link>
      );
    }
  }

  render() {
    return (
      <div className="background">
        <b style={{ paddingLeft: "350px" }}>Most Recent Reviews</b>
        {this.showThePostReviewButtonIfLoggedIn()}
        <br />
        <Switch>
          <Route path="/post/:id">
            <Post back = {this.props.location.pathname}/>
          </Route>
          <Route>
            {this.state.posts.map((post, index) => (
              <HomepagePost
                key={index}
                postId={post.id}
                userId={post.userId}
                date = {post.date}
                content = {post.content}
                photo = {post.photoURL}
                rating = {post.rating}
                subject = {post.subject}
                upvotes = {post.upvotes}
                downvotes = {post.downvotes}
                comments = {post.comments}
              />
            ))}
          </Route>
        </Switch>
      </div>
    );
  }
}

export default withRouter(Homepage);
