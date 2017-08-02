import React, { Component, PropTypes } from 'react';

/* A React Component for viewing the trade history of Poloniex
 * @extends Component
 */
export default class PoloniexTradeHistoryView extends Component {
  constructor(props) {
    super(props);
  }
  renderTrade(trade, index){
    let isBuy = trade.type == 'buy';
    let date = trade.date;
    return (
      <div className={"Row Small"} key={index}>
        <div className="Value">{date}</div> 
        <div className={`Value ${isBuy ? 'Buy': 'Sell' }`}>{isBuy ? '↑' : '↓'}&nbsp;{trade.rate}</div> 
        <div className="Value">{trade.amount}</div>
        <div className="Value">{trade.rate}</div> 
        {(() => {
          if(index == 0 && !this.props.isMobile) {
            return (
              <div className="Latest">Latest</div>
            );
          }
        })()}
      </div>
    );
  }
  render(){
    return (
      <div className="PoloniexTradeHistoryView">
        <div className="Legend Small">
          <div className="Value">Date</div>
          <div className="Value">Rate(ETH)</div>
          <div className="Value">Amount(REP)</div>
          <div className="Value">Total(ETH)</div>
        </div>
        <div className="TradeHistory">
          {this.props.tradeHistory.map((trade, index) => this.renderTrade(trade, index))}
        </div>
      </div>
    );
  }
}

PoloniexTradeHistoryView.propTypes = {
  tradeHistory: PropTypes.array.isRequired,
  isMobile: PropTypes.bool.isRequired
};
