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
    ...frameProps
  } = props
  // console.log(props)
  return (
    <div className='keyframes'>
      {frames.map(({ hash, frame, verified }) => (
        <Keyframe
          key={hash + '_' + frame}
          sha256={hash}
          frame={frame}
          verified={verified}
          isSaved={!!saved[hash] && !!saved[hash].frames && !!saved[hash].frames[parseInt(frame)]}
          size={options.thumbnailSize}
          to={searchActions.publicUrl.browse(hash)}
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
})

export default connect(mapStateToProps, mapDispatchToProps)(Keyframes)
