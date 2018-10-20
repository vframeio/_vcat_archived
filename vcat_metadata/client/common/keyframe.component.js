import React from 'react'
import { Link } from 'react-router-dom'
import { imageUrl, timestamp, keyframeUri, widths, verify } from '../util'
import { DetectionBoxes } from '.'

import * as searchActions from '../search/search.actions'

export default function Keyframe({
  verified,
  sha256,
  frame,
  score,
  isSaved,
  fps = 25,
  size = 'th',
  className,
  showHash,
  showFrame,
  showTimestamp,
  showScore,
  showSearchButton,
  showSaveButton,
  to,
  children,
  detectionList = [],
  aspectRatio = 1.777,
  onClick,
  reviewActions,
}) {
  if (!sha256) return null
  const width = widths[size]
  const height = Math.round(width / aspectRatio)
  return (
    <div className={(className || 'keyframe') + (isSaved ? ' isSaved' : '')}>
      <div className="thumbnail">
        <PossiblyExternalLink to={to || keyframeUri(sha256, frame)} onClick={onClick}>
          <img
            alt={'Frame #' + frame}
            src={imageUrl(verified, sha256, frame, size)}
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
        {(reviewActions && (showSearchButton || showSaveButton)) &&
          <label className='searchButtons'>
            {showSearchButton &&
              <Link
                to={searchActions.publicUrl.searchByVerifiedFrame(verified, sha256, frame)}
                className='btn'
              >
                Search
              </Link>
            }
            {showSaveButton && (isSaved
              ? <button
                  onClick={() => reviewActions.unsave({ hash: sha256, frame, verified })}
                  className={'btn saved'}
                >
                  {'Saved'}
                </button>
              : <button
                  onClick={() => reviewActions.save({ hash: sha256, frame, verified })}
                  className={'btn save'}
                >
                  {'Save'}
                </button>
            )}
          </label>
        }
      </div>
      {(showHash || showFrame || showTimestamp || showScore) &&
        <label>
          {showHash && 
            <small>
              <Link to={searchActions.publicUrl.browse(sha256)}>
                <span
                  title={sha256}
                  className={'sha256 ' + verify(verified)}
                >
                  {'▶ '}
                  {sha256.substr(0, 6)}
                </span>
              </Link>
            </small>
          }
          {showFrame &&
            <small>
              <span>{'Frame #'}{frame}</span>
            </small>
          }
          {showTimestamp && <small>{timestamp(frame, fps)}</small>}
          {showScore && !!score && <small>{score}</small>}
        </label>
      }
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
