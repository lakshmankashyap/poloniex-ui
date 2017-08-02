import React, { Component } from 'react'
import PoloniexClient from './../lib/poloniex/PoloniexClient'

// Needs comments
export default function PoloniexClientProvider(WrappedComponent) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        liveBook: null
      };
    }
    componentDidMount() {
      this.setState({
        liveBook: new PoloniexClient({
          handleMessage: book => this.updateLiveBook(book),
          handleError: errorMsg => this.handleError(errorMsg)
        })
      });
    }
    updateLiveBook(book) {
      this.setState({
        liveBook: book
      });
    }
    handleError(errorMsg) {
      console.log(errorMsg);
    }
    render() {
      return <WrappedComponent {...this.props } {...this.state } />
    }
  }
}
