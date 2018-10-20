import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { Keyframes, Video } from '../common'
// import { Coco } from '../metadata'
import * as searchActions from './search.actions'
import * as metadataActions from '../metadata/metadata.actions'
import SearchMeta from './search.meta'

class Browse extends Component {
  componentDidMount() {
    this.browse()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params !== this.props.match.params) {
      this.browse()
    }
  }

  browse() {
    const { hash } = this.props.match.params
    if (hash) {
      this.props.searchActions.browse(hash)
    }
    if (hash) {
      this.props.metadataActions.fetchMetadata(hash)
    }
  }

  render() {
    const { browse, options } = this.props
    console.log('browse', browse)

    if (!browse || browse.reset || browse.loading) {
      return <div></div>
    }
    if (!browse.loading && !browse.frames.length) {
      return <div>No frames</div>
    }
    return (
      <div className="browseComponent column">
        <h3>Video Preview</h3>
        <Video size={'md'} />
        <SearchMeta query={browse} sugarcube />
        <div className='row buttons'>
          <Link
            to={'/metadata/' + browse.hash}
            className='btn'
          >
            View Full Metadata
          </Link>
        </div>
        <h3>Keyframes</h3>
        <Keyframes
          frames={browse.frames}
          showHash
          showTimestamp
          showSearchButton
          showSaveButton
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  browse: state.search.browse,
  options: state.search.options,
  metadata: state.metadata,
})

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators({ ...searchActions }, dispatch),
  metadataActions: bindActionCreators({ ...metadataActions }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Browse))
