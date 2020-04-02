import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
import CSRFToken from "./CSRFToken.jsx";

class Comment extends Component {

    state = {
        childrenInfo:{
            numChildren:0,
            loadedChildren: 0,
            children:[],
        },
        page:0,
        loading:false,
        commentForm:{
            content:''
        },
        editCommentForm:{
            content:''
        },
        newContent:'',
        editMode:false,
        canEdit:true
    };
    abortController = new window.AbortController();

    constructor(props){
        super(props);
        this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.state.childrenInfo.numChildren = this.props.numChildren;
        this.state.editCommentForm.content = this.props.content;
        this.state.newContent = this.props.content;
    }

    componentWillUnmount() {
      this.abortController.abort();
    }

    retrieveChildren = () => {
        this.setState({loading:true});
        fetch(this.props.request+'/comments/'+this.props.commentId+'/'+this.state.page+'/', {
            method: 'GET',
            signal: this.abortController.signal,
        }).then(res => res.json())
        .then(data => {
            this.setState({loading:false});
            data.data.map(x => {
                    this.setState(state => ({
                        childrenInfo:{
                            loadedChildren: this.state.childrenInfo.loadedChildren + data.data.length,
                            children: [
                                ...state.childrenInfo.children,
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
                        }
                    }));
                });
                let increment = this.state.page + 1;
                this.setState({page: increment});
        }).catch(err => {
            if (err.name === 'AbortError') return;
            console.error("Error:", err)});
    };

    showRepliesButtonIfChildren() {
        if (this.state.childrenInfo.numChildren > 0 && this.state.childrenInfo.numChildren > this.state.childrenInfo.loadedChildren){
            if (this.state.childrenInfo.loadedChildren===0){
                return (<a href="#0" onClick={this.retrieveChildren}>{"See replies (" +
                (this.state.childrenInfo.numChildren - this.state.childrenInfo.loadedChildren) + ")"}</a>);
            }
            return (<a href="#0" onClick={this.retrieveChildren}>{"More replies (" +
                (this.state.childrenInfo.numChildren - this.state.childrenInfo.loadedChildren) + ")"}</a>);
        }
    }

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

    renderNestedChildren() {
        if (this.state.childrenInfo.loadedChildren > 0) {
            return (this.state.childrenInfo.children.map((comment, index) => (
                <div key={index}>
                    <br/>
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
                    <br/>
                </div>
            )));
        }
    }

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
         parentID: this.props.commentId,
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
                let loaded = this.state.childrenInfo.loadedChildren;
                let numChildren = this.state.childrenInfo.numChildren;
                this.setState(state => ({
                    childrenInfo:{
                        loadedChildren: loaded+1,
                        numChildren: numChildren+1,
                        children:[
                            {
                                commentId: data.commentId,
                                userId: this.props.currentUser.userId,
                                parentId: this.props.commentId,
                                username: this.props.currentUser.username,
                                userImage: this.props.currentUser.image,
                                date: 0,
                                content: this.state.commentForm.content,
                                numChildren: 0
                            },
                            ...state.childrenInfo.children
                        ]
                    },
                }));
                this.setState({commentForm: {content:''}});
            }
        })
        .catch(err => {
            alert("Error communicating with server.");
            console.error(err);
        });

    };


    handleEditCommentInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState(state => ({
            editCommentForm: {
                ...state.editCommentForm,
                [name]: value
            }
        }));
    };

    handleUpdateSubmit(e) {
       e.preventDefault();
       if (this.state.editCommentForm.content === this.props.content){
           alert("You must change your comment first!");
           return;
       }
       const content = {
           commentID: this.props.commentId,
           userID: this.props.currentUser.userId,
           content: this.state.editCommentForm.content,
           numChildren: this.state.childrenInfo.numChildren
       };
       this.setState({submitted: true});
       fetch(this.props.request + '/comments/update/', {
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
                   this.setState({newContent:content.content, editMode:false})
               }
               else{
                   alert(data.error);
               }
       })
       .catch(err => {
           console.error("Error:", err)
       });
  };

  handleDeleteSubmit(e) {
       e.preventDefault();
       const content = {
           commentID: this.props.commentId,
           numChildren: this.state.childrenInfo.numChildren
       };
       this.setState({submitted: true});
       fetch(this.props.request + '/comments/delete/', {
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
               alert("Successfully removed comment");
               this.setState( {newContent:'[deleted]', editMode:false, canEdit:false});
           }
           else{
               alert(data.error);
           }
       })
       .catch(err => {
           console.error("Error:", err)
       });
  }

    showEditButton(){
        if (!this.state.editMode && this.props.currentUser.userId === this.props.userId.replace(/-/g, "")&&this.state.canEdit){
            return (
              <button onClick={()=>{this.setState({editMode:true})}} className="btn btn-primary btn-sm">
                    Edit
              </button>
            );
        }
    }

    showUpdateButton() {
        if (this.state.submitted) {
            return (
                <Loader
                    type="Oval"
                    color="#17a2b8"
                    height={30}
                    width={30}
                />
            );
        }
        return (
             <button type="submit"
                     className="btn btn-primary btn-sm">
                    Update Comment
            </button>
        );
    }

    showDeleteButton() {
        if (!this.state.submitted) {
            return (
                 <button type="submit"
                         className="btn btn-danger btn-sm">
                     Delete Comment
                 </button>
            );
        }
    }

    showEditWindow(){
        if (this.state.editMode&&this.state.canEdit){
            return(
                <div>
                    <form onSubmit={this.handleUpdateSubmit}>
                        <CSRFToken/>
                        <textarea
                            name="content"
                            required
                            style={{ width: "450px", height: "50px" }}
                            placeholder="Respond to this comment"
                            className="form-control"
                            value={this.state.editCommentForm.content}
                            onChange={this.handleEditCommentInputChange}
                        />
                        {this.showUpdateButton()}
                    </form>
                    <form onSubmit={this.handleDeleteSubmit}>
                        <CSRFToken/>
                        {this.showDeleteButton()}
                    </form>
                </div>
            );
        }
        return(
            <p>{this.state.newContent}
                <br/>
            </p>
        );
    }

    render() {
        return (
           <div style={{ background: "#fff0f1", paddingLeft: "20px"}} className="border">
            <div
              style={{
                position: "absolute",
                paddingTop: "10px",
                paddingLeft: "40px"
              }}
            >
              <img
                style={{ width: "100px", height: "100px" }}
                src={this.props.userImage}
              />
             <Link to={'/user/'+this.props.userId+'/'}>
                    <p>{this.props.username}</p>
             </Link>
            </div>
            <div
              style={{
                paddingLeft: "150px"
              }}
            >
                {this.showEditWindow()}
                {this.showEditButton()}
              <form onSubmit={this.createComment}>
                  <CSRFToken/>
                  <textarea
                    name="content"
                    required
                    style={{ width: "450px", height: "50px" }}
                    placeholder="Respond to this comment"
                    className="form-control"
                    value={this.state.commentForm.content}
                    onChange={this.handleCommentInputChange}
                  />
                  <div style={{ paddingBottom: "10px" }}>
                    <button type="submit" className="btn btn-secondary"> Post Comment </button>
                  </div>
              </form>

            </div>
               {this.renderNestedChildren()}
               {this.showRepliesButtonIfChildren()}
               {this.spinnerWhenLoading()}
          </div>
        );
      }
}

export default withRouter(Comment);
