import React, { Component } from "react";
import HomepagePost from "./HomepagePost.jsx";
import Post from "./Post.jsx"
import "./styles.css";
import { Link, Switch, Route, withRouter } from "react-router-dom";
import {ModalRoute} from "react-router-modal";


class Homepage extends Component {
  state = {
    posts: [
      { id: 1, userId: 0 },
      { id: 2, userId: 2 },
      { id: 3, userId: 0 },
      { id: 4, userId: 2 },
      { id: 5, userId: 6 }
    ],
    location: this.props.location.pathname.includes("/post/") ? '/' : this.props.location.pathname
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
        if ((!this.props.location.pathname.includes("/post/")) && this.props.location.hostname !== prevProps.location.hostname){
          this.setState({location:this.props.location.pathname});
        }
  }

  showThePostReviewButtonIfLoggedIn() {
      if (this.props.loggedIn === true) { //just put true there for testing (remove this.props.loggedIn).
      return (
          <Link to ="/create-post">
              <button className="btn btn-secondary"
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
                  <Route path='/test'>
                      <Post/>
                  </Route>
                  <div>
                  <ModalRoute path="/post/:id" parentPath={this.state.location}>
                      <Post/>
                  </ModalRoute>
                  <Route>
                      {this.state.posts.map((post, index) => (<HomepagePost key={index} postId={post.id} userId={post.userId} />))}
                  </Route>
                  </div>
              </Switch>
          </div>
    );
  }
}

export default withRouter(Homepage);
