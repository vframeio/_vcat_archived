import React from 'react'

export default function DetectionList({ detections, labels, tag, showEmpty }) {
  return (
    <span className='detectionList'>
      {tag && <h3>{tag}</h3>}
      {!detections.length && showEmpty && <label><small>No detections</small></label>}
      {detections.map(({ idx, score, rect }, i) => (
        <label key={i}>
          <small className='title'>{(labels[idx] || 'Unknown').replace(/_/, ' ')}</small>
          <small>{score.toFixed(2)}</small>
        </label>
      ))}
    </span>
  )
}
