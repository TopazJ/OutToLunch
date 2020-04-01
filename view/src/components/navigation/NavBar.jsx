import React, { Component } from "react";
import { Link, NavLink, withRouter } from "react-router-dom";
import Autosuggest from 'react-autosuggest';
import { debounce } from 'throttle-debounce';
import Loader from 'react-loader-spinner'

class NavBar extends Component {

  abortController = new window.AbortController();
  suggestions = [];

  constructor(props) {
    super(props);
    this.props.initButtons();
    this.state = {
      loadingEstablishments: false,
      loadingPosts: false,
      value: '',
      oldValue:'',
      suggestions: [],
      selected:{}
    };
  }

  componentDidMount() {
    this.onSuggestionsFetchRequested = debounce(
      500, this.onSuggestionsFetchRequested
    );
  }

  componentWillUnmount() {
      this.abortController.abort();
  }

  getSuggestions = value => {
    if (this.state.selected && Object.keys(this.state.selected).length > 0) {
        if (!(value === this.state.selected.title)) {
            this.setState({selected: {}});
        }
    }
    if (value === this.state.oldValue){
        return this.suggestions;
    }
    this.setState({oldValue: value});
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    if (inputLength > 0) {
        this.setState({loading:true});
        fetch(this.props.request + '/establishments/search/' + inputValue + '/', {
            method: 'GET',
            signal: this.abortController.signal,
        }).then(res => res.json())
            .then(data => {
                let foundEstablishments = [];
                if (data.data.length > 0) {
                    data.data.map(x => {
                        foundEstablishments = [
                            ...foundEstablishments,
                            {
                                id: x.id,
                                title: x.name,
                                url: '/establishments/',
                                header: false,
                            }
                        ]
                    });
                }
                fetch(this.props.request + '/posts/search/' + inputValue + '/0/', {
                    method: 'GET',
                    signal: this.abortController.signal,
                }).then(res => res.json())
                    .then(data => {
                        this.setState({loading: false});
                        let foundPosts = [];
                        if (data.data.length > 0) {
                            data.data.map(x => {
                                foundPosts = [
                                    ...foundPosts,
                                    {
                                        id: x.post_id,
                                        title: x.post_subject,
                                        url: '/post/',
                                        header: false,
                                    }
                                ]
                            });
                        }

                        const establishmentsHeader = [
                            {
                                title: "Establishments",
                                url: '/establishment/',
                                id: 0,
                                header: true,
                            },
                        ];
                        const postsHeader = [
                            {
                                title: "Posts",
                                url: '/posts/',
                                id: 0,
                                header: true,
                            },
                        ];
                        foundEstablishments.map(x => {establishmentsHeader.push(x);});
                        foundPosts.map(x => {postsHeader.push(x);});
                        this.setState({suggestions: establishmentsHeader.concat(postsHeader)});
                        this.suggestions = establishmentsHeader.concat(postsHeader);
                    })
                    .catch(err => {
                        if (err.name === 'AbortError') return;
                        console.error("Error:", err)
                    });
            })
            .catch(err => {
                if (err.name === 'AbortError') return;
                console.error("Error:", err)
            });
        return [{title: "Establishments", url: '/establishment/', id: 0, header: true},
                {title: "Posts", url: '/establishment/', id: 0, header: true,}];
    }
    return [];
  };

// Use your imagination to render suggestions.
  renderSuggestion = suggestion => {
    if (suggestion.header){
      return (
      <h6 className="dropdown-header">
        {suggestion.title}
      </h6>);
    }
    return (
      <a className="dropdown-item">
        {suggestion.title}
      </a>);
  };


  onChange = (event, { newValue }) => {
    this.setState({
        value: newValue
    });
  };

  getSuggestionValue = suggestion => {
    if (suggestion.header){
      this.setState({selected: {}});
      return this.state.value;
    }
    this.setState({selected:suggestion});
    this.props.history.push(suggestion.url+suggestion.id+'/');
    return suggestion.title;
  };


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  submitSearch = () => {
      if (!this.state.selected || Object.keys(this.state.selected).length === 0){
          this.setState({suggestions: this.suggestions})
      }
      else {
          this.props.history.push(this.state.selected.url + this.state.selected.id + '/');
      }
  };

  showLoadingOnSearch(){
      if (this.state.loading){
          return (
              <div className="navbarsearchloading">
                  <Loader
                     type="Oval"
                     color="#17a2b8"
                     height={20}
                     width={20}
	                />
              </div>
          );
      }
      return (
          <img
            src="https://webstockreview.net/images/computer-clipart-magnifying-glass-13.png"
            style={{ height: "20px"}}
          />
      );
  }

  displayButton(){
      if (!this.state.selected || Object.keys(this.state.selected).length === 0) {
          return (<button className='btn btn-primary disabled' onClick={this.submitSearch}>
              Go
          </button>);
      }
      return (<button className='btn btn-primary' onClick={this.submitSearch}>
              Go
          </button>);
  }

  render() {
    const topButtonStyle = {
      position: "fixed",
      bottom: "2vh",
      right: "2vw"
    };

    const { value, suggestions } = this.state;

    //Code for theme from here: https://github.com/moroshko/react-autosuggest/issues/64 & https://codepen.io/kornicameister/pen/gXWPoY/
    const theme = {
      container: 'autosuggest border padding',
      input: 'form-control',
      suggestionsContainer: 'dropdown',
      suggestionsList: `dropdown-menu navbarsearchitem ${suggestions.length ? 'show' : ''}`,
      suggestion: '',
      suggestionFocused: 'active',
    };

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: 'Search',
      value,
      onChange: this.onChange
    };

    return (
      <React.Fragment>
        <nav id="theNavBar" className="navbar fixed-top navbar-light bg-light">
          <Link to="/">
            <div className="navbar-brand pacifico">
              <img
                src="https://cdn1.iconfinder.com/data/icons/school-11/100/Meal-512.png"
                className="thumbnail"
              />

              <b>Out to Lunch🥪</b>
            </div>
          </Link>
          <div className="navbarsearch">
              <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                inputProps={inputProps}
                theme={theme}
              />
              {this.showLoadingOnSearch()}
              <button className={`btn btn-primary ${!this.state.selected || Object.keys(this.state.selected).length === 0 ? 'disabled' : ''}`} onClick={this.submitSearch}>
                Go
              </button>
          </div>
          <span className="navbar-text">{this.renderNavButtons()}</span>
        </nav>

        {/*<nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">*/}
        {/*    <a className="navbar-brand" href="#">OutToLunch</a>*/}
        {/*    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"*/}
        {/*            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">*/}
        {/*        <span className="navbar-toggler-icon"></span>*/}
        {/*    </button>*/}
        {/*    <div className="collapse navbar-collapse" id="navbarText">*/}
        {/*        <ul className="navbar-nav mr-auto">*/}
        {/*            {this.renderNavLinks()}*/}
        {/*        </ul>*/}
        {/*        <span className="navbar-text">*/}
        {/*            {this.renderNavButtons()}*/}
        {/*        </span>*/}
        {/*    </div>*/}
        {/*</nav>*/}
        <button
          className="btn btn-info rounded float-right"
          style={topButtonStyle}
          onClick={() => window.scrollTo(0, 0)}
        >Top
        </button>
      </React.Fragment>
    );
  }

  renderNavButtons() {
    const style = {
      margin: "5px"
    };
    return this.props.buttonLinks.map(l => (
      <NavLink
        key={l.id}
        style={style}
        className="btn btn-info rounded"
        to={"/" + l.id}
      >
        {l.text}
      </NavLink>
    ));
  }
}

export default withRouter(NavBar);
