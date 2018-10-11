import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import clamp from 'clamp'
import uuid from 'uuid/v4'

import { ScaledStage, RegionLayer, RegionCreator, RegionAnnotate } from '../regions'
import Loader from '../common/loader.component'

import * as api from '../../util/api'
import actions from '../../actions'

const BIG_SQUEEZE = 5

class EditorCanvas extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
      dragging: false,
      shouldAnnotate: false,
      labels: true,
      stage: {
        width: 1024,
        height: 768,
        scale: 1,
      },
      newRect: null,
      cursor: '',
    }
    this.handleImageLoad = this.handleImageLoad.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleStageResize = this.handleStageResize.bind(this)
    this.handleStageMousedown = this.handleStageMousedown.bind(this)
    this.handleLayerSelect = this.handleLayerSelect.bind(this)
    this.handleLayerDrag = this.handleLayerDrag.bind(this)
    this.handleLayerCreate = this.handleLayerCreate.bind(this)
    this.handleLayerUpdate = this.handleLayerUpdate.bind(this)
    this.handleCursorUpdate = this.handleCursorUpdate.bind(this)
    this.handleAnnotation = this.handleAnnotation.bind(this)
    this.cancelAnnotation = this.cancelAnnotation.bind(this)
    this.nudge = this.nudge.bind(this)
  }
  componentDidMount(){
    document.addEventListener("keydown", this.handleKeydown, false);
  }
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeydown, false);
  }
  componentDidCatch(error, info) {
    console.log('/!\\', error, info)
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.image.image !== prevProps.image.image && (!prevProps.image.image || this.props.image.image.id !== prevProps.image.image.id)) {
      // prevent displaying image with old regions
      this.props.actions.editor.clearSelectedId()
      this.setState({
        loaded: false,
        dragging: false,
        newRect: null,
        cursor: '',
      })
    }
  }
  getSelectedRect(){
    if (this.state.newRect) return this.state.newRect;
    let selectedRect;
    this.props.image.image.regions.some(rect => {
      if (this.props.editor.selectedId !== rect.uuid) return false
      selectedRect = rect
      return true
    })
    return selectedRect
  }
  handleImageLoad(){
    if (! this.props.image.image) return
    const img = this.refs.img
    this.props.onImageLoad(img)
    this.props.actions.image.updateImageSize(this.props.image.image, {
      width: img.naturalWidth,
      height: img.naturalHeight,
    })
    this.setState({
      loaded: true,
      stage: {
        ...this.state.stage,
        width: img.naturalWidth,
        height: img.naturalHeight,
        scale: img.offsetWidth / img.naturalWidth,
      }
    })
  }
  handleKeydown(e) {
    function element_is_text_input(el) {
      var tagName = el.tagName.toLowerCase()
      return tagName === 'input' && (el.type === 'text' || tagName === 'textarea')
    }
    if (element_is_text_input(document.activeElement)) {
      return
    }
    switch (e.keyCode) {
      case 8: // backspace
      case 68: // "D"
        if (this.props.editor.selectedId) {
          e.preventDefault()
          const rect = this.props.image.image.regions.find(r => r.uuid === this.props.editor.selectedId)
          this.handleLayerDestroy(rect)
        }
        break
      case 37: // left
        e.preventDefault()
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          this.squeeze(-BIG_SQUEEZE, 0)
        } else if (e.shiftKey) {
          this.squeeze(-1, 0)
        } else {
          this.nudge(-1, 0)
        }
        break
      case 38: // up
        e.preventDefault()
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          this.squeeze(0, -BIG_SQUEEZE)
        } else if (e.shiftKey) {
          this.squeeze(0, -1)
        } else {
          this.nudge(0, -1)
        }
        break
      case 39: // right
        e.preventDefault()
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          this.squeeze(BIG_SQUEEZE, 0)
        } else if (e.shiftKey) {
          this.squeeze(1, 0)
        } else {
          this.nudge(1, 0)
        }
        break
      case 40: // down
        e.preventDefault()
        if (e.shiftKey && (e.ctrlKey || e.metaKey)) {
          this.squeeze(0, BIG_SQUEEZE)
        } else if (e.shiftKey) {
          this.squeeze(0, 1)
        } else {
          this.nudge(0, 1)
        }
        break
      case 69: // E - edit label
        e.preventDefault()
        this.setState({ shouldAnnotate: true })
        break
      case 76: // L - toggle labels
        this.setState({ labels: !this.state.labels })
        break
      default:
        console.log(e.keyCode)
        break
    }
  }
  handleStageResize(newStage){
    this.setState({
      stage: {
        ...this.state.stage,
        ...newStage,
      }
    })
  }
  handleLayerSelect(rect){
    this.props.actions.editor.setSelectedId(rect.uuid)
    this.setState({
      shouldAnnotate: false,
    })
  }
  handleStageMousedown(rect){
    this.props.actions.editor.clearSelectedId()
    this.setState({ newRect: null })
  }
  handleLayerDrag(rect){
    this.setState({ dragging: true })
  }
  handleLayerCreate(rect){
    rect.uuid = "new"
    rect.image = this.props.image.image.id
    rect.area = rect.width * rect.height
    this.props.actions.editor.setSelectedId(rect.uuid)
    this.setState({
      newRect: rect,
    })
  }
  handleLayerUpdate(rect){
    rect.area = rect.width * rect.height
    if (rect.uuid === 'new') {
      rect.uuid = uuid()
      this.props.actions.image.createRegion(rect)
    } else {
      this.props.actions.image.updateRegion(rect.id, rect)
    }
    this.props.actions.editor.setSelectedId(rect.uuid)
    this.setState({
      newRect: null,
      dragging: false,
    })
  }
  handleLayerDestroy(rect){
    if (rect.id) {
      this.props.actions.image.destroyRegion(rect.id)
    }
    this.props.actions.editor.clearSelectedId()
    this.setState({
      dragging: false,
    })
  }
  handleAnnotation(tag){
    const rect = this.getSelectedRect()
    if (! rect) return
    const new_rect = Object.assign({}, rect, { tag: tag.id })
    this.handleLayerUpdate(new_rect)
    this.setState({ shouldAnnotate: false })
  }
  cancelAnnotation() {
    const rect = this.getSelectedRect()
    if (! rect) return
    this.props.actions.editor.clearSelectedId()
    if (rect.uuid === 'new') {
      this.setState({
        newRect: null,
        shouldAnnotate: false,
        dragging: false,
      })
    } else {
      this.setState({
        shouldAnnotate: false,
        dragging: false,
      })
    }
  }
  handleCursorUpdate(cursor){
    this.setState({ cursor })
  }
  nudge(x, y){
    const stage = this.state.stage
    const rect = this.getSelectedRect()
    if (! rect) return
    const px = clamp(x / 2 / (stage.width * stage.scale) + rect.x, 0, (1-rect.width))
    const py = clamp(y / 2 / (stage.height * stage.scale) + rect.y, 0, (1-rect.height))
    const new_rect = Object.assign({}, rect, { x: px, y: py })
    this.props.actions.image.updateRegion(rect.id, new_rect)
  }
  squeeze(x, y){
    const stage = this.state.stage
    const rect = this.getSelectedRect()
    if (! rect) return
    const pw = clamp(x / 2 / (stage.width * stage.scale) + rect.width, 0.001, 1 - rect.x)
    const ph = clamp(y / 2 / (stage.height * stage.scale) + rect.height, 0.001, 1 - rect.y)
    const new_rect = Object.assign({}, rect, { width: pw, height: ph })
    this.props.actions.image.updateRegion(rect.id, new_rect)
  }
  render(){
    const image = this.props.image.image || {}
    let selectedRect, selectedId = this.props.editor.selectedId
    const regions = (image.regions || [])
    .sort((a, b) => {
      return a.uuid === selectedId ? 1 :
             b.uuid === selectedId ? -1 :
             a.area < b.area ? -1 :
             a.area === b.area ? 0 : 1
    })
    .map((rect, i) => {
      const isSelected = (selectedId && rect.uuid === selectedId)
      if (isSelected) selectedRect = rect
      return (
        <RegionLayer
          key={rect.uuid || i}
          stage={this.state.stage}
          rect={rect}
          labels={this.state.labels}
          selected={isSelected}
          notSelected={selectedId ? !isSelected : false}
          nodes={this.props.hierarchy.nodes}
          onLayerSelect={this.handleLayerSelect}
          onDragStart={this.handleLayerDrag}
          onLayerUpdate={this.handleLayerUpdate}
          onCursorUpdate={this.handleCursorUpdate}
        />
      )
    })
    if (this.state.newRect) {
      let rect = this.state.newRect
      const isSelected = (selectedId && rect.uuid === selectedId)
      if (isSelected) selectedRect = this.state.newRect
      regions.push(
        <RegionLayer
          key={rect.uuid}
          stage={this.state.stage}
          rect={rect}
          labels={this.state.labels}
          selected={isSelected}
          notSelected={selectedId ? !isSelected : false}
          nodes={this.props.hierarchy.nodes}
          onLayerSelect={this.handleLayerSelect}
          onDragStart={this.handleLayerDrag}
          onLayerUpdate={this.handleLayerUpdate}
          onCursorUpdate={this.handleCursorUpdate}
        />
      )
    }
    const image_url = api.image_url(image, 'images', 'lg')
    return (
      <div ref='parent' className='editor'>
        <img src={image_url} alt="canvas" ref="img" onLoad={this.handleImageLoad} className={image.graphic ? 'graphic' : ''} />
        {(this.refs.img && this.refs.img.complete)
          ? this.renderStage(regions, image_url)
          : this.renderLoading()
        }
        <RegionAnnotate
          dragging={this.state.dragging}
          shouldAnnotate={this.state.shouldAnnotate || (selectedRect && !selectedRect.tag)}
          stage={this.state.stage}
          rect={selectedRect}
          onSelect={this.handleAnnotation}
          onCancel={this.cancelAnnotation}
        />
      </div>
    );
  }
  renderLoading(){
    return (
      <div>
        <Loader />
      </div>
    )
  }
  renderStage(regions, image_url){
    return (
      <ScaledStage
        dims={this.state.stage}
        onResize={this.handleStageResize}
        cursor={this.state.cursor}
        image={image_url}
      >
        <RegionCreator
          stage={this.state.stage}
          onMouseDown={this.handleStageMousedown}
          onLayerCreate={this.handleLayerCreate}
        />
        {regions}
      </ScaledStage>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  image: state.image,
  hierarchy: state.hierarchy,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators(actions.image, dispatch),
    editor: bindActionCreators(actions.editor, dispatch),
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorCanvas);
