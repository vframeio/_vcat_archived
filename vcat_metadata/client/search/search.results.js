import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as querystring from 'querystring'

import { Keyframes } from '../common'
import * as searchActions from './search.actions'

function SearchResults({ query, results, options }) {
  if (!query || query.reset || query.loading || !results) {
    return <div></div>
  }
  if (!query.loading && !results.length) {
    return <div>No results</div>
  }
  return (
    <div className="searchResults">
      <Keyframes
        frames={results}
        showHash
        showScore
        showSearchButton
        showSaveButton
      />
    </div>
  )
}

const mapStateToProps = state => ({
  query: state.search.query.query,
  results: state.search.query.results,
})

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators({ ...searchActions }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults))
