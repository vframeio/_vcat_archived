import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TableObject, Gate } from '../common'

class KeyframeStatus extends Component {
  render() {
    const { metadata } = this.props.data
    return (
      <TableObject tag='Keyframe Status' object={metadata} />
    )
  }
}

const mapStateToProps = () => ({
  tag: 'keyframe_status',
})

export default connect(mapStateToProps)(props => (
  <Gate View={KeyframeStatus} {...props} />
))
