import React from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import actions from '../../actions';

function ForgotPassword(props) {
  return (
    <div>ForgotPassword</div>
  );
}

const mapStateToProps = (state) => ({
  // user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.auth }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
