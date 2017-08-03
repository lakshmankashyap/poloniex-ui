import React, { Component, PropTypes } from 'react';
import PoloniexClientProvider from './../components/PoloniexClientProvider'
import PoloniexTradeHistoryView from './../components/PoloniexTradeHistoryView'
import PoloniexBookView from './../components/PoloniexBookView'
import Loader from './../components/Loader'
import ErrorMsg from './../components/ErrorMsg'

/* A React component for viewing Poloniex trades
 * and the current ask/bid books
 * @extends Component
 */
class PoloniexDashboard extends Component{
	constructor(props) {
		super(props);
		this.state = {
      section: 'orders'
		};
	}
  toggleSection(){
    let section = this.state.section == 'orders' ? 'trades' : 'orders';
    this.setState({ section }, () => {
      if(section == 'orders') this.scrollToSpread(this.props.poloniexClient);
    });
  }
	renderContent(){
    if(this.props.poloniexError) {
      return (
        <div className="ErrorContainer">
          <div>
            <ErrorMsg errorMsg="Failed to connect to client" />
            <ErrorMsg errorMsg={this.props.poloniexError} />
            <div className="ReconnectButton" onClick={() => this.context.retryPoloniexClient()}>
              Try Again
            </div>
          </div>
        </div>
      );
    }

		let poloniexClient = this.props.poloniexClient;
		if(!poloniexClient || poloniexClient.loading) {
      return (
        <Loader />
      );
    }

    if(this.props.isMobile) {
      return (
        <div className="Content">
          {this.renderNavigation()}
          <div className="FlexContainer">
            {(() => {
              switch(this.state.section) {
                case 'orders':
                  return this.renderOrderBook(poloniexClient.getState());
                break;
                case 'trades':
                  return this.renderTradeHistory(poloniexClient.getTradeHistory());
                break;
                default:
                  return this.renderOrderBook(poloniexClient.getState());
              }
            })()}
          </div>
        </div>  
      );
    } 

    return (
      <div className="Content">
        {this.renderNavigation()}
        <div className="FlexContainer">
          {this.renderOrderBook(poloniexClient.getState())}
          {this.renderTradeHistory(poloniexClient.getTradeHistory())}
        </div>
      </div>
    );
	}
  renderNavigation() {
    return (
      <nav className="FlexRow">
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
      <div className="SectionWrap">
        <PoloniexTradeHistoryView tradeHistory={tradeHistory} 
                                  isMobile={this.props.isMobile}/>
      </div>
    );
	}
	renderOrderBook(book){
		return (
			<div className="SectionWrap">
				<PoloniexBookView book={book}
                          isMobile={this.props.isMobile}/>
			</div>
		);
	}
	render(){
		return (			
				<div className="PoloniexDashboard">
					{this.renderContent()}
				</div>
		);
	}
}

PoloniexDashboard.propTypes = {
  isMobile: PropTypes.bool.isRequired,
  poloniexClient: PropTypes.object,
  poloniexError: PropTypes.string
};

PoloniexDashboard.contextTypes = {
  retryPoloniexClient: PropTypes.func.isRequired
}

// Compose PoloniexDashboard with provider and export
export default PoloniexClientProvider(PoloniexDashboard);
