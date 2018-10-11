import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
import actions from '../../actions';

// import apiClient from '../../util/apiClient';
import axios from 'axios';

class Signup extends Component {
  constructor(props){
    super()
    console.log('signup form')

    const form = document.querySelector('.prefab form');
    form.addEventListener('submit', function(e){
      e.preventDefault()
      const data = new FormData(form);
      console.log('submit!')
      let username, password;
      for (let pair of data.entries()) {
        if (pair[0] === 'username') username = pair[1];
        if (pair[0] === 'password1') password = pair[1];
      }
      if (! username || ! password) return;
      axios.post('/accounts/signup/', data).then((response) => {
        console.log("THEN!")
        console.log(response.request.responseURL)
        if (response.request.responseURL.indexOf("profile") !== -1
          || response.headers['content-length'] === 0) {
          props.actions.login(username, password);
        }
      }).catch( (error) => {
        console.error('errrror!')
        console.log(props.actions)
        props.actions.login(username, password);
        setTimeout(window.location.reload, 1000)
      })
    })
  }
  render(){
    if (this.props.auth.isAuthenticated) {
      window.location.href = "/";
    }
    return <div></div>
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.auth }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
