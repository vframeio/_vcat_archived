import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import actions from '../../actions';

class Logout extends Component {
  componentWillMount(props){
    this.props.actions.logout()
  }
  render(){
    return <Redirect to="/" />
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.auth }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
