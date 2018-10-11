import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Stage } from 'react-konva';
import Konva from 'konva'

Konva.dragDistance = 0

class ScaledStage extends Component {
  constructor() {
    super()
    this.fit = this.fit.bind(this)
    window.addEventListener('resize', this.fit)
  }
  componentDidMount(){
    this.fit()
  }
  componentDidUpdate(){
    const newProps = this.props
    if (newProps.dims.width !== this.props.dims.width
        || newProps.dims.height !== this.props.dims.height) {
      this.fit()
    }
  }
  fit() {
    let bounds = this.refs.parent.getBoundingClientRect()
    var containerWidth = this.refs.parent.offsetWidth
    var containerHeight = this.refs.parent.offsetHeight
    var scale = Math.min(
      containerHeight / this.props.dims.height,
      containerWidth / this.props.dims.width,
      1.0
    )
    // if (containerWidth > 1024) {
    //  Konva.pixelRatio = 1
    // }
    // console.log(bounds.left, bounds.top, bounds.width)

    let left = bounds.left
    let top = bounds.top + document.body.parentNode.scrollTop

    this.props.onResize({
      left, top,
      scale,
    })
  }
  render() {
    const dims = this.props.dims
    return (
      <div
        className={"stageParent " + this.props.cursor}
        ref="parent"
      >
        <Stage
          width={dims.width * dims.scale}
          height={dims.height * dims.scale}
          scale={{ x: dims.scale, y: dims.scale }}
          ref="el"
        >
          {this.props.children}
        </Stage>
      </div>
    );
  }
}

export default ScaledStage;
