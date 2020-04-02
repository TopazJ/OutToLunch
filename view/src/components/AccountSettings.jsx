import React, { Component } from "react";
import { Link } from "react-router-dom";
import CSRFToken from "./CSRFToken.jsx";

class AccountSettings extends Component {
    state = {
      imageUrl:'',
      imageFile: null,
      newImageUrl:''
    };

    constructor(props) {
        super(props);
        this.state.imageUrl = props.user.image;
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user !== prevProps.user){
            this.setState({imageUrl: this.props.user.image});
        }
    }

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState({
                imageFile: file,
                newImageUrl: reader.result
            });
        };
        reader.readAsDataURL(file)
    }

    handleSubmit =(event)=>{
        event.preventDefault();
        let data = new FormData();
        let updateForm = document.forms.imageUpdate;
        data.append('image', this.state.imageFile);
        let url = this.props.request + '/auth/update/';
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
        .then(data => {
            if (data.status!=='success'){
                alert(data.message);
            }
            else{
                this.setState({imageUrl: this.state.newImageUrl});
                updateForm.fileToUpload.value = '';
            }
        })
        .catch(err => {
            alert("Error communicating with server.");
            console.error(err);
        });
    };


    render() {
    return (
      <div className="background">
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
                <h2>Account Settings</h2>
                  <Link to={'/user/'+this.props.user.userId+'/'}>
                    <h2>{this.props.user.username}</h2>
                  </Link>
                <img
                  style={{ width: "100px", height: "100px" }}
                  src={this.state.imageUrl}
                />
                <h3>Change profile picture:</h3>
                  <form name="imageUpdate" onSubmit={this.handleSubmit}>
                      <CSRFToken/>
                      <input
                            type="file"
                            accept="image/*"
                            name="fileToUpload"
                            id="fileToUpload"
                            onChange={(e) => this.handleImageChange(e)}
                        />
                      <button type="submit" className="btn btn-primary" disabled={this.state.imageFile === null}>
                        Submit New Image
                    </button>
                  </form>
                <br />
                 <h2> 🍽 {this.props.user.userElo}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AccountSettings;
