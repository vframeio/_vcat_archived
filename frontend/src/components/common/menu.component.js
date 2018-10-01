import React from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Curtain from './curtain.component'
import actions from '../../actions';
import './menu.css';

function Menu (props) {
  const className = props.nav.menuOpen ? 'menubar open' : 'menubar';
  return (
    <div className={className} onClick={props.actions.closeMenu}>
      <Curtain />
      <div className='sidebar'>
        <ul>
          <li><b>vcat</b></li>
          <li><Link to="/">Index</Link></li>
          <li><Link to="/categories">Taxonomy Browser</Link></li>
          <li><Link to="/images">Images</Link></li>
        </ul>
        <div className='cred'>
          <div>
            <b>vcat</b>
            {' by '}
            <a href="https://vframe.io">vframe.io</a>
          </div>
          <div>
            <Link to="/about/terms">Terms</Link>
            {' · '}
            {props.isAuthenticated
            ? <Link to="/accounts/logout/">Logout</Link>
            : <Link to="/accounts/login/">Login</Link>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  nav: state.nav,
  // user: state.auth.user,
  isAuthenticated: state.auth.isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.nav }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
