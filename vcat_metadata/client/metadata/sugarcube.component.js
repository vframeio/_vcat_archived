import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TableObject, Gate } from '../common'

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
      <div>
        <div className='video'>
          {playing
            ? <video src={url} autoplay controls />
            : <div></div>}
        </div>
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
