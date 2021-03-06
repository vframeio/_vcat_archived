import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Classifier, Gate } from '../common'
import * as labels from '../labels'

class Coco extends Component {
  render() {
    const { app, data, summary, showAll } = this.props
    const { metadata, sha256, verified } = data
    const { aspect_ratio: aspectRatio } = app.mediainfo.metadata.mediainfo.video
    console.log(this.props.data)
    return (
      <Classifier
        tag='Coco'
        sha256={sha256}
        verified={verified}
        keyframes={metadata.coco}
        labels={labels.coco}
        summary={summary}
        aspectRatio={aspectRatio}
        showAll={showAll}
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
