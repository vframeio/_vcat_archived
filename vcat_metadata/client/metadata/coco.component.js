import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Classifier, Gate } from '../common'
import * as labels from '../labels'

class Coco extends Component {
  render() {
    const { app, data, summary } = this.props
    const { metadata, sha256 } = data
    const { aspect_ratio: aspectRatio } = app.mediainfo.metadata.mediainfo.video
    console.log(this.props.data)
    return (
      <Classifier
        tag='Coco'
        sha256={sha256}
        keyframes={metadata.coco}
        labels={labels.coco}
        summary={summary}
        aspectRatio={aspectRatio}
      />
    )
  }
}

const mapStateToProps = () => ({
  tag: 'coco',
})

export default connect(mapStateToProps)(props => (
  <Gate View={Coco} {...props} />
))
