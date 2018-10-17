import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as querystring from 'querystring'

import { Keyframe } from '../common'
import * as searchActions from './search.actions'

function SearchResults({ query, results, options }) {
  if (!query || query.reset || query.loading || !results) {
    return <div></div>
  }
  if (!query.loading && !results.length) {
    return <div>No results</div>
  }
  const searchResults = results.map(({ hash, frame, distance }) => (
    <Keyframe
      key={hash + '_' + frame}
      sha256={hash}
      frame={frame}
      size={options.thumbnailSize}
      to={searchActions.publicUrl.browse(hash)}
      showHash
      showTimestamp
    >
      <label className='searchButtons'>
        <Link
          to={searchActions.publicUrl.searchByFrame(hash, frame)}
          className='btn'
        >
          Search
        </Link>
        <button
          className='btn'
        >
          Save
        </button>
      </label>
    </Keyframe>
  ))
  return (
    <div className="searchResults row">
      {searchResults}
    </div>
  )
}

const mapStateToProps = state => ({
  query: state.search.query.query,
  results: state.search.query.results,
  options: state.search.options,
  metadata: state.metadata,
})

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators({ ...searchActions }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults))
