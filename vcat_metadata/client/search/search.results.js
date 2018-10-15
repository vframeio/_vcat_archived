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

class SearchResults extends Component {
  componentDidMount() {
    const qs = querystring.parse(this.props.location.search.substr(1))
    if (qs && qs.url) {
      this.props.actions.search(qs.url)
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
    const { query, results } = this.props.query
    const searchResults = results && results.map(result => (
      <Keyframe
        key={result.hash + '_' + result.frame}
        sha256={result.hash}
        frame={result.frame}
        size={this.props.options.thumbnailSize}
        to={'/search/?url=' + encodeURIComponent(result.url)}
      >
      </Keyframe>
    ))
    return (
      <div>
        <SearchQuery query={query} />
        <div className="searchResults row">
          {searchResults}
        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults))
