import App from "./components/App.jsx";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";

ReactDOM.render(
	<BrowserRouter>
		<App/>
	</BrowserRouter>,
	document.getElementById("root")
);

