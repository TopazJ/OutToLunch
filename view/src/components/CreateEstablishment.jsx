import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import CSRFToken from "./CSRFToken.jsx";
import Loader from "react-loader-spinner";

class CreateEstablishment extends Component {
  state = {
      form: {
          name: '',
          location: '',
          description: '',
          imageFile: null
      },
      submitted:false
  };

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this)
  }

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

  handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            this.setState(state => ({
                form:{
                    ...state.form,
                    imageFile: file
                },
                imageUrl: reader.result
            }));
        };
        reader.readAsDataURL(file)
  }

  handleSubmit(e) {
       e.preventDefault();
       let data = new FormData();
       data.append('image', this.state.form.imageFile);
       const content = {
         name: this.state.form.name,
         location: this.state.form.location,
         description: this.state.form.description,
       };
       data.append('content', JSON.stringify(content));
       this.setState({submitted:true});
       fetch(this.props.request + '/establishments/create/', {
            method: 'POST',
            body: data,
            headers: {
                'X-CSRFToken':e.target.csrfmiddlewaretoken.value
            }
        }).then(res => res.json())
       .then(data => {
           this.setState({submitted: false});
            if (data.success === "success"){
                alert("Successfully created establishment!");
                this.props.history.push('/establishments/');
            }
       })
       .catch(err => {
            console.error("Error:", err)
       });
  };

  showLoadingOnSubmit(){
      if (this.state.submitted){
          return(
               <div style={{
                  position: "absolute",
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
              position: "absolute",
              right: "10px"
            }}
            className="btn btn-primary"
          >
            Create
          </button>
      );
  }


  render() {
    return (
      <div className="background">
        <br />
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
                <h2>Create New Establishment</h2>
                <form name="createEstablishment" onSubmit={this.handleSubmit}>
                  <CSRFToken/>
                  <input
                    className="form-control"
                    name="name"
                    type="text"
                    required
                    style={{ width: "300px" }}
                    placeholder="Establishment Name"
                    onChange={this.handleInputChange}
                    value={this.state.form.name}
                  />
                  <br />
                  <input
                    className="form-control"
                    name="location"
                    type="text"
                    required
                    style={{ width: "300px" }}
                    placeholder="Location"
                    onChange={this.handleInputChange}
                    value={this.state.form.location}
                  />
                  <br />
                  <textarea
                    className="form-control"
                    name="description"
                    required
                    style={{ width: "700px", height: "200px" }}
                    placeholder="Description"
                    onChange={this.handleInputChange}
                    value={this.state.form.description}
                  />
                  <br />
                  <label htmlFor="fileToUpload">Image (Not Required)</label>
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
              </div>
            </div>
          </div>
        </div>
        <br />
      </div>
    );
  }
}

export default withRouter(CreateEstablishment);
