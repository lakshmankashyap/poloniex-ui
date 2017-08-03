import React, { Component, PropTypes } from 'react'

export default class ErrorMsg extends Component {
  render() {
    return (
	  <p className="ErrorMsg">{this.props.errorMsg}</p>
    );
  }
}

ErrorMsg.propTypes = {
  errorMsg: PropTypes.string.isRequired
};