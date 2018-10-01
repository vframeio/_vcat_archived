import React from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import actions from '../../actions';
import './header.css';

function Header(props) {
  if (props.isAuthenticated) {
    return LoggedInHeader(props)
  }
  return LoggedOutHeader(props)
}

function LoggedOutHeader(props){
  return (
    <header className="navbar">
      <section className="navbar-section">
        <img onClick={props.actions.openMenu} className="menuToggle" alt='logo' src="/static/vframe-logo.png" />
      </section>
      <section className="navbar-section last-navbar-section">
        <Link to="/accounts/login" className="btn btn-link">login</Link>
      </section>
    </header>
  )
}
function LoggedInHeader(props){
  return (
    <header className="navbar">
      <section className="navbar-section">
        <Link to="/"><img className="menuToggle" alt='logo' src="/static/vframe-logo.png" /></Link>
        <Link to="/categories/" className="btn btn-link">Categories</Link>
        <Link to="/groups/user/" className="btn btn-link">Assignments</Link>
        <Link to="/images/new/" className="btn btn-link">Add Image</Link>
        {props.auth && props.auth.groups && props.auth.groups.staff
        ? <a href="/search/" className="btn btn-link">Import Images</a>
        : null
        }
      </section>

      <section className="navbar-section last-navbar-section">
        <span className="menu-help"><Link to="/static/explore/treemap.html" className="btn btn-link">Explore Data</Link></span>
        <span className="menu-help"><Link to="/guide/" className="btn btn-link">Guide</Link></span>
        <span className="login-out logged-in"><span className="capitalize">{props.auth.user.username}</span></span>
        <span className="logout login-out"><Link to="/accounts/logout/">Logout</Link></span>
      </section>
    </header>
  )
}


const mapStateToProps = (state) => ({
  auth: state.auth,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.nav }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
