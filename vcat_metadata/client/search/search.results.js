import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as querystring from 'querystring'

import { Keyframe } from '../common'
import * as actions from './search.actions'

function SearchQuery({ query }) {
  if (!query) return null
  if (query.loading) {
    return <div>Loading...</div>
  }
  console.log(query)
  return (
    <div className="searchQuery">
      Results for:
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

  componentDidUpdate() {
  }

  render() {
    const { query, results } = this.props.query
    console.log(query, results)
    const searchResults = results && results.map(result => (
      <Keyframe
        key={result.hash + '_' + result.frame}
        sha256={result.hash}
        frame={result.frame}
      />
    ))
    return (
      <div>
        <SearchQuery query={query} />
        <div className="searchResults">
          {searchResults}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  query: state.search.query,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SearchResults))
