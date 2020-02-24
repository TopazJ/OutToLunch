import React, { Component } from "react";
import {NavLink} from "react-router-dom";

class NavBar extends Component {
    constructor(props){
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
                <nav className="navbar navbar-expand-lg navbar navbar-dark bg-dark">
                    <a className="navbar-brand" href="#">OutToLunch</a>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText"
                            aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarText">
                        <ul className="navbar-nav mr-auto">
                            {this.renderNavLinks()}
                        </ul>
                        <span className="navbar-text">
                            {this.renderNavButtons()}
                        </span>
                    </div>
                </nav>
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

    renderNavLinks() {
        return this.props.navLinks.map(l => (
            <li className="nav-item" key={l.id}>
                 <a
                    className="nav-link"
                    href={"/" + "#" + l.id}
                 >
                {l.text}
                </a>
            </li>

        ));
    }

    renderNavButtons() {
        const style = {
          margin:'5px'
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