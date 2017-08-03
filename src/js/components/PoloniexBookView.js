import React, { Component, PropTypes } from 'react';
import PoloniexBookSpreadView from './PoloniexBookSpreadView'
import PoloniexBookSideView from './PoloniexBookSideView'

/* A React Component for viewing a single side of the Poloniex order book
 * Entries are ordered by price, highest to lowest
 * @extends Component
 */
export default class PoloniexBookView extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.scrollToSpread(this.props.book);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isMobile != this.props.isMobile) {
      this.scrollToSpread(nextProps.book);  
    }
  }
  // Scroll to the end of the asks book
  scrollToSpread(book){
    let bookEl = document.getElementById('book');
    if(bookEl && book) {
      let asksLength = Object.keys(book.asks).length;
      if (asksLength) bookEl.scrollTop = asksLength * 29.5;
    }
  }
  render() {
  	let book = this.props.book
    return (
      <div className="PoloniexBookView">
      	<div className="Legend">
  		    <div className="Value">Rate(ETH)</div> 
  	      <div className="Value">Amount(REP)</div>
		    </div>
	    <div className="Book" id="book">
        <PoloniexBookSideView entries={book.asks} side="Ask"/>
        <PoloniexBookSpreadView asks={book.asks} bids={book.bids} />
        <PoloniexBookSideView entries={book.bids} side="Bid"/>
		  </div>
	  </div>
    );
  }
}

PoloniexBookView.propTypes = {
  book: React.PropTypes.object,
  isMobile: React.PropTypes.bool
};
