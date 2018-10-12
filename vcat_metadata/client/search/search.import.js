import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './search.actions'

class SearchImport extends Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  fetch(hash) {
  }

  render() {
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
      </div>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchImport)
