import React, { Component } from 'react'
import { connect } from 'react-redux'
import { imageUrl, widths } from '../util'

import { Gate } from '.'

class Video extends Component {
  state = {
    playing: false,
  }

  render() {
    const { app, data, size } = this.props
    const { playing } = this.state
    const { sugarcube } = data.metadata
    console.log(data.metadata)
    const url = sugarcube.fp.replace('/var/www/files/', 'https://cube.syrianarchive.org/')
    const { sha256, verified } = app.mediainfo
    const { video } = app.mediainfo.metadata.mediainfo
    const keyframe = app.keyframe.metadata.keyframe.basic[0]
    console.log(keyframe)
    return (
      <div className='video'>
        {playing
          ? <video src={url} autoPlay controls />
          : <div
              className='bg'
              style={{
                width: widths[size || 'sm'],
                height: widths[size || 'sm'] / video.aspect_ratio,
                backgroundImage: 'url(' + imageUrl(verified, sha256, keyframe, size) + ')',
              }}
              onClick={() => this.setState({ playing: true })}
            >
              <div className='play'></div>
            </div>
        }
      </div>
    )
  }
}

const mapStateToProps = () => ({
  tag: 'sugarcube',
})

export default connect(mapStateToProps)(props => (
  <Gate View={Video} {...props} />
))
