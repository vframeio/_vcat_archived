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
    // let status = 'New user'
    // if (total_uploaded_images > 1000){
    //   status = "Super-annotator!"
    // } else if (total_uploaded_images > 250){
    //   status = "VIP (1000+ to become Star Annotator)"
    // } else if (total_uploaded_images > 25){
    //   status = "Validated (upload 250+ to become VIP)"
    // } else {
    //   status = 'n00b (upload 20+ to become a validated annotator)'
    // }

    return (
      <div className='dashboard'>
        <div className="columns">
          <div className="col4 dash-a">
            <div><img className="" alt='logo' src="/static/logo-large.png" /></div>
          </div>
          <div className="col1">
          &nbsp;
          </div>
          <div className="col7">
            <h1>Your Activity</h1>
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
