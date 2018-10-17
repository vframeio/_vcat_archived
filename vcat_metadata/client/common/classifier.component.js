import React, { Component } from 'react'
import { courtesyS } from '../util'

import { TableTuples, DetectionList, Keyframe } from '.'

export default class Classifier extends Component {
  render() {
    const {
      tag,
      sha256,
      verified,
      keyframes = {},
      labels,
      summary,
      aspectRatio = 1.777,
      showAll,
    } = this.props
    let totalDetections = 0
    const keys = Object
      .keys(keyframes)
      .map(s => parseInt(s, 10))
    const validKeyframes = keys
      .sort((a, b) => a - b)
      .map(frame => {
        const detections = keyframes[frame]
        if (detections.length || showAll) {
          totalDetections += detections.length
          return { frame, detections }
        }
        return null
      })
      .filter(f => !!f)
    const detectionLookup = validKeyframes
      .reduce((a, b) => {
        b.detections.reduce((aa, { idx }) => {
          if (!(idx in aa)) aa[idx] = [labels[idx], 0]
          aa[idx][1] += 1
          return aa
        }, a)
        return a
      }, {})
    const detectionCounts = Object.keys(detectionLookup)
      .map(idx => detectionLookup[idx])
      .sort((a, b) => b[1] - a[1])

    if (summary) {
      return (
        <div>
          <h3>{tag}{' Detections'}</h3>
          <TableTuples
            list={detectionCounts}
          />
        </div>
      )
    }
    return (
      <div>
        <h2>{tag}</h2>
        <h3>Detections</h3>
        <TableTuples
          list={detectionCounts}
        />
        <h3>Frames</h3>
        <ul className='meta'>
          <li>
            {'Displaying '}{validKeyframes.length}{' / '}{courtesyS(keys.length, 'frame')}
          </li>
          <li>
            {courtesyS(totalDetections, 'detection')}{' found'}
          </li>
        </ul>
        <div className='thumbnails'>
          {validKeyframes.map(({ frame, detections }) => (
            <Keyframe
              key={frame}
              sha256={sha256}
              frame={frame}
              verified={verified}
              size='th'
              showFrame
              showTimestamp
              aspectRatio={aspectRatio}
              detectionList={[
                { labels, detections }
              ]}
            >
              <DetectionList
                labels={labels}
                detections={detections}
                width={160}
                height={90}
              />
            </Keyframe>
          ))}
        </div>
      </div>
    )
  }
}
