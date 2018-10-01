import React, { Component } from 'react'
import { connect } from 'react-redux'
import { courtesyS } from '../util'

import { Keyframe, Gate } from '../common'

class KeyframeList extends Component {
  render() {
    const { sha256 } = this.props.data
    const { keyframe: keyframes } = this.props.data.metadata
    const keyframeLists = ['dense', 'basic', 'expanded'].map(key => (
      <div key={key}>
        <h3>{key}</h3>
        <ul className='meta'>
          <li>{courtesyS(keyframes[key].length, 'frame')}</li>
        </ul>
        <div className='thumbnails'>
          {keyframes[key].map(frame => (
            <Keyframe
              key={frame}
              sha256={sha256}
              frame={frame}
              size='th'
              showFrame
              showTimestamp
            />
          ))}
        </div>
      </div>
    ))
    return (
      <div className='keyframeLists'>
        {keyframeLists}
      </div>
    )
  }
}

const mapStateToProps = () => ({
  tag: 'keyframe',
})

export default connect(mapStateToProps)(props => (
  <Gate View={KeyframeList} {...props} />
))
