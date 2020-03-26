import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

class NavBar extends Component {
  constructor(props) {
    super(props);
    this.props.initButtons();
  }

  render() {
    const topButtonStyle = {
      position: "fixed",
      bottom: "2vh",
      right: "2vw"
    };

    return (
      <React.Fragment>
        <nav id="theNavBar" className="navbar fixed-top navbar-light bg-light">
          <Link to={"/Homepage"}>
            <div className="navbar-brand pacifico">
              <img
                src="https://cdn1.iconfinder.com/data/icons/school-11/100/Meal-512.png"
                className="thumbnail"
              />

              <b>Out to Lunch🥪</b>
            </div>
          </Link>
          <div className="navbarsearch">
            <form>
              <input
                type="text"
                required
                placeholder="Search Food Places"
                className="padding border"
              />
              <img
                src="https://webstockreview.net/images/computer-clipart-magnifying-glass-13.png"
                style={{ height: "20px" }}
              />

              <button className="btn btn-primary" type="submit">
                Go
              </button>
            </form>
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
        >
          Top
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

export default NavBar;
