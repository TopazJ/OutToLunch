import React, { Component } from "react";
import "./styles.css";
import Establishments from "./Establishments.jsx";
import {Route, Switch, withRouter} from "react-router";
import Homepage from "./Homepage.jsx"
import {Link} from "react-router-dom";
import Loader from 'react-loader-spinner'


class EstablishmentsPage extends Component {
  state = {
      loading:true,
      moreData:true,
      page: 0,
      establishments: []
  };

  constructor(props){
      super(props);
      this.retrieveEstablishments();
  }

  componentDidMount() {
       window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
     if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight-5 && !this.state.loading && this.state.moreData) {
         this.setState({loading: true});
         this.retrieveEstablishments();
    }
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
                </div>);
      }
  }

  retrieveEstablishments = () => {
    fetch(this.props.request+'/establishments/'+this.state.page+'/', {
            method: 'GET',
        }).then(res => res.json())
        .then(data => {
            this.setState({loading:false});
            if (data.data.length > 0) {
                data.data.map(x => {
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
            }
            else {
                this.setState({moreData: false});
            }
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
          <Switch>
              <Route path="/establishments/:id/">
                  <Homepage request = {this.props.request}
                             url={this.props.location.pathname.replace('establishments/','')}
                             loggedIn={this.props.loggedIn}/>
              </Route>
               <Route path="/establishments/">
                   <div className="background">
                       {this.showTheCreateEstablishmentButtonIfLoggedIn()}
                       {this.state.establishments.map((establishment, index) => (
                            <div key={index}>
                                <br />
                                <Establishments id={establishment.id} name={establishment.name} />
                                <br />
                            </div>
                       ))}
                       {this.spinnerWhenLoading()}
                    </div>
               </Route>
        </Switch>
    );
  }
}

export default withRouter(EstablishmentsPage);
