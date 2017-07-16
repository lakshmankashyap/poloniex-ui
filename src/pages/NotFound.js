import React, { Component, PropTypes } from 'react';

export default class NotFoundPage extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render(){
		return (
			<div className="Content">
				Not Found Page
			</div>	
		);
	}
}

NotFoundPage.propTypes = {};

NotFoundPage.childContextTypes = {};

