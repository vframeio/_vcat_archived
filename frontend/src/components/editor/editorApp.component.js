import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RegionList from '../regions/regionList.component'
import EditorNav from './editorNav.component'
import EditorCanvas from './editorCanvas.component'
import EditorShortcuts from './editorShortcuts.component'
import ImageInfo from './imageInfo.component'

import actions from '../../actions'

class EditorApp extends Component {
  constructor(props){
    super(props)
    this.state = {
      img: null,
    }
    this.handleImageLoad = this.handleImageLoad.bind(this)
  }
  handleImageLoad(img){
    this.setState({ img })
  }
  render() {
    if (this.props.image.error) {
      return (
        <div>
          <h4>404: Image not found</h4>
          <p>
            Sorry, there was a problem loading this image.
          </p>
        </div>
      )
    }
    return (
      <div className='editorApp'>
        <EditorNav />
        <div className="editorRow">
          <EditorCanvas onImageLoad={this.handleImageLoad} />
          <div className='editorInfo'>
            <RegionList img={this.state.img} />
            <ImageInfo />
          </div>
        </div>
        <EditorShortcuts />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: { image: bindActionCreators({ ...actions.image }, dispatch) }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorApp);
