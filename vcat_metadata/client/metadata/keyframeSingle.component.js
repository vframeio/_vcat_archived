import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { imageUrl, metadataUri, keyframeUri } from '../util'
import { DetectionList, TableTuples, Keyframe, Gate } from '../common'

import * as labels from '../labels'

class KeyframeSingle extends Component {
  render() {
    const { app, data, match } = this.props
    const frame = parseInt(match.params.frame, 10)
    const { sha256 } = data
    const { width, height, aspect_ratio: aspectRatio } = app.mediainfo.metadata.mediainfo.video
    const keyframeLookup = app.keyframe.metadata.keyframe
    const detections = {
      places365: app.places365.metadata.places365[frame],
      coco: app.coco.metadata.coco[frame],
    }
    const keyframeIndexes = Object.keys(app.coco.metadata.coco)
      .map(n => parseInt(n, 10))
      .sort((a, b) => a - b)
    const keyframeCount = keyframeIndexes.length
    const keyframeIndex = keyframeIndexes.indexOf(frame)
    const previousKeyframeIndex = (keyframeIndex - 1 + keyframeCount) % keyframeCount
    const nextKeyframeIndex = (keyframeIndex + 1) % keyframeCount
    // coco, places
    const keyframeSets = ['dense', 'basic', 'expanded']
      .map(key => (key in keyframeLookup) && key)
      .filter(k => !!k)
      .join(', ')
    const sizes = ['th', 'sm', 'md', 'lg']
      .map(size => (
        <span key={size}>
          <a href={imageUrl(sha256, frame, size)} target="_blank" rel="noopener noreferrer">
            {'['}{size}{']'}
          </a>
          {' '}
        </span>
      ))
    return (
      <div className='keyframeSummary'>
        <h2>Frame #{frame}</h2>
        <ul className='meta'>
          <li>
            <Link to={keyframeUri(sha256, keyframeIndexes[previousKeyframeIndex])}>
              {'← #'}{keyframeIndexes[previousKeyframeIndex]}
            </Link>
          </li>
          <li>
            <Link to={metadataUri(sha256, 'keyframe')}>
              Index
            </Link>
          </li>
          <li>
            <Link to={keyframeUri(sha256, keyframeIndexes[nextKeyframeIndex])}>
              {'#'}{keyframeIndexes[nextKeyframeIndex]}{' →'}
            </Link>
          </li>
        </ul>
        <Keyframe
          sha256={sha256}
          frame={frame}
          size='md'
          to={imageUrl(sha256, frame, 'lg')}
          aspectRatio={aspectRatio}
          detectionList={[
            { labels: labels.coco, detections: detections.coco }
          ]}
        />
        <TableTuples
          tag='Metadata'
          list={[
            ['Width', width],
            ['Height', height],
            ['Keyframe sets', keyframeSets],
            ['Sizes', {
              _raw: true,
              value: sizes
            }],
          ]}
        />
        <DetectionList
          tag={'Places365'}
          detections={detections.places365}
          labels={labels.places365}
          showEmpty
        />
        <DetectionList
          tag={'Coco'}
          detections={detections.coco}
          labels={labels.coco}
          showEmpty
        />
      </div>
    )
    // const { metadata } = this.props.app
    // return (
    //   <TableObject tag='Keyframe' object={metadata} />
    // )
  }
}
const mapStateToProps = () => ({
  tag: 'keyframe',
})

export default connect(mapStateToProps)(props => (
  <Gate View={KeyframeSingle} {...props} />
))
