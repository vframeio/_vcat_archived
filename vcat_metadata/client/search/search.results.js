import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './search.actions'

class SearchResults extends Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  fetch(hash) {
  }

  render() {
    return (
      <div className="searchResults">
      </div>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults)
