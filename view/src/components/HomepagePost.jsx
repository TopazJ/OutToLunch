import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import {Link, useParams} from "react-router-dom";

class HomepagePost extends Component {
    //I don't need this
  state = {postId: 0, postSubject: '', establishmentId: '', photoLocation: '',
  postUser: 0, date: '', userImg: '', postRating: 0,
      likes: 0, dislikes: 0, postContent: '', commentsNum: 0, comments:[]
  };

  renderHeaders=()=>{
        console.log(this.props);
    };

  render() {
    const { userId, key } = this.props;
    console.log(userId);
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
                  src="https://assets.change.org/photos/4/vh/lu/WuVhLusAlwWUVYe-800x450-noPad.jpg?1554879504"
                />
                <p>TheCoolerNich</p>
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic example"
                >
                  <button style={{ width: "50px" }}>🍽{0}</button>

                  <button style={{ width: "50px" }}>🤮{0}</button>
                </div>
              </div>
              <div
                style={{
                  paddingLeft: "150px"
                }}
              >
                <h1>Hidden Gem</h1>
                {"Uofc Bookstore"}
                <br></br>
                <img
                  src="https://www.ucalgary.ca/news/sites/default/files/styles/ucws_news_hero_image_desktop/public/2019-06/bookstore_011a0796_f.jpg?itok=aE9ylKnp"
                  style={{ width: "500px", height: "200px" }}
                />
                <StarRatingComponent
                  name="rate1"
                  editing={false}
                  starCount={10}
                  value={8}
                />
                <p>{"They do not sell food here."}</p>
                 <Link to ={"/post/" + userId}>
                <button
                  className="btn btn-secondary"
                  style={{
                    position: "absolute",
                    right: "20px"
                  }}
                >
                  View Comments ({0})
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
