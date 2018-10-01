import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

function Header(props) {
  return (
    <header>
      <section className="navbar-section">
        <a href="/"><img className="menuToggle" alt='logo' src="/search/static/css/vframe-logo.png" /></a>
        <a href="/categories/">Categories</a>
        <a href="/groups/user/">Assignments</a>
        <a href="/images/new/">Add Image</a>
      </section>

      <section className="navbar-section last-navbar-section">
        <span className="menu-help"><a href="/explorer/">Explore Data</a></span>
        <span className="menu-help"><a href="/guide/">Guide</a></span>
        <span className="login-out logged-in"><span className="capitalize"></span></span>
        <span className="logout login-out"><a href="/accounts/logout/">Logout</a></span>
      </section>
    </header>
  );
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
