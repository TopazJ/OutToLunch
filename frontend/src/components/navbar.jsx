import React, { Component } from "react";

const Navbar = () => {
  return (
    <nav id="theNavBar" class="navbar fixed-top navbar-light bg-light">
      <a class="navbar-brand pacifico" href="#">
        <img
          src="https://cdn1.iconfinder.com/data/icons/school-11/100/Meal-512.png"
          className="thumbnail"
        ></img>
        <b>Out to Lunch🥪</b>
      </a>
      <div class="navbarsearch">
        <form action="/search.php">
          <input
            type="text"
            required
            placeholder="Search Food Places"
            class="padding border"
          />
          <img
            src="https://webstockreview.net/images/computer-clipart-magnifying-glass-13.png"
            style={{ height: "20px" }}
          />

          <button class="btn btn-primary" type="submit">
            Go
          </button>
        </form>
      </div>
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a class="nav-link pacifico" href="#SignIn">
            Log In / Register
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
