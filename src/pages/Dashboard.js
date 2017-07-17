import React, { Component, PropTypes } from 'react';
import PoloniexClientProvider from './../components/PoloniexClientProvider'
import Select from 'react-select';

class Dashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
			scrollSet: false,
      section: 'orders'
		};
	}
  componentWillReceiveProps(nextProps) {
    // Wait for book to load, set scroll position once
    // Scroll to spread when mobile changes
    if (!this.state.scrollSet || nextProps.isMobile != this.props.isMobile) {
      this.scrollToSpread(nextProps.liveBook);  
    }
  }
  scrollToSpread(liveBook){
    let bookEl = document.getElementById('book');
    if(bookEl && liveBook) {
      let asksLength = Object.keys(liveBook.getState().asks).length;
      if (asksLength) {
        setTimeout(() => {
          bookEl.scrollTop = asksLength * 29.5;
          this.setState({
            scrollSet: true
          });
        });
      }
    }
  }
  toggleSection(){
    let section = this.state.section == 'orders' ?'trades' : 'orders'
    this.setState({ section },
      () => {
        if(section == 'orders') this.scrollToSpread(this.props.liveBook);
      });
  }
	renderContent(){
		let liveBook = this.props.liveBook;
		if(liveBook) {

      if(this.props.isMobile) {
        return (
          <div className="Content">
            {this.renderNavigation()}
            <div className="FlexContainer">
              {this.state.section == 'orders' ? this.renderBook(liveBook.getState()) : this.renderTradeHistory(liveBook.getTradeHistory())}              
            </div>
          </div>  
        );

      } else {
        return (
          <div className="Content">
            {this.renderNavigation()}
            <div className="FlexContainer">
              {this.renderBook(liveBook.getState())}
              {this.renderTradeHistory(liveBook.getTradeHistory())}
            </div>
          </div>
        );
      }
		}
	}
  renderNavigation() {
    return (
      <nav className='FlexRow' >
        <div className="Menu" style={{flexWrap: 'colum-reverse' }}>
          {(() => {
            if(this.props.isMobile) {
                return (
                  <div className="Flex1 Title">
                    {this.state.section == 'orders' ? 'Orders (ETH/REP)' : 'Trade History'}
                  </div>
                );
            } else {
              return [
                <div className="Flex1 Title" key={0}>
                  Orders (ETH/REP)
                </div>,
                <div className="Flex1 Title" key={1}>
                  Trade History
                </div>
              ];
            }

          })()}
        </div>
        <div className="Toggle" onClick={() => this.toggleSection()}>
          {this.state.section == 'orders' ? 'Show Trades' : 'Show Orders'}
        </div>
      </nav>  
    );
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
            let date = trade.date

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
				{[...Object.keys(bids)].sort((a, b) => parseFloat(a) < parseFloat(b) ? 1 : -1)
          .map((rate) => {
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
				{[...Object.keys(asks)].sort((a, b) => parseFloat(a) < parseFloat(b) ? 1 : -1)
          .map((rate) => {
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

