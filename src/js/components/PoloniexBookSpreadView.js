import React, { Component, PropTypes } from 'react';

/* A React Component for viewing the bid/ask spread of the Poloniex order book
 * @extends Component
 */
export default class PoloniexBookSpreadView extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    let asks = this.props.asks;
    let bids = Object.keys(this.props.bids);
    let highestBid = bids.sort()[bids.length - 1];
    let lowestAsk = Object.keys(asks).sort()[0];
    let dif = (lowestAsk - highestBid).toString();
    return (
      <div className="PoloniexBookSpreadView">
        <div> 
          {dif} Spread
        </div>
      </div>
    );  
  }
}

PoloniexBookSpreadView.propTypes = {
  bids: PropTypes.object.isRequired,
  asks: PropTypes.object.isRequired,
};
