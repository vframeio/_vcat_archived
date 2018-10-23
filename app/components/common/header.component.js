import React from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './header.css';

function Header(props) {
  if (props.isAuthenticated || window.location.hostname === '5.k') {
    return LoggedInHeader(props)
  }
  return LoggedOutHeader(props)
}

function LoggedOutHeader(props){
  return (
    <header className="navbar">
      <section className="navbar-section">
        <Link to="/"><img className="menuToggle" alt='logo' src="/static/vframe-logo.png" /></Link>
        <Link to="/" className="vcat-btn"><b>VCAT</b></Link>
      </section>
      <section className="navbar-section last-navbar-section">
        <span className=""><Link to="/accounts/login" className="">Login</Link></span>
      </section>
    </header>
  )
}
function LoggedInHeader(props){
  return (
    <header className="navbar">
      <section className="navbar-section first-navbar-section">
        <Link to="/"><img className="menuToggle" alt='logo' src="/static/vframe-logo.png" /></Link>
        <Link to="/" className="vcat-btn"><b>VCAT</b></Link>
        <Link to="/categories/" className="">Categories</Link>
        <Link to="/images/new/" className="">Upload</Link>
        <a href="/search/" className="">Search</a>
      </section>

      <section className="navbar-section last-navbar-section">
        <Link to="/static/explore/hierarchy.html" className="">Stats</Link>
        <Link to="/help/" className="">Help</Link>
        <span className="login-btn logged-in capitalize">
          {props.auth.user.username}
          <Link to="/accounts/logout/">Logout</Link>
        </span>
        <Link to="/groups/user/" className="">My Assignments</Link>
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
