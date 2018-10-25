import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from '../../actions';

import ImageGroupBrowser from '../imageGroup/imageGroupBrowser.component'
import UserStats from './userStats.component'

class UserDashboard extends Component {
  constructor(props){
    super(props)
    if (props.auth.isAuthenticated) {
      props.actions.hierarchy.index()
    }
  }
  render(){
    let { auth } = this.props
    console.log(auth)
    return (
      <div className='dashboard'>
        <div className="columns">
          <div className="col7">
            <UserStats />
            <ul className="user-tasks">
              <li><Link to="/images/user/"><button className="btn">View Your Images</button></Link></li>
              <li><Link to="/images/new/"><button className="btn">Add New Image</button></Link></li>
            </ul>
          </div>
        </div>
        <br/><br/>

        <ImageGroupBrowser
          userView
          limit={10}
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
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators({ ...actions.image }, dispatch),
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
