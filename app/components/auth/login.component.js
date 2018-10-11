import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
// import { Link } from 'react-router-dom';
import actions from '../../actions';

import { FormField, SubmitField } from '../common/formField.component';

class Login extends Component {
  constructor() {
    super()
    this.state = {}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value,
      error: null,
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.actions.login(this.state.username, this.state.password)
  }
  renderAuthError(){
    if (this.props.auth.error) {
      return (
        <div className='form-input-hint'>{"There was an error logging you in (bad password?)"}</div>
      )
    }
    return null
  }
  render(){
    if (this.props.auth.isAuthenticated) {
      return <Redirect to="/" />
    }
    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <h2>Login</h2>
          <FormField
            autoFocus
            autoCapitalize="off"
            label="Username"
            name="username"
            type="text"
            value={this.state.username}
            onChange={this.handleChange}
          />
          <FormField
            label="Password"
            name="password"
            type="password"
            value={this.state.password}
            onChange={this.handleChange}
          />
          <SubmitField
            label='Login'
            loading={this.props.auth.loading}
          />
          {this.renderAuthError()}
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.auth }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
