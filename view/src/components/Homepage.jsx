import React, { Component } from "react";
import HomepagePost from "./HomepagePost.jsx";
import CreatePost from "./createPost.jsx";
import "./styles.css";

class Homepage extends Component {
  state = {
    loggedIn: false,
    posts: [
      { id: 1, userId: 0 },
      { id: 2, userId: 2 },
      { id: 3, userId: 0 },
      { id: 4, userId: 2 },
      { id: 5, userId: 6 }
    ]
  };

  showThePostReviewButtonIfLoggedIn() {
    if (this.state.loggedIn === true) {
      return (
        <button
          className="btn btn-secondary"
          style={{ position: "absolute", right: "10px" }}
        >
          Post New Review
        </button>
      );
    }
  }
  render() {
    return (
      <div className="background">
        <br />
        <b style={{ paddingLeft: "350px" }}>Most Recent Reviews</b>
        {this.showThePostReviewButtonIfLoggedIn()}
        <br />
        {this.state.posts.map(post => (
          <HomepagePost key={post.id} userId={post.userId} />
        ))}
        <CreatePost></CreatePost>
      </div>
    );
  }
}

export default Homepage;
