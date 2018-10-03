import React from 'react'

import { px } from '../util'

export default function DetectionBoxes({ detections, width, height }) {
  return detections.map(({ rect }, i) => (
    rect &&
      <div className='rect' key={i} style={{
        left: px(rect[0], width),
        top: px(rect[1], height),
        width: px(rect[2] - rect[0], width),
        height: px(rect[3] - rect[1], height),
      }} />
  ))
}
