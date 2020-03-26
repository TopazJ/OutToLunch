import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import Comment from "./Comment.jsx";

/*
some placeholder stuff
        ,
      { id: 3, userId: 0 },
      { id: 4, userId: 2 },
      { id: 5, userId: 0 },
      { id: 6, userId: 2 },
      { id: 7, userId: 0 },
      { id: 8, userId: 2 }

*/
class Post extends Component {
  state = {
    comments: [{ id: 1, userId: 0 }]
  };

  render() {
    return (
      <div>
        <div style={{ background: "aliceblue" }}>
          <div
            style={{
              position: "absolute",
              paddingTop: "10px",
              paddingLeft: "20px"
            }}
          >
            <img
              style={{ width: "100px", height: "100px" }}
              src="https://assets.change.org/photos/4/vh/lu/WuVhLusAlwWUVYe-800x450-noPad.jpg?1554879504"
            />

            <p>TheCoolerNich</p>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button style={{ width: "50px" }}>🍽{0}</button>

              <button style={{ width: "50px" }}>🤮{0}</button>
            </div>
          </div>

          <div
            style={{
              paddingLeft: "150px",
              paddingRight: "100px"
            }}
          >
            <h1>Hidden Gem</h1>
            {"Uofc Bookstore"}
            <br></br>
            <img
              src="https://www.ucalgary.ca/news/sites/default/files/styles/ucws_news_hero_image_desktop/public/2019-06/bookstore_011a0796_f.jpg?itok=aE9ylKnp"
              style={{ width: "500px", height: "200px" }}
            />
            <br />
            <StarRatingComponent
              name="rate1"
              editing={false}
              starCount={10}
              value={8}
            />
            <p>{"They do not sell food here."}</p>
            <br />
          </div>
        </div>
        <div style={{ background: "#fff7f0" }}>
          <h2 style={{ paddingLeft: "10px" }}>Comments:</h2>
          {this.state.comments.map(comments => (
            <div>
              <br />
              <Comment key={comments.id} userId={comments.userId} />
              <br />
            </div>
          ))}
          <div style={{ paddingLeft: "25px" }}>
            <textarea
              type="text"
              required
              style={{ width: "700px", height: "100px" }}
              placeholder="Write a comment..."
              class="form-control"
            />
            <div style={{ paddingBottom: "10px" }}>
              <button className="btn btn-primary"> Post Comment </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
