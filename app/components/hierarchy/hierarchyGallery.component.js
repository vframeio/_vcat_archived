import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import Loader from '../common/loader.component'
import ThumbnailGallery from '../common/thumbnailGallery.component'
import RegionGallery from '../common/regionGallery.component'

const GALLERY_IMAGES_PER_PAGE = 50

class HierarchyView extends Component {
  constructor(props) {
    super()
    this.state = {
      index: 0,
    }
    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
  }
  getList() {
    return this.props.hierarchy.galleryMode === 'images'
      ? Object.keys(this.props.node.imageLookup).map(key => this.props.node.imageLookup[key])
      : this.props.node.regions
  }
  prevPage() {
    this.setState({ index: Math.max(0, this.state.index - GALLERY_IMAGES_PER_PAGE) })
  }
  nextPage() {
    console.log('nextpage')
    this.setState({ index: this.state.index + GALLERY_IMAGES_PER_PAGE })
  }
  render() {
    console.log(this.state.index)
    const node = this.props.node
    if (! node.images || ! node.regions || ! node.images.length || ! node.regions.length) {
      return null
    }
    const list = this.getList()
    const current_view = list.slice(this.state.index, this.state.index + GALLERY_IMAGES_PER_PAGE)
    console.log('display', current_view.length)
    const prev_page = (this.state.index > 0)
    const next_page = (this.state.index < list.length - GALLERY_IMAGES_PER_PAGE)
    return (
      <div className='hierarchy-gallery'>
        <ul className="tab">
          <ToggleTab
            label='Images'
            active={this.props.hierarchy.galleryMode === 'images'}
            onClick={() => this.props.actions.hierarchy.setGalleryMode('images')}
          />
          <ToggleTab
            label='Regions'
            active={this.props.hierarchy.galleryMode === 'regions'}
            onClick={() => this.props.actions.hierarchy.setGalleryMode('regions')}
          />
          <li className="tab-item tab-action">
            {prev_page &&
              <button onClick={this.prevPage} className='btn'>{'<'}</button>
            }
            {next_page &&
              <button onClick={this.nextPage} className='btn'>{'>'}</button>
            }
          </li>
        </ul>
        {this.props.hierarchy.galleryMode === 'images'
        ? <ThumbnailGallery images={current_view} showAnnotations />
        : <RegionGallery regions={current_view} images={node.imageLookup} />
        }
      </div>
    )
  }
}

function ToggleTab (props) {
  const className = props.active ? 'tab-item active' : 'tab-item'
  return (
    <li className={className}>
      <a href='#' onClick={(e) => {
        e.preventDefault()
        props.onClick()
      }}>
        {props.label}
      </a>
    </li>
  )
}

const mapStateToProps = (state, ownProps) => ({
  hierarchy: state.hierarchy,
  node: ownProps.node,
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyView);
