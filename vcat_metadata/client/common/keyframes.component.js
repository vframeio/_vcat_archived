import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Keyframe } from '.'
import * as reviewActions from '../review/review.actions'
import * as searchActions from '../search/search.actions'

function Keyframes(props) {
  let {
    saved = {},
    frames,
    options,
    review,
    search,
    ...frameProps
  } = props
  // console.log(props)
  let minDistance = 0
  if (frames && frames.length) {
    minDistance = frames[0].distance || 0
  }
  return (
    <div className='keyframes'>
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
