import React, { Component } from "react";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";

class Comment extends Component {

    // TODO Shamez -> Figure out how to do inner comment lazy loading. Show replies does not currently work.
    state = {
        childrenInfo:{
            loadedChildren: 0,
            children:[],
        },
        page:0,
        loading:false
    };
    abortController = new window.AbortController();

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
        if (this.props.numChildren > 0 && this.props.numChildren > this.state.childrenInfo.loadedChildren){
            if (this.state.childrenInfo.loadedChildren===0){
                return (<a href="#0" onClick={this.retrieveChildren}>{"See replies (" +
                (this.props.numChildren - this.state.childrenInfo.loadedChildren) + ")"}</a>);
            }
            return (<a href="#0" onClick={this.retrieveChildren}>{"More replies (" +
                (this.props.numChildren - this.state.childrenInfo.loadedChildren) + ")"}</a>);
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
                    />
                    <br/>
                </div>
            )));
        }
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
              <p>{this.props.content}
                <br/>

              </p>

              <textarea
                required
                style={{ width: "450px", height: "50px" }}
                placeholder="Respond to this comment"
                className="form-control"
              />
              <div style={{ paddingBottom: "10px" }}>
                <button className="btn btn-secondary"> Post Comment </button>
              </div>

            </div>
               {this.renderNestedChildren()}
               {this.showRepliesButtonIfChildren()}
               {this.spinnerWhenLoading()}
          </div>
        );
      }
}

export default Comment;
