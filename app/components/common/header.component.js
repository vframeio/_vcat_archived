import React from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import './header.css';

// This is a shared component used by both the VSEARCH and VCAT applications.
// Use <a> tags here instead of <Link> tags, otherwise the navigation will be eaten by react-router when going between apps.

function Header(props) {
  if (props.isAuthenticated || window.location.hostname === '0.0.0.0') {
    return LoggedInHeader(props)
  }
  return LoggedOutHeader(props)
}

function LoggedOutHeader(props){
  return (
    <header className="navbar">
      <section className="navbar-section">
        <a href="/"><img className="menuToggle" alt='logo' src="/static/vframe-logo.png" /></a>
        <a href="/" className="vcat-btn"><b>VCAT</b></a>
      </section>
      <section className="navbar-section last-navbar-section">
        <span className=""><a href="/accounts/login" className="">Login</a></span>
      </section>
    </header>
  )
}
function LoggedInHeader(props){
  return (
    <header className="navbar">
      <section className="navbar-section first-navbar-section">
        <a href="/"><img className="menuToggle" alt='logo' src="/static/vframe-logo.png" /></a>
        <a href="/" className="vcat-btn"><b>VCAT</b></a>
        <a href="/categories/">Categories</a>
        <a href="/images/new/">Upload</a>
        <a href="/search/">Search</a>
      </section>

      <section className="navbar-section last-navbar-section">
        <a href="/stats/hierarchy.html" className="">Stats</a>
        <a href="/help/">Help</a>
        <span className="login-btn logged-in capitalize">
          {props.auth.user.username}
          <a href="/accounts/logout/">Logout</a>
        </span>
        <a href="/groups/user/">My Assignments</a>
      </section>
    </header>
  )
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
