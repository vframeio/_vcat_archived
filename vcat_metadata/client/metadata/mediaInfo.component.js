import React, { Component } from 'react'
import { connect } from 'react-redux'

import { TableObject, Gate } from '../common'

class MediaInfo extends Component {
  render() {
    const { data, summary } = this.props
    const { audio, video } = data.metadata.mediainfo
    let tables = []
    if (video) {
      tables.push(
        <TableObject
          key='video'
          tag='mediaInfo: video'
          object={video}
          order={['width', 'height', 'encoded_date', 'tagged_date', 'frame_count', 'frame_rate', 'aspect_ratio', 'duration']}
          summary={summary}
        />
      )
    }
    if (audio) {
      tables.push(
        <TableObject
          key='audio'
          tag='mediaInfo: audio'
          object={audio}
          order={['codec', 'encoded_date']}
          summary={summary}
        />
      )
    }
    return (
      <div>
        {tables || <div>No media info found</div>}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  tag: 'mediainfo',
})

export default connect(mapStateToProps)(props => (
  <Gate View={MediaInfo} {...props} />
))
