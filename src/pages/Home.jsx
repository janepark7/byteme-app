import "./Home.scss";
import React, { Component } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

class Home extends Component {
	render() {
		return (
			<div className="Intro-text">

				<h1>Byte Me!</h1>

				<div className="home-body">
				Welcome to Byte Me! If you own a food establishment and want to
				put your business out there, sign up for an account!
				</div>
			</div>
		);
	}
}

export default Home;
