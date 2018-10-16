import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as querystring from 'querystring'

import { Keyframe } from '../common'
import * as actions from './search.actions'

function SearchQuery({ query }) {
  if (!query) return null
  if (query.loading) {
    return <div className="searchQuery">Loading results...</div>
  }
  return (
    <div className="searchQuery">
      <img src={query.url} />
    </div>
  )
}

function SearchResults({ query, results, options }) {
  if (!query || query.loading || !results) {
    return <div></div>
  }
  if (!results.length) {
    return <div>No results</div>
  }
  const searchResults = results.map(result => (
    <Keyframe
      key={result.hash + '_' + result.frame}
      sha256={result.hash}
      frame={result.frame}
      size={options.thumbnailSize}
      to={'/search/?url=' + encodeURIComponent(result.url)}
    >
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
      this.props.actions.search(qs.url)
    }
    const { hash, frame } = this.props.match.params
    console.log(hash, frame)
    if (hash && frame) {
      this.props.actions.searchByFrame(hash, frame)
    }
  }

  // componentDidUpdate(prevProps) {
  //   const qsOld = querystring.parse(prevProps.location.search.substr(1))
  //   const qsNew = querystring.parse(this.props.location.search.substr(1))
  //   if (qsOld && qsNew && qsNew.url && qsNew.url !== qsOld.url) {
  //     this.props.actions.search(qsNew.url)
  //   }
  // }

  render() {
    const { query: q, options } = this.props
    const { query, results } = q
    // console.log(query, results)
    return (
      <div>
        <SearchQuery query={query} />
        <SearchResults query={query} results={results} options={options} />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  query: state.search.query,
  options: state.search.options,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResultsContainer))
