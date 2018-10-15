import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './metadata.actions'

class Heading extends Component {
  componentDidMount() {
    const { hash } = this.props.match.params
    this.fetch(hash)
  }

  componentDidUpdate(prevProps) {
    const { hash } = this.props.match.params
    const { hash: prevHash } = prevProps.match.params
    if (hash && hash !== prevHash) {
      this.fetch(hash)
    }
  }

  fetch(hash) {
    this.props.actions.setHash(hash)
    this.props.actions.fetchMediaRecord(hash)
    this.props.actions.fetchMetadata(hash)
  }

  render() {
    return (
      <span className='sha256'>
        {'sha256: '}{this.props.hash}
      </span>
    )
  }
}

const mapStateToProps = state => ({
  hash: state.metadata.hash
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Heading)
