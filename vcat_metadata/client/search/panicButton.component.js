import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './search.actions'

class PanicButton extends Component {
  constructor() {
    super()
    this.keydown = this.keydown.bind(this)
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keydown)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.keydown)
  }

  keydown(e) {
    if (e.keyCode === 27) {
      this.panic()
    }
  }

  panic() {
    this.props.actions.panic()
    this.props.history.push('/search/')
  }

  render() {
    return (
      <button className='btn panic' onClick={() => this.panic()}>
        <span>⚠</span> Panic
      </button>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ panic: actions.panic }, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PanicButton))
