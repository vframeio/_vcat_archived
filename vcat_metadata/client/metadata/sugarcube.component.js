import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TableObject, Gate, Video } from '../common'

class Sugarcube extends Component {
  state = {
    playing: false,
  }

  render() {
    const { data, summary } = this.props
    const { playing } = this.state
    const { sugarcube } = data.metadata
    const url = sugarcube.fp.replace('/var/www/files/', 'https://cube.syrianarchive.org/')
    return (
      <div className='sugarcube'>
        <Video />
        {!summary && <TableObject tag='Sugarcube' object={sugarcube} />}
      </div>
    )
  }
}

const mapStateToProps = () => ({
  tag: 'sugarcube',
})

export default connect(mapStateToProps)(props => (
  <Gate View={Sugarcube} {...props} />
))
