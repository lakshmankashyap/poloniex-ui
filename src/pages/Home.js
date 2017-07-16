import React, { Component, PropTypes } from 'react';
import PoloniexLiveBookProvider from './../components/PoloniexLiveBookProvider'

class HomePage extends Component{
	constructor(props) {
		super(props);
		this.state = {};

	}
	renderContent(){
		let book = this.props.liveBook;
		if(book) {
			let state = book.getState();
			return (
				<div className="ProductsPage">
					<div className="Content">
						{this.renderAskBook(state.asks)}
					</div>
				</div>
			);
		}
	}
	renderAskBook(asks){
		return (
			<div className="Book">
				{[...Object.keys(asks)].sort().map((rate) => {
					let amount = asks[rate];
					return (
						<div className="Row" key={rate}>
							{rate} {amount}
						</div>
					);
				})}
			</div>
		);
	}
	render(){

		return (			
				<div className="Home">
					{this.renderContent()}
				</div>
		);
	}
}

HomePage.propTypes = {};

HomePage.contextTypes = {
	actions: PropTypes.object
};

HomePage.childContextTypes = {
	actions: PropTypes.object
};

export default PoloniexLiveBookProvider(HomePage);

