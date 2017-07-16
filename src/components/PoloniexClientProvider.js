import React, {
  Component
} from 'react'
import PoloniexClient from './../lib/PoloniexClient'

export default function PoloniexClientProvider(Component) {
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
          updateBook: book => this.updateLiveBook(book)
        })
      });
    }
    updateLiveBook(book) {
      this.setState({
        liveBook: book
      });
    }
    render() {
      return <Component {...this.props } {...this.state }
      />
    }
  }
}