import React, {Component} from "react";
import CSRFToken from "./CSRFToken.jsx";
import { withRouter } from "react-router";
import Loader from "react-loader-spinner";

class Confirmation extends Component{
    constructor(props) {
        super(props);
        this.state = {form:{code:''}, submitted:false};
    }

    showLoadingOnSubmit(){
      if (this.state.submitted){
          return(
              <Loader
                 type="Oval"
                 color="#17a2b8"
                 height={30}
                 width={30}
                />
          );
      }
      return(
          <button type="submit" className="btn btn-primary">
              Verify Email
          </button>
      );
  }

    handleSubmit =(event)=>{
        event.preventDefault();
        const data = {code: this.state.form.code};
        let url = this.props.request + '/auth/verify/';
        this.setState({submitted:true});
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken':event.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
        .then(data => {
            this.setState({submitted:false});
            if (data.status!=='success'){
                alert(data.message);
            }
            else{
                alert(data.message);
                this.props.history.push('/login/');
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
        }));
    };

    render(){
        return <React.Fragment>
            <div className="container">
          <div className="row">
            <div className="col-sm">
                <form className="p-4" name="createAccount" onSubmit={this.handleSubmit}>
                    <CSRFToken />
                    <div className="form-group">
                        <label htmlFor="username">Code</label>
                        <input
                            type="text"
                            className="form-control"
                            id="code"
                            name="code"
                            placeholder="Confirmation Code"
                            onChange={this.handleInputChange}
                            required
                        />
                    </div>
                    {this.showLoadingOnSubmit()}
                </form>
            </div>
          </div>
            </div>
            </React.Fragment>

    }
}

export default withRouter(Confirmation);