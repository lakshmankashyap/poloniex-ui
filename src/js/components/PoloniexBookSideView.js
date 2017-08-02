import React, { Component, PropTypes } from 'react';

/* A React Component for viewing a single side of the Poloniex order book
 * Entries are ordered by price, highest to lowest
 * @extends Component
 */
export default class PoloniexBookSideView extends Component {
  constructor(props) {
    super(props);
  }
  renderBookEntry(rate, amount) {
    return (
      <div className={`Row ${this.props.side}`} key={rate}>
        <div className="Value">{rate}</div> 
        <div className="Value">{amount}</div>
      </div>
    );
  }
  render() {
    let entries = this.props.entries;
    let entryRates = Object.keys(entries)
      .sort((a, b) => parseFloat(a) < parseFloat(b) ? 1 : -1);
    return (
      <div className="BookSide">
        {entryRates.map((rate) => this.renderBookEntry(rate, entries[rate]))}
      </div>
    );
  }
}

PoloniexBookSideView.propTypes = {
  entries: PropTypes.object.isRequired,
  side: PropTypes.string.isRequired
};
