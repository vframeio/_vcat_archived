import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
// import { Link } from 'react-router-dom'
import actions from '../../actions'

import ImageGroupBrowser from './imageGroupBrowser.component'

class UserGroupBrowser extends Component {
  constructor(props){
    super(props)
    props.actions.user.index()
    props.actions.hierarchy.index()
  }
  render(){
    return (
      <div className='dashboard'>
        <ImageGroupBrowser
          userView
          title="Your Assignments"
          location={this.props.location}
        />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  auth: state.auth,
  user: state.user,
  hierarchy: state.hierarchy,
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    user: bindActionCreators({ ...actions.user }, dispatch),
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(UserGroupBrowser);


