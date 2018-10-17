import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './review.actions'
import { SearchResults } from '../search'

class ReviewSaved extends Component {
  render() {
    const { saved } = this.props
    const savedResults = Object.keys(saved).forEach(key => {
      const { verified, hash, frames } = saved[key]
      return Object.keys(frames).map(frame => ({
        verified,
        hash,
        frame,
      }))
    }).reduce((a, b) => {
      return (b && b.length) ? a.concat(b) : a
    }, [])
    return (
      <div className="searchImport">
        <div>
          <label>
            <span>Title</span>
            <input type="text" name="title" placeholder="Enter a title" />
          </label>
          <label>
            <span />
            <input type="checkbox" name="graphic" />Graphic content
          </label>
          <label>
            <span />
            <button className='btn create_new_group'>Create New Group</button>
            <button className='btn check'>Check Duplicates</button>
            <button className='btn reset'>Clear Selection</button>
          </label>
        </div>
        <SearchResults
          query
          results={savedResults}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  saved: state.review.saved,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewSaved)
