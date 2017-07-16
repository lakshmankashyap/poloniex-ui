import React, { Component, PropTypes } from 'react';
import PoloniexClientProvider from './../components/PoloniexClientProvider'

class Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			scrollSet: false
		};
	}
  componentWillReceiveProps(nextProps) {
    // Wait for book to load, set scroll position once
    if (!this.state.scrollSet) {
      let bookEl = document.getElementById('book');
      let liveBook = nextProps.liveBook;
      if (liveBook) {
        let asksLength = Object.keys(liveBook.getState().asks).length;
        if (bookEl && asksLength) {
          setTimeout(() => {
            bookEl.scrollTop = asksLength * 29.5;
            this.setState({
              scrollSet: true
            });
          });
        }
      }
    }
  }
	renderContent(){
		let liveBook = this.props.liveBook;
		if(liveBook) {
			return (
				<div className="Content FlexRow">
					{this.renderBook(liveBook.getState())}
					{this.renderTradeHistory(liveBook.getTradeHistory())}
				</div>
				
			);
		}
	}
	renderTradeHistory(tradeHistory){
		return (
      <div className="Wrapper">
       <div className="Legend Small">
        <div className="Value">Date</div> 
        <div className="Value">Rate(ETH)</div> 
        <div className="Value">Amount(REP)</div>
        <div className="Value">Total(ETH)</div> 
        </div>
			<div className="TradeHistory">
				  {[...tradeHistory].map((trade, i) => {
            let isBuy = trade.type == 'buy';
            let getDate = d => {
              let month = d.getUTCMonth() + 1;
              let day = d.getUTCDate();
              let year = d.getUTCFullYear();
              let hours = d.getHours();
              let mins = d.getUTCMinutes();
              let seconds = d.getUTCSeconds();
              hours = (hours.toString().length == 1 ? '0' : '') + hours;
              mins = (mins.toString().length == 1 ? '0' : '') + mins;
              seconds = (seconds.toString().length == 1 ? '0' : '') + seconds;
              return `${month}/${day}/${year} ${hours}:${mins}:${seconds}`;
            };

            let date = getDate(new Date(trade.date))
            return (

              <div className={"Row Small"} key={i}>
                <div className="Value">{date}</div> 
                <div className={`Value ${isBuy ? 'Buy': 'Sell' }`}>{isBuy ? '↑' : '↓'}&nbsp;{trade.rate}</div> 
                <div className="Value">{trade.amount}</div>
                <div className="Value">{trade.rate}</div> 
                {(() => {
                  if(i == 0 && !this.props.isMobile) {
                    return (
                      <div className="Latest">Latest</div>
                    );
                  }
                })()}
              </div>
            );
          })}
			</div>
      </div>
		);
	}
	renderBook(book){
		return (
			<div className="Wrapper">
				<div className="Legend">
					<div className="Value">Rate(ETH)</div> 
          <div className="Value">Amount(REP)</div>
				</div>
				<div className="Book" id="book">
					{this.renderAskBook(book.asks)}
          {this.renderSpread(book.bids, book.asks)}
          {this.renderBidBook(book.bids)}
				</div>
			</div>
		);
	}
	renderBidBook(bids){
		return (
			<div className="BookSide">
				{[...Object.keys(bids)].map((rate) => {
					let amount = bids[rate];
					return (
						<div className="Row Bid" key={rate}>
							<div className="Value">{rate}</div> 
              <div className="Value">{amount}</div>
						</div>
					);
				})}
			</div>
		);
	}
  renderSpread(bids, asks){
    bids = [...Object.keys(bids)];
    let highestBid = bids.sort()[bids.length - 1];
    let lowestAsk = [...Object.keys(asks)].sort()[0];

    if(highestBid && lowestAsk) {
      let dif = (lowestAsk - highestBid).toString();
      return (
        <div className="Spread">
          <div> 
            {dif} Spread
          </div>
        </div>
      );  
    }
    
  }
	renderAskBook(asks){
		return (
			<div className="BookSide">
				{[...Object.keys(asks)].sort((a, b) => parseFloat(a) > parseFloat(b) ? 1 : -1)
          .reverse().map((rate) => {
					let amount = asks[rate];
					return (
						<div className="Row Ask" key={rate}>
							<div className="Value">{rate}</div> 
              <div className="Value">{amount}</div>
						</div>
					);
				})}
			</div>
		);
	}
	render(){

		return (			
				<div className="Dashboard">
					{this.renderContent()}
				</div>
		);
	}
}

Dashboard.propTypes = {};

Dashboard.contextTypes = {
	actions: PropTypes.object
};

Dashboard.childContextTypes = {
	actions: PropTypes.object
};

export default PoloniexClientProvider(Dashboard);

