import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './review.actions'

class AnnotatorMenu extends Component {
  render() {
    return (
      <div className="importMenu">
        <div>
          <h3>New VCAT Image Group</h3>
          <label>
            <input type="text" name="title" placeholder="Title this group" />
          </label>
          <label>
            <input type="checkbox" name="graphic" /> <small>Graphic content</small>
          </label>
          <label>
            <button className='btn check'>Check Dupes</button>
            <button className='btn create_new_group'>Create New Group</button>
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
