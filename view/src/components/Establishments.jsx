import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";

class Establishments extends Component {
  render() {
    return (
      <div>
        <div
          className="container border"
          style={{
            background: "aliceblue",
            paddingTop: "10px",
            width: "800px"
          }}
        >
          <div className="row">
            <div className="col-sm">
              <div>
                <h1>{this.props.name}</h1>
                  <StarRatingComponent
                  name="rate1"
                  editing={false}
                  starCount={10}
                  value={this.props.rating}
                  />
                  <h5>Location:</h5>
                  <p>{this.props.location}</p>
                  <h5>Description:</h5>
                  <p>{this.props.description}</p>
                <div style={{ paddingBottom: "20px" }}>
                    <Link to={'/establishments/'+this.props.id+'/'}>
                  <button
                    className="btn btn-secondary"
                    style={{
                      position: "absolute",
                      right: "20px"
                    }}
                  >
                    Read reviews
                  </button>
                    </Link>
                </div>
                <br />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Establishments;
