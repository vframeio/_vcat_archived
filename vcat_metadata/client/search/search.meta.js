import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { timestamp } from '../util'
import * as searchActions from './search.actions'

class SearchMeta extends Component {
  render() {
    const { query, metadata, sugarcube } = this.props
    console.log(metadata)
    if (!query || !metadata || !metadata.mediainfo || metadata.metadata === 'loading') {
      return <div className='gray'></div>
    }
    const sugarcubeId = metadata.mediainfo.sugarcube_id
    const { video } = metadata.mediainfo.metadata.mediainfo

    return (
      <div className='gray'>
        <span className={query.verified ? 'verified' : 'unverified'}>
          {query.verified ? 'verified' : 'unverified'}
        </span>
        <span>
          {'sha256: '}
          <Link to={searchActions.publicUrl.browse(query.hash)}>{query.hash}</Link>
        </span>
        {query.frame &&
          <span>
            {'frame: '}
            <Link to={searchActions.publicUrl.searchByVerifiedFrame(query.verified, query.hash, query.frame)}>
              {timestamp(query.frame, video.frame_rate)}
              {' / '}
              {timestamp(video.duration / 1000, 1)}
            </Link>
          </span>
        }
        <span>
          {'date: '}{video.encoded_date}
        </span>
        {sugarcube &&
          <span>
            sugarcube: {sugarcubeId}
          </span>
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  metadata: state.metadata,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...searchActions }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchMeta)
