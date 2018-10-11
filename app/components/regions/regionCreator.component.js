import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Layer, Rect } from 'react-konva';
import clamp from 'clamp'

class RegionCreator extends Component {
  constructor(props) {
    super()
    this.state = {
      rect: { x: 0, y: 0, width: 0, height: 0, },
      dragging: false,
    }
    this.onMouseDown = this.onMouseDown.bind(this)
    // must bind mousemove+mouseup globally
    // so we can ingest them when the mouse is off the canvas
    window.addEventListener("mousemove", this.onMouseMove.bind(this))
    window.addEventListener("mouseup", this.onMouseUp.bind(this))
  }
  onMouseDown(e){
    const stage = this.props.stage
    const rect = {
      x: (e.evt.pageX - stage.left) / stage.scale,
      y: (e.evt.pageY - stage.top) / stage.scale,
      width: 0,
      height: 0,
    }
    this.props.onMouseDown(rect)
    this.setState({
      dragging: true,
      rect,
    })
  }
  onMouseMove(e){
    if (! this.state.dragging) return
    const stage = this.props.stage
    const rect = this.state.rect

    const px = (e.pageX - stage.left) / stage.scale;
    const py = (e.pageY - stage.top) / stage.scale;

    let width = clamp(px, 0, stage.width-1) - rect.x
    let height = clamp(py, 0, stage.height-1) - rect.y
    this.setState({
      rect: {
        ...this.state.rect,
        width, height,
      }
    })
  }
  onMouseUp(e){
    if (! this.state.dragging) return
    const stage = this.props.stage
    let { x, y, width, height } = this.state.rect
    if (width < 0) {
      x += width
      width *= -1
    }
    if (height < 0) {
      y += height
      height *= -1
    }
    this.setState({
      dragging: false,
      rect: { x: 0, y: 0, width: 0, height: 0 }
    })
    if (width < 32 || height < 32) return
    const rect = {
      x: x / stage.width,
      y: y / stage.height,
      width: width / stage.width,
      height: height / stage.height,
    }
    this.props.onLayerCreate(rect)
  }
  render(){
    const stage = this.props.stage
    const rect = this.state.rect
    return (
      <Layer
        x={0}
        y={0}
        ref="layer"
        onMouseDown={this.onMouseDown}
      >
        <Rect
          x={0}
          y={0}
          width={stage.width}
          height={stage.height}
        />
        {this.state.dragging &&
          <Rect
            x={rect.x}
            y={rect.y}
            width={rect.width}
            height={rect.height}
            fill={this.state.dragging ? 'rgba(255,0,0,0.1)' : 'rgba(0,0,255,0.1)'}
            stroke={this.state.dragging ? 'rgba(255,0,0,1)' : 'rgba(0,0,255,1)'}
            strokeWidth={1}
          />
        }
      </Layer>
    );
  }
}

export default RegionCreator;
