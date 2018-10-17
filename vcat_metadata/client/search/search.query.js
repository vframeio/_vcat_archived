import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { timestamp } from '../util'
import * as searchActions from './search.actions'
import SearchMeta from './search.meta'

class SearchQuery extends Component {
  render() {
    const { query } = this.props.query
    if (!query) return null
    if (query.loading) {
      return <div className="searchQuery">Loading results...</div>
    }
    return (
      <div className="searchQuery">
        <SearchMeta query={query} />
        <div>
          <img src={query.url} />
        </div>
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
  actions: bindActionCreators({ ...searchActions }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchQuery)
