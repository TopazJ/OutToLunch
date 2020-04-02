import React, { Component } from "react";
import StarRatingComponent from "react-star-rating-component";
import Comment from "./Comment.jsx";
import { Link, withRouter } from "react-router-dom";
import Loader from 'react-loader-spinner'
import CSRFToken from "./CSRFToken.jsx";

class Post extends Component {
  page = 0;
  moreData = true;
  state = {
    upVote:0,
    downVote:0,
    loading: true,
    post: {comments:0},
    comments: [],
    canEdit: false,
    edit: false,
    commentForm:{
        content: '',
    },
    postEditForm: {
        subject:'',
        content: '',
        oldRating: 0,
        rating: 0,
        imageFile: null,
        imageUrl: ''
    },
    submitted: false
  };
  abortController = new window.AbortController();

  constructor(props){
    super(props);
    this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
    this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
    if (this.props.post){
        this.state.post = this.props.post;
        this.state.postEditForm = {
            content: this.props.post.content,
            rating: this.props.post.rating,
            subject: this.props.post.subject,
            imageFile: null,
            imageUrl: this.props.post.photo
        };
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
      if (this.props.user!== prevProps.user || this.props.edit !== prevProps.edit) {
          this.page = 0;
          this.moreData = true;
          this.setState({post: {postId: this.props.id, comments:0}, comments:[], loading:true});
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
                                establishmentId: x.establishment_id,
                                username: x.username,
                                userImage: x.user_image,
                                establishmentName: x.establishment_name,
                                date: x.post_date,
                                content: x.post_content,
                                photo: x.post_photo_location,
                                rating: x.post_rating,
                                subject: x.post_subject,
                                upvotes: x.upvote,
                                downvotes: x.downvote,
                                comments: x.count,
                            },
                        postEditForm:{
                            content: x.post_content,
                            rating: x.post_rating,
                            oldRating: x.post_rating,
                            subject: x.post_subject,
                            imageFile: null,
                            imageUrl: x.post_photo_location
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

  showEditButton(){
      if (!this.props.edit && this.props.currentUser.userId === this.state.post.userId.replace(/-/g,"")){
         return (
             <div className="btn-group">
                <Link to='./edit/'>
                        <button className="btn btn-primary" style={{
                                      right: "10px"
                                    }}>Edit</button>
                </Link>
             </div>
                 );
      }
  }

  showLoadingOnSubmit(){
      if (this.state.submitted){
          return(
               <div style={{
                  right: "10px"
                }}
               >
                  <Loader
                     type="Oval"
                     color="#17a2b8"
                     height={30}
                     width={30}
	                />
              </div>
          );
      }
      return(
              <button
                type="submit"
                style={{
                  right: "10px"
                }}
                className="btn btn-primary"
                >
                    Update
              </button>
      );
  }

  showDeleteButton(){
      if (!this.state.submitted){
          return(
              <div>
                  <br/>
                  <form onSubmit={this.handleDeleteSubmit}>
                      <CSRFToken/>
                      <button type="submit"
                              className="btn btn-danger">
                          Delete Post
                      </button>
                  </form>
              </div>
          );
      }
  }

  handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(state => ({
            postEditForm: {
                ...state.postEditForm,
                [name]: value
            }
        }));
  };

  onStarClick(nextValue, prevValue, name) {
    this.setState(state => (
        {
            postEditForm:{
                ...state.postEditForm,
                rating: nextValue
            }
        }
    ));
  }

  handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState(state => ({
                postEditForm:{
                    ...state.postEditForm,
                    imageFile: file,
                    imageUrl: reader.result
                }
            }));
        };
        reader.readAsDataURL(file)
  }

  handleUpdateSubmit(e) {
       e.preventDefault();
       if (this.state.postEditForm.rating < 1 || this.state.postEditForm.rating > 10){
           alert("Please provide a valid rating!");
           return;
       }
       let content = {
           post_user: this.state.post.userId,
           post_id: this.state.post.postId,
           establishment_id: this.state.post.establishmentId,
       };
       if (this.state.postEditForm.rating !== this.state.post.rating){
           content["post_rating"] = this.state.postEditForm.rating;
           content["oldRating"] = this.state.postEditForm.oldRating;
       }
       if (this.state.postEditForm.subject !== this.state.post.subject){
           content["post_subject"] = this.state.postEditForm.subject;
       }
       if (this.state.postEditForm.content !== this.state.post.content){
           content["post_content"] = this.state.postEditForm.content;
       }
       if (Object.keys(content).length < 4 && this.state.postEditForm.imageFile == null){
          alert("You must modify the post before you can update it!");
       }
       else {
           let data = new FormData();
           data.append('image', this.state.postEditForm.imageFile);
           data.append('content', JSON.stringify(content));
           this.setState({submitted: true});
           fetch(this.props.request + '/posts/update/', {
               method: 'POST',
               body: data,
               headers: {
                   'X-CSRFToken': e.target.csrfmiddlewaretoken.value
               }
           }).then(res => res.json())
               .then(data => {
                   this.setState({submitted:false});
                   if (data.success === "success") {
                       this.props.history.push('/post/' + this.state.post.postId + '/');
                   }
                   else{
                       alert(data.error);
                   }
               })
               .catch(err => {
                   console.error("Error:", err)
               });
       }
  };

  handleDeleteSubmit(e) {
       e.preventDefault();
       const content = {
           post_user: this.state.post.userId,
           post_id: this.state.post.postId,
           establishment_id: this.state.post.establishmentId,
           rating: this.state.post.rating
       };
       this.setState({submitted: true});
       fetch(this.props.request + '/posts/delete/', {
           method: 'POST',
           body: JSON.stringify(content),
           headers: {
               'Content-Type': 'application/json',
               'X-CSRFToken': e.target.csrfmiddlewaretoken.value
           }
       }).then(res => res.json())
       .then(data => {
           this.setState({submitted:false});
           if (data.success === "success") {
               alert("Successfully removed review.");
               location.reload();
           }
           else{
               alert(data.error);
           }
       })
       .catch(err => {
           console.error("Error:", err)
       });
  }

  renderPostOnLoad(){
      if (Object.keys(this.state.post).length > 2){
          if (this.props.edit) {
              if (this.props.currentUser.userId === this.state.post.userId.replace(/-/g, "")) {
                  return (
                      <div style={{background: "aliceblue"}}>
                      <div
                          style={{
                              position: "absolute",
                              paddingTop: "10px",
                              paddingLeft: "20px"
                          }}
                      >
                          <img
                              style={{width: "100px", height: "100px"}}
                              src={this.props.currentUser.image}
                          />

                          <Link to={'/user/' + this.state.post.userId + '/'}>
                              <p>{this.state.post.username}</p>
                          </Link>
                          <div className="btn-group" role="group" aria-label="Basic example">
                              <form onSubmit={this.postUpvote}>
                                  <CSRFToken/>
                                  <button data-toggle="tooltip" title="Upvote" type="submit" style={{width: "50px"}}
                                          disabled={this.state.upVote === 1}>🍽{this.state.post.upvotes + this.state.upVote}</button>
                              </form>
                              <form onSubmit={this.postDownvote}>
                                  <CSRFToken/>
                                  <button data-toggle="tooltip" title="Downvote" type="submit" style={{width: "50px"}}
                                          disabled={this.state.downVote === 1}>🤮{this.state.post.downvotes + this.state.downVote}</button>
                              </form>
                          </div>
                      </div>

                      <div
                            style={{
                              paddingLeft: "150px",
                              paddingRight: "100px"
                           }}
                      >
                          <form name="updatePost" onSubmit={this.handleUpdateSubmit}>
                              <CSRFToken/>
                              <input
                                className="form-control"
                                type="text"
                                required
                                style={{ width: "500px" }}
                                placeholder="Title"
                                name="subject"
                                onChange={this.handleInputChange}
                                value={this.state.postEditForm.subject}
                              />
                              <img
                                  src={this.state.postEditForm.imageUrl}
                                  style={{height: "200px"}}
                              />
                              <StarRatingComponent
                                name="rating"
                                starCount={10}
                                value={this.state.postEditForm.rating}
                                onStarClick={this.onStarClick.bind(this)}
                              />
                              <br/>
                              <textarea
                                className="form-control"
                                name="content"
                                required
                                style={{ width: "500px", height: "200px", resize:"none"}}
                                placeholder="Write your review..."
                                onChange={this.handleInputChange}
                                value={this.state.postEditForm.content}
                              />
                              <br/>
                              <input
                                type="file"
                                accept="image/*"
                                name="fileToUpload"
                                id="fileToUpload"
                                onChange={(e) => this.handleImageChange(e)}
                              />
                              {this.showLoadingOnSubmit()}
                            </form>
                          {this.showDeleteButton()}
                      </div>
                  </div>);
              }
              this.props.history.push('/post/'+this.state.post.postId+'/');
          }
          else {
              return (
                  <div style={{background: "aliceblue"}}>
                      <div
                          style={{
                              position: "absolute",
                              paddingTop: "10px",
                              paddingLeft: "20px"
                          }}
                      >
                          <img
                              style={{width: "100px", height: "100px"}}
                              src={this.state.post.userImage}
                          />

                          <Link to={'/user/' + this.state.post.userId + '/'}>
                              <p>{this.state.post.username}</p>
                          </Link>
                          <div className="btn-group" role="group" aria-label="Basic example">
                              <form onSubmit={this.postUpvote}>
                                  <CSRFToken/>
                                  <button data-toggle="tooltip" title="Upvote" type="submit" style={{width: "50px"}}
                                          disabled={this.state.upVote === 1}>🍽{this.state.post.upvotes + this.state.upVote}</button>
                              </form>
                              <form onSubmit={this.postDownvote}>
                                  <CSRFToken/>
                                  <button data-toggle="tooltip" title="Downvote" type="submit" style={{width: "50px"}}
                                          disabled={this.state.downVote === 1}>🤮{this.state.post.downvotes + this.state.downVote}</button>
                              </form>
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
                              style={{height: "200px"}}
                          />
                          <br/>
                          <StarRatingComponent
                              name="rate1"
                              editing={false}
                              starCount={10}
                              value={this.state.post.rating}
                          />
                          <p>{this.state.post.content}</p>
                          <br/>
                      </div>
                      {this.showEditButton()}
                  </div>);
          }
      }
      return (
          <Loader
             type="Oval"
             color="#17a2b8"
             height={100}
             width={100}
          />);
  }

   postUpvote = (event) =>
   {
      event.preventDefault();
      const values = {
          postId: this.state.post.postId,
          userId: this.props.currentUser.userId,
          vote: 1
      };
      fetch(this.props.request + '/posts/vote/', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
      }).then(res => res.json())
      .then(data => {
            if (data.success!=='success'){
                alert(data.error);
            }
            else{
                this.setState({upVote:1, downVote:0});
            }
      })
      .catch(err => {
            console.error(err);
      });
   };

  postDownvote = (event) =>
  {
      event.preventDefault();
      const values = {
          postId: this.state.post.postId,
          userId: this.props.currentUser.userId,
          vote: -1
      };
      fetch(this.props.request + '/posts/vote/', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
        .then(data => {
            if (data.success!=='success'){
                alert(data.error);
            }
            else{
                this.setState({downVote:1, upVote:0});
            }
        })
        .catch(err => {
            console.error(err);
        });
  };

  handleCommentInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(state => ({
            commentForm: {
                ...state.commentForm,
                [name]: value
            }
        }));
  };

  createComment = (event) => {
      event.preventDefault();
      const values = {
         userID: this.props.currentUser.userId,
         parentID: this.state.post.postId,
         content: this.state.commentForm.content
      };
      fetch(this.props.request + '/comments/create/', {
            method: 'POST',
            body: JSON.stringify(values),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
        .then(data => {
            if (data.success!=='success'){
                alert(data.error);
            }
            else{
                this.setState(state => ({
                        comments: [
                            ...state.comments,
                            {
                                commentId: data.commentId,
                                userId: this.props.currentUser.userId,
                                parentId: this.state.post.postId,
                                username: this.props.currentUser.username,
                                userImage: this.props.currentUser.image,
                                date: 0,
                                content: this.state.commentForm.content,
                                numChildren: 0
                            }
                        ]
                }));
                this.setState({commentForm: {content:''}});
            }
        })
        .catch(err => {
            alert("Error communicating with server.");
            console.error(err);
        });

  };

  render() {
    return (
        <div className="background container border post">
            {this.renderPostOnLoad()}
        <div style={{ background: "#fff7f0" }}>
          <h2 style={{ paddingLeft: "10px" }}>{this.state.post.comments+" Comments:"}</h2>
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
                       currentUser={this.props.currentUser}
              />
              <br />
            </div>
          ))}
          {this.spinnerWhenLoading()}
          <div style={{ paddingLeft: "25px" }}>
            <form onSubmit={this.createComment}>
                <CSRFToken/>
                <textarea
                      name="content"
                      required
                      style={{ width: "700px", height: "100px" }}
                      placeholder="Write a comment..."
                      className="form-control"
                      value={this.state.commentForm.content}
                      onChange={this.handleCommentInputChange}
                />
                <div style={{ paddingBottom: "10px" }}>
                  <button type="submit" className="btn btn-primary"> Post Comment </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Post);
