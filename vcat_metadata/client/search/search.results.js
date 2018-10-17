import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as querystring from 'querystring'

import { timestamp } from '../util'
import { Keyframe } from '../common'
import * as searchActions from './search.actions'
import * as metadataActions from '../metadata/metadata.actions'

import SearchQuery from './search.query'

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
      showFrame
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

class SearchResultsContainer extends Component {
  componentDidMount() {
    const qs = querystring.parse(this.props.location.search.substr(1))
    if (qs && qs.url) {
      this.props.searchActions.search(qs.url)
    } else {
      this.searchByHash()
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params) {
      this.searchByHash()
    }
    // const qsOld = querystring.parse(prevProps.location.search.substr(1))
    // const qsNew = querystring.parse(this.props.location.search.substr(1))
    // if (qsOld && qsNew && qsNew.url && qsNew.url !== qsOld.url) {
    //   this.props.actions.search(qsNew.url)
    // }
  }

  searchByHash() {
    const { verified, hash, frame } = this.props.match.params
    if (verified && hash && frame) {
      this.props.searchActions.searchByVerifiedFrame(verified, hash, frame)
    } else if (hash && frame) {
      this.props.searchActions.searchByFrame(hash, frame)
    }
    if (hash) {
      this.props.metadataActions.fetchMetadata(hash)
    }
  }

  render() {
    const { query, results } = this.props.query
    console.log(query, results)
    return (
      <div>
        <SearchQuery />
        <SearchResults
          {...this.props}
          query={query}
          results={results}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  query: state.search.query,
  options: state.search.options,
  metadata: state.metadata,
})

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators({ ...searchActions }, dispatch),
  metadataActions: bindActionCreators({ ...metadataActions }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResultsContainer))
