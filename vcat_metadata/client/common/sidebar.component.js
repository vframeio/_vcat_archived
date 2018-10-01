import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions'

import ActiveLink from './activeLink.component'

class Sidebar extends Component {
  render() {
    const { hash } = this.props
    if (!hash) {
      return (
        <div className="sidebar">
        </div>
      )
    }
    return (
      <div className="sidebar">
        <h4>Media</h4>
        <NavLink to={'/metadata/' + hash + '/summary/'}>Summary</NavLink>
        <NavLink to={'/metadata/' + hash + '/mediaRecord/'}>Media Record</NavLink>
        <NavLink to={'/metadata/' + hash + '/mediaInfo/'}>Media Info</NavLink>
        <NavLink to={'/metadata/' + hash + '/sugarcube/'}>Sugarcube</NavLink>

        <h4>Keyframes</h4>
        <NavLink to={'/metadata/' + hash + '/keyframe/'}>Keyframe</NavLink>

        <h4>Detectors</h4>
        <NavLink to={'/metadata/' + hash + '/places365/'}>Places 365</NavLink>
        <NavLink to={'/metadata/' + hash + '/coco/'}>Coco</NavLink>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  hash: state.app.hash,
  router: state.router,
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar)
