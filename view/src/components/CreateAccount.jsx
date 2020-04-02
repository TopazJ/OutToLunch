import React, {Component} from "react";
import CSRFToken from "./CSRFToken.jsx";
import {Redirect} from "react-router";

class CreateAccount extends Component{
    constructor(props) {
        super(props);
        this.state = {form:{email:'', username: '', password: '', FName:'', LName:'', imageFile: null}, created:false};
    }

    handleSubmit =(event)=>{
        event.preventDefault();
        let data = new FormData();
        data.append('image', this.state.form.imageFile);
        const values = {
            username: this.state.form.username,
            email: this.state.form.email,
            password: this.state.form.password,
            FName: this.state.form.FName,
            LName: this.state.form.LName
        };
        data.append('content', JSON.stringify(values));
        let url = this.props.props.url + '/auth/create/';
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
                this.setState({created:true});
            }
        })
        .catch(err => {
            alert("Error communicating with server.");
            console.error(err);
        });
    };


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(state => ({
            form: {
                ...state.form,
                [name]: value
            }
        }))
    };

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState(state => ({
                form:{
                    ...state.form,
                    imageFile: file
                }
            }));
        };
        reader.readAsDataURL(file)
    }

    checkRedirect(){
        if(this.state.created===true) {
            return <Redirect to={'/login'}/>; //TODO change this to ask for email confirmation.
        }
    }

    render(){
        return <React.Fragment>
            <div className="container create-account">
          <div className="row">
            <div className="col-sm">
                <form className="p-4" name="createAccount" onSubmit={this.handleSubmit}>
                    <CSRFToken />
                    <div className="form-group">
                        <label htmlFor="username">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            placeholder="example@example.com"
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            placeholder="Username"
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="first-name">First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="first-name"
                            name="FName"
                            onChange={this.handleInputChange}
                            required
                        />
                        <label htmlFor="last-name">Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="last-name"
                            name="LName"
                            onChange={this.handleInputChange}
                            required
                        />
                        <label htmlFor="fileToUpload">Profile Picture</label>
                        <br/>
                        <input
                            type="file"
                            accept="image/*"
                            name="fileToUpload"
                            id="fileToUpload"
                            onChange={(e) => this.handleImageChange(e)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Create Account
                    </button>
                </form>
            <p>{this.checkRedirect()}</p>
            </div>
          </div>
            </div>
            </React.Fragment>

    }

}

export default CreateAccount;