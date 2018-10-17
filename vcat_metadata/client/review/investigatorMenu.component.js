import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './review.actions'

class InvestigatorMenu extends Component {
  render() {
    return (
      <div className="importMenu">
        <div>
          <h3>New Investigation</h3>
          <label>
            <span>Title</span>
            <input type="text" name="title" placeholder="Enter a title" />
          </label>
          <label>
            <span />
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

export default connect(mapStateToProps, mapDispatchToProps)(InvestigatorMenu)
