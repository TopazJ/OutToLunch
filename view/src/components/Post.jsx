import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import Comment from "./Comment.jsx";
import Loader from 'react-loader-spinner'

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
    loading: true,
    moreData: true,
    page: 0,
    post: {},
    comments: [] //[{ id: 1, userId: 0 }]
  };

  constructor(props){
    super(props);
    if (this.props.post){
        this.state.post = this.props.post;
    }
    else{
        this.state.post.postId = this.props.id;
    }
    this.retrieveComments();
  }

  componentDidMount() {
       window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-5 && !this.state.loading && this.state.moreData) {
         this.setState({loading: true});
         this.retrieveComments();
    }
  };


  retrieveComments = () => {
    fetch(this.props.request+'/comments/'+this.state.post.postId+'/'+this.state.page+'/', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            this.setState({loading:false});
            if (data.data.length > 0) {
                data.data.map(x => {
                    this.setState(state => ({
                        comments: [
                            ...state.comments,
                            {
                                commentId: x.commentID,
                                userId: x.userID,
                                parentId: x.parentID,
                                username: x.username,
                                userImage: x.userImage,
                                date: x.commentDate,
                                content: x.content,
                                children: x.numChildren
                            }
                        ]
                    }));
                });
                let increment = this.state.page + 1;
                this.setState({page: increment});
            }
            else {
                this.setState({moreData: false});
            }
        }).catch(err => console.error("Error:", err));
  };

  spinnerWhenLoading() {
      if (this.state.loading){
          return (
                <div style={{ paddingLeft: "350px" }}>
                    <Loader
                     type="Oval"
                     color="#17a2b8"
                     height={100}
                     width={100}
	                />
                </div>
              );
      }
  }

  render() {
    return (
      <div className="background container border post">
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
              src={this.state.post.userImage}
            />

            <p>{this.state.post.username}</p>
            <div className="btn-group" role="group" aria-label="Basic example">
              <button style={{ width: "50px" }}>🍽{this.state.post.upvotes}</button>

              <button style={{ width: "50px" }}>🤮{this.state.post.downvotes}</button>
            </div>
          </div>

          <div
            style={{
              paddingLeft: "150px",
              paddingRight: "100px"
            }}
          >
            <h1>{this.state.post.subject}</h1>
            {this.state.post.establishmentName}
            <br/>
            <img
              src="https://www.ucalgary.ca/news/sites/default/files/styles/ucws_news_hero_image_desktop/public/2019-06/bookstore_011a0796_f.jpg?itok=aE9ylKnp"
              //TODO the image url stuff goes here when I figure that out.
              style={{ width: "500px", height: "200px" }}
            />
            <br />
            <StarRatingComponent
              name="rate1"
              editing={false}
              starCount={10}
              value={this.state.post.rating}
            />
            <p>{this.state.post.content}</p>
            <br />
          </div>
        </div>
        <div style={{ background: "#fff7f0" }}>
          <h2 style={{ paddingLeft: "10px" }}>Comments:</h2>
          {this.state.comments.map((comment, index) => (
            <div key={index}>
              <br />
              <Comment key={index}
                       userId={comment.userId}
                       commentId={comment.commentID}
                       parentId={comment.parentID}
                       username={comment.username}
                       userImage={comment.userImage}
                       date={comment.commentDate}
                       content={comment.content}
                       children={comment.children}
              />
              <br />
            </div>
          ))}
          {this.spinnerWhenLoading()}
          <div style={{ paddingLeft: "25px" }}>
            <textarea
              required
              style={{ width: "700px", height: "100px" }}
              placeholder="Write a comment..."
              className="form-control"
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
