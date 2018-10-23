import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Keyframe } from '.'
import * as reviewActions from '../review/review.actions'
import * as searchActions from '../search/search.actions'

function Keyframes(props) {
  // console.log(props)
  let {
    frames,
    groupByHash,
  } = props
  let minDistance = 0
  if (frames && frames.length) {
    minDistance = frames[0].distance || 0
  }
  if (!groupByHash) {
    return (
      <KeyframeList
        minDistance={minDistance}
        {...props}
      />
    )
  }
  const frameGroups = frames.reduce((a, b) => {
    if (a[b.hash]) {
      a[b.hash].push(b)
    } else {
      a[b.hash] = [b]
    }
    return a
  }, {})
  return Object.keys(frameGroups)
    .map(hash => [frameGroups[hash].length, hash])
    .sort((a, b) => b[0] - a[0])
    .map(([count, hash]) => (
      <KeyframeList
        {...props}
        count={count}
        key={hash}
        minDistance={minDistance}
        frames={frameGroups[hash]}
        label={hash}
      />
    ))
}

function KeyframeList(props) {
  let {
    saved = {},
    frames,
    options,
    review,
    search,
    minDistance,
    label,
    count,
    ...frameProps
  } = props
  return (
    <div className={label ? 'keyframes keyframeGroup' : 'keyframes'}>
      {label && <h4>{label} ({count})</h4>}
      {frames.map(({ hash, frame, verified, distance }) => (
        <Keyframe
          key={hash + '_' + frame}
          sha256={hash}
          frame={frame}
          score={100 - Math.round(distance - minDistance) + '%'}
          verified={verified}
          isSaved={!!saved[hash] && !!saved[hash].frames && !!saved[hash].frames[parseInt(frame, 10)]}
          size={options.thumbnailSize}
          onClick={() => review.toggleSaved({ verified, hash, frame })}
          reviewActions={review}
          {...frameProps}
        />
      ))}
    </div>
  )
}

const mapStateToProps = state => ({
  saved: state.review.saved,
  options: state.search.options,
})

const mapDispatchToProps = dispatch => ({
  review: bindActionCreators({ ...reviewActions }, dispatch),
  search: bindActionCreators({ ...searchActions }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Keyframes)
