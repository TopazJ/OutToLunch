import React, { Component } from "react";
import "./styles.css";
import Establishments from "./Establishments.jsx";
import {Route, Switch, withRouter} from "react-router";
import Post from "./Post.jsx";
import HomepagePost from "./HomepagePost.jsx";
import Homepage from "./Homepage.jsx"
import {Link} from "react-router-dom";

class EstablishmentsPage extends Component {
  state = {
    page: 0,
    establishments: [
    ]
  };

  constructor(props){
      super(props);
      this.retrieveEstablishments();
  }

  retrieveEstablishments = () => {
    fetch('http://127.0.0.1:8000/establishments/'+this.state.page+'/', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            data.data.map(x=>{
                this.setState(state => ({
                    establishments: [
                        ...state.establishments,
                        {
                            id: x.id,
                            name: x.name,
                        }
                    ]
                }));
            });
           let increment = this.state.page + 1;
           this.setState({page: increment});
        })
        .catch(err => console.error("Error:", err));
  };

  showTheCreateEstablishmentButtonIfLoggedIn() {
    if (this.props.userElo >= 1000) {
      return (
        <Link to="/create-establishment">
          <button
            className="btn btn-secondary"
            style={{ position: "absolute", right: "10px" }}
          >
            Create New Establishment
          </button>
        </Link>
      );
    }
  }


  render() {
      return (
          <div className="background">
              {this.showTheCreateEstablishmentButtonIfLoggedIn()}
              <Switch>
                <Route path="/establishments/:id" component={props => <Homepage url={props.match.params.id} loggedIn={this.props.loggedIn}/>}>
          </Route>
          <Route>
          {this.state.establishments.map((establishment, index) => (
              <div key={index}>
                <br />
                <Establishments id={establishment.id} name={establishment.name} />
                <br />
              </div>
            ))}
             </Route>
        </Switch>
          </div>
    );
  }
}

export default withRouter(EstablishmentsPage);
