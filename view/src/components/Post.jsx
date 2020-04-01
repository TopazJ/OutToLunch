import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import Comment from "./Comment.jsx";
import { Link } from "react-router-dom";
import Loader from 'react-loader-spinner'

class Post extends Component {
  page = 0;
  moreData = true;
  state = {
    loading: true,
    post: {},
    comments: []
  };
  abortController = new window.AbortController();

  constructor(props){
    super(props);
    if (this.props.post){
        this.state.post = this.props.post;
    }
    else{
        this.state.post.postId = this.props.id;
        this.retrievePost();
    }
    this.retrieveComments(this.state.post.postId);
  }

  componentDidMount() {
       window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
      this.abortController.abort();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.props.id!== prevProps.id) {
          this.page = 0;
          this.moreData = true;
          this.setState({post: {postId: this.props.id}, comments:[], loading:true});
          this.retrievePost();
          this.retrieveComments(this.state.post.postId);
      }
  }

  handleScroll = () => {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-5 && !this.state.loading && this.moreData) {
         this.setState({loading: true});
         this.retrieveComments();
    }
  };

  retrievePost = () => {
      fetch(this.props.request+'/posts/'+this.props.id + '/', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            if (data.data.length > 0) {
                data.data.map(x => {
                    this.setState({
                        post:
                            {
                                postId: x.post_id,
                                userId: x.user_id,
                                username: x.username,
                                userImage: x.user_image,
                                establishmentName: x.establishment_name,
                                date: x.post_date,
                                content: x.post_content,
                                photo: x.post_photo_location,
                                rating: x.post_rating,
                                subject: x.post_subject,
                                upvotes: x.upvote,
                                downvotes: x.downvote
                            }
                    });
                });
            }
        }).catch(err => console.error("Error:", err));
  };


  retrieveComments = () => {
    fetch(this.props.request+'/comments/'+this.props.id+'/'+this.page+'/', {
            method: 'GET',
            signal: this.abortController.signal,
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
                                numChildren: x.numChildren
                            }
                        ]
                    }));
                });
                this.page += 1;
            }
            else {
                this.moreData=false;
            }
        }).catch(err => {
            if (err.name === 'AbortError') return;
            console.error("Error:", err)});
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

  renderPostOnLoad(){
      if (Object.keys(this.state.post).length > 1){
         return (
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

            <Link to={'/user/'+this.state.post.userId+'/'}>
                <p>{this.state.post.username}</p>
            </Link>
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
              src={this.state.post.photo}
              style={{height: "200px" }}
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
        </div>);
      }
      return (
          <Loader
             type="Oval"
             color="#17a2b8"
             height={100}
             width={100}
          />);
  }

  render() {
    return (
        <div className="background container border post">
            {this.renderPostOnLoad()}
        <div style={{ background: "#fff7f0" }}>
          <h2 style={{ paddingLeft: "10px" }}>Comments:</h2>
          {this.state.comments.map((comment, index) => (
            <div key={index}>
              <br />
              <Comment key={index}
                       userId={comment.userId}
                       commentId={comment.commentId}
                       parentId={comment.parentId}
                       username={comment.username}
                       userImage={comment.userImage}
                       date={comment.date}
                       content={comment.content}
                       numChildren={comment.numChildren}
                       request={this.props.request}
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
