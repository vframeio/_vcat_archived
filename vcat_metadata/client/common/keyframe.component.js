import React from 'react'
import { Link } from 'react-router-dom'
import { imageUrl, timestamp, keyframeUri, widths } from '../util'
import { DetectionBoxes } from '.'

export default function Keyframe({
  sha256,
  frame,
  fps = 25,
  size = 'th',
  className,
  showHash,
  showFrame,
  showTimestamp,
  to,
  children,
  detectionList = [],
  aspectRatio = 1.777,
  onClick,
}) {
  if (!sha256) return null
  const width = widths[size]
  const height = Math.round(width / aspectRatio)
  return (
    <div className={className || 'keyframe'}>
      <PossiblyExternalLink to={to || keyframeUri(sha256, frame)} onClick={onClick}>
        <img
          alt={'Frame #' + frame}
          src={imageUrl(sha256, frame, size)}
          width={width}
          height={height}
          onClick={onClick}
        />
        {detectionList.map(({ labels, detections }, i) => (
          <DetectionBoxes
            key={i}
            labels={labels}
            detections={detections}
            width={width}
            height={height}
          />
        ))}
      </PossiblyExternalLink>
      <label>
        {showFrame &&
          <small>
            {showHash && <span className='sha256'>{sha256.substr(0, 6)}</span>}
            {showHash && <span>{' #' + frame}</span>}
            {!showHash && <span>{'Frame #'}{frame}</span>}
          </small>
        }
        {showTimestamp && <small>{timestamp(frame, fps)}</small>}
      </label>
      {children}
    </div>
  )
}

const PossiblyExternalLink = props => {
  if (props.onClick) {
    return props.children
  }
  if (props.to.match(/^http/)) {
    return <a href={props.to} target='_blank' rel='noopener noreferrer'>{props.children}</a>
  }
  return <Link {...props} />
}
