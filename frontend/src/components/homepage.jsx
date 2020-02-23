import React, { Component } from "react";
import Navbar from "./navbar";
import HomepagePost from "./homepagePost";
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
  render() {
    return (
      <div class="background">
        <Navbar />
        <br />
        <br />
        <br />
        <b style={{ paddingLeft: "500px" }}>Most Recent Reviews</b>

        <button
          class="btn btn-secondary"
          style={{ position: "absolute", right: "10px" }}
        >
          Post New Review
        </button>
        {this.state.posts.map(posts => (
          <div>
            <br></br>
            <HomepagePost key={posts.id} userId={posts.userId} />
          </div>
        ))}
      </div>
    );
  }
}

export default Homepage;
