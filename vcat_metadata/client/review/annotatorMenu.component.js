import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './review.actions'

class AnnotatorMenu extends Component {
  render() {
    return (
      <div className="importMenu">
        <div>
          <h3>Investigation</h3>
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

export default connect(mapStateToProps, mapDispatchToProps)(AnnotatorMenu)
