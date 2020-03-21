import React, { Component } from "react";
import HomepagePost from "./HomepagePost.jsx";
import CreatePost from "./createPost.jsx";
import "./styles.css";
import { Link } from "react-router-dom";

class Homepage extends Component {
  state = {
    loggedIn: true,
    posts: [
      { id: 1, userId: 0 },
      { id: 2, userId: 2 },
      { id: 3, userId: 0 },
      { id: 4, userId: 2 },
      { id: 5, userId: 6 }
    ],
    page: "posts"
  };

  showThePostReviewButtonIfLoggedIn() {
    if (this.state.loggedIn === true) {
      return (
        <Link to ="/create-post">
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

  displayPage() {
    if (this.state.page === "posts") {
      return (
        <div className="background">
          <div class="sidenav">
            <a href="#">Reviews</a>
            <a href="#">Establishments</a>
            <a href="#">Account Settings</a>
          </div>

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

  render() {
    return (
      <div className="background">
        <div class="sidenav">
          <a href="#">Reviews</a>
          <a href="#">Establishments</a>
          <a href="#">Account Settings</a>
        </div>

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
