import React, {
  Component,
  PropTypes
} from 'react'
import PoloniexClient from './../lib/poloniex/PoloniexClient'

// Needs comments
export default function PoloniexClientProvider(ComponentToWrap) {
  class ComponentWrapperClass extends Component {
    constructor(props) {
      super(props);
      this.state = {
        poloniexClient: null,
        poloniexError: null
      };
    }
    getChildContext() {
      return {
        retryPoloniexClient: this.retryPoloniexClient.bind(this)
      };
    }
    componentDidMount() {
      this.setState({
        poloniexClient: new PoloniexClient({
          handleMessage: book => this.updateLiveBook(book),
          handleError: errorMsg => this.handleError(errorMsg)
        })
      });
    }
    updateLiveBook(book) {
      this.setState({
        poloniexClient: book
      });
    }
    handleError(errorMsg) {
      this.setState({
        poloniexError: errorMsg
      });
    }
    retryPoloniexClient() {
      this.setState({
        poloniexError: null
      }, () => {
        this.state.poloniexClient.initialize();
      });
    }
    render() {
      return <ComponentToWrap {...this.props } {...this.state } />
    }
  }

  ComponentWrapperClass.childContextTypes = {
    retryPoloniexClient: PropTypes.func
  };

  return ComponentWrapperClass;
}