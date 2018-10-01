import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TableObject } from '../common'

class MediaRecord extends Component {
  render() {
    return (
      <TableObject tag='mediaRecord' object={this.props.mediaRecord} />
    )
  }
}

const mapStateToProps = state => ({
  mediaRecord: state.app.mediaRecord,
})

export default connect(mapStateToProps)(MediaRecord)
