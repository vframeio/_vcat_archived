import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Classifier, Gate } from '../common'
import * as labels from '../labels'

class Places365 extends Component {
  render() {
    const { data, summary } = this.props
    const { metadata, sha256 } = data
    console.log(this.props.data)
    return (
      <Classifier
        tag='Places365'
        sha256={sha256}
        keyframes={metadata.places365}
        labels={labels.places365}
        summary={summary}
      />
    )
  }
}

const mapStateToProps = () => ({
  tag: 'places365',
})

export default connect(mapStateToProps)(props => (
  <Gate View={Places365} {...props} />
))
