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
          <div className="row">
            <div className="col-sm">
              <div
                style={{
                  position: "absolute",
                  paddingTop: "10px",
                  paddingLeft: "20px"
                }}
              >
                <form>
                  <input
                    type="text"
                    required
                    style={{ width: "700px" }}
                    placeholder="Title"
                  />
                  <br></br>
                  <input
                    type="text"
                    required
                    style={{ width: "300px" }}
                    placeholder="Establishment"
                  />
                  <StarRatingComponent
                    name="rating"
                    starCount={10}
                    value={this.rating}
                    onStarClick={this.onStarClick.bind(this)}
                  />
                  <br></br>
                  <textarea
                    type="text"
                    required
                    style={{ width: "700px", height: "200px" }}
                    placeholder="Write your review..."
                  />
                  <br></br>
                  <input
                    type="file"
                    name="fileToUpload"
                    id="fileToUpload"
                  ></input>
                  <button
                    type="submit"
                    style={{
                      position: "absolute",
                      right: "10px"
                    }}
                    className="btn btn-primary"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreatePost;
