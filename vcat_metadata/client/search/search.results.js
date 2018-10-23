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
    return <div className='searchResults'><h3>No results</h3></div>
  }
  return (
    <div className="searchResults">
      <div className='searchResultsHeading row'>
        <div className='column'>
          <h3>Search Results</h3>
          <small className="subtitle">
            {'Searched 10,523,176 frames from 576,234 videos (took '}{query.timing.toFixed(2)}{' ms)'}
          </small>
        </div>
      </div>
      <Keyframes
        frames={results}
        showHash
        showTimestamp={options.groupByHash}
        showSearchButton
        showSaveButton
        groupByHash={options.groupByHash}
      />
    </div>
  )
}

const mapStateToProps = state => ({
  query: state.search.query.query,
  results: state.search.query.results,
  options: state.search.options,
})

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators({ ...searchActions }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults))
