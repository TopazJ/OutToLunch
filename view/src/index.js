import App from "./components/App.jsx";

import React from "react";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";

let host;
if (window.location.hostname === "127.0.0.1") {
	host = "http://" + window.location.hostname + ":8000";
}
else{
	host = "http://" + window.location.hostname;
}



ReactDOM.render(
	<BrowserRouter>
		<App url={host} />
	</BrowserRouter>,
	document.getElementById("root")
);

