import React, { Component } from 'react';
import { connect } from 'react-redux';

import StaffDashboard from './staffDashboard.component'
import UserDashboard from './userDashboard.component'
import LoggedOutDashboard from './loggedOutDashboard.component'

class DashboardIndex extends Component {
  render(){
    if (this.props.auth.groups.staff) {
      return <StaffDashboard {...this.props} />
    }
    if (this.props.auth.isAuthenticated) {
      return <UserDashboard {...this.props} />
    }
    return <LoggedOutDashboard {...this.props} />
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DashboardIndex);
