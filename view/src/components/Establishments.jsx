import React, { Component } from "react";
import { Link, useParams } from "react-router-dom";
import StarRatingComponent from "react-star-rating-component";
import Loader from "react-loader-spinner";
import CSRFToken from "./CSRFToken.jsx";

class Establishments extends Component {

    state = {
      form:{
        name:'',
        location: '',
        description: '',
        imageFile: null
      },
      establishment:{
        name:'',
        location: '',
        description: '',
        rating:0
      },
      editMode: false,
      submitted: false,
      flag:false
    };

    constructor(props) {
        super(props);
        this.handleUpdateSubmit = this.handleUpdateSubmit.bind(this);
        this.handleDeleteSubmit = this.handleDeleteSubmit.bind(this);
        this.state.form.name = props.name;
        this.state.form.location = props.location;
        this.state.form.description = props.description;
        this.state.establishment.name = props.name;
        this.state.establishment.location = props.location;
        this.state.establishment.description = props.description;
        this.state.establishment.rating = props.rating;
    }


    showEditButton(){
        if (!this.state.editMode && this.props.edit){
            return (
              <button onClick={()=>{this.setState({editMode:true})}} className="btn btn-primary">
                    Edit
              </button>
            );
        }
        else if (!this.props.edit) {
            return (
                <div className="btn-group" role="group" aria-label="Basic example">
                    <form onSubmit={this.handleFlag}>
                        <CSRFToken/>
                        <button type="submit" disabled={this.state.flag} data-toggle="tooltip" title="Report">⛔</button>
                    </form>
                </div>
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
                     className="btn btn-primary">
                    Update Establishment
            </button>
        );
    }

    showDeleteButton() {
        if (!this.state.submitted) {
            return (
                 <button type="submit"
                         className="btn btn-danger">
                     Delete Establishment
                 </button>
            );
        }
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
                }
            }));
        };
        reader.readAsDataURL(file)
    }

    handleFlag=(e)=>{
        e.preventDefault();
        const content = {
          establishment_id: this.props.id
        };
        fetch(this.props.request + '/establishments/flag/', {
               method: 'POST',
               body: JSON.stringify(content),
               headers: {
                   'Content-Type': 'application/json',
                   'X-CSRFToken': e.target.csrfmiddlewaretoken.value
               }
        }).then(res => res.json())
        .then(data => {
           this.setState({flag:true});
           if (data.success !== "success") {
               alert(data.error);
           }
        })
        .catch(err => {
           console.error("Error:", err)
        });
    };

    handleUpdateSubmit(e) {
        e.preventDefault();
        let content = {
            establishment_id: this.props.id
        };
        if (this.state.form.name !== this.state.establishment.name) {
            content["name"] = this.state.form.name;
        }
        if (this.state.form.location !== this.state.establishment.location) {
            content["location"] = this.state.form.location;
        }
        if (this.state.form.description !== this.state.establishment.description) {
            content["description"] = this.state.form.description;
        }
        if (Object.keys(content).length < 2 && this.state.form.imageFile == null) {
            alert("You must modify the post before you can update it!");
        } else {
            let data = new FormData();
            data.append('image', this.state.form.imageFile);
            data.append('content', JSON.stringify(content));
            this.setState({submitted: true});
            fetch(this.props.request + '/establishments/update/', {
                method: 'POST',
                body: data,
                headers: {
                    'X-CSRFToken': e.target.csrfmiddlewaretoken.value
                }
            }).then(res => res.json())
                .then(data => {
                    this.setState({submitted: false});
                    if (data.success === "success") {
                        alert("Successfully updated establishment.");
                        this.setState(
                            {
                                establishment: {
                                    name: this.state.form.name,
                                    location: this.state.form.location,
                                    description: this.state.form.description,
                                    rating: this.props.rating
                                },
                                editMode:false
                            })
                    }
                })
                .catch(err => {
                    console.error("Error:", err)
                });
        };
    }

    handleDeleteSubmit(e) {
           e.preventDefault();
           const content = {
               establishment_id: this.props.id,
           };
           this.setState({submitted: true});
           fetch(this.props.request + '/establishments/delete/', {
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
                   alert("Successfully deleted establishment.");
                   this.setState({establishment:{name:'[deleted]', location:'[deleted]', description:'[deleted]', rating:0}, editMode:false})
               }
               else{
                   alert(data.error);
               }
           })
           .catch(err => {
               console.error("Error:", err)
           });
    }

    showEditMode(){
        if (this.state.editMode){
            return(
                <div>
                    <form name="createEstablishment" onSubmit={this.handleUpdateSubmit}>
                      <CSRFToken/>
                      <label htmlFor="name">Establishment Name</label>
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
                      <label htmlFor="location">Location</label>
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
                      <label htmlFor="description">Description</label>
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
            <div>
                <h1>{this.state.establishment.name}</h1>
                <StarRatingComponent
                    name="rate1"
                    editing={false}
                    starCount={10}
                    value={this.state.establishment.rating}
                />
                <h5>Location:</h5>
                <p>{this.state.establishment.location}</p>
                <h5>Description:</h5>
                <p>{this.state.establishment.description}</p>
            </div>
        );
    }

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
                      {this.showEditMode()}
                      {this.showEditButton()}
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
