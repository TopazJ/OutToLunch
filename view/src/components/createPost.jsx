import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";

class CreatePost extends Component {
  state = {};
  constructor() {
    super();

    this.state = {
      rating: 1
    };
  }
  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  render() {
    return (
      <div>
        <div className="container border post">
          <form>
            <input
              type="text"
              required
              style={{ width: "500px" }}
              placeholder="Title"
            />
            <br></br>
            <input
              type="text"
              required
              style={{ width: "500px", height: "100px" }}
              placeholder="Write your review..."
            />
            <br></br>
            <StarRatingComponent
              name="rating"
              starCount={10}
              value={this.rating}
              onStarClick={this.onStarClick.bind(this)}
            />

            <button>Post</button>
          </form>
        </div>
      </div>
    );
  }
}

export default CreatePost;
