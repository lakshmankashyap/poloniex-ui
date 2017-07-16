import React, {
  Component
} from 'react'
import PoloniexLiveBook from './../lib/PoloniexLiveBook'

export default function PoloniexLiveBookProvider(Component) {
  return class extends Component {
    constructor(props) {
      super(props);
      this.state = {
        liveBook: null
      };
    }
    componentDidMount() {
      this.setState({
        liveBook: new PoloniexLiveBook({
          updateBook: (book) => this.updateLiveBook(book)
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