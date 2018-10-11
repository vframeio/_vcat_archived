import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Layer, Circle, Rect, Text, Label, Tag } from 'react-konva';
import clamp from 'clamp'

import { MouseArrows } from '.'

class RegionLayer extends Component {
  constructor(props) {
    super()
    this.state = {
      rect: { ...props.rect, },
      resizeStart: { x: 0, y: 0 },
      bounds: { width: 0, height: 0 },
      controlPointHover: false,
      layerHover: false,
      dragging: false,
      resizing: false,
    }
    this.dragBounds = this.dragBounds.bind(this)
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
  }
  shouldComponentUpdate(nextProps, nextState){
    return this.state.layerHover !== nextState.layerHover
    || this.state.controlPointHover !== nextState.controlPointHover
    || this.state.dragging
    || this.state.dragging !== nextState.dragging
    || this.props.selected !== nextProps.selected
    || this.props.stage.scale !== nextProps.stage.scale
    || this.props.rect.x !== nextProps.rect.x
    || this.props.rect.y !== nextProps.rect.y
    || this.props.rect.width !== nextProps.rect.width
    || this.props.rect.height !== nextProps.rect.height
    || this.props.rect.tag !== nextProps.rect.tag
    || this.props.labels !== nextProps.labels
  }
  dragBounds(pos){
    if (! this.state.dragging) return pos;
    return {
      x: clamp(pos.x, 0, this.state.bounds.width),
      y: clamp(pos.y, 0, this.state.bounds.height),
    }
  }

  /* layer mouse events */

  onMouseEnter(e){
    if (! this.state.controlPointHover) {
      this.props.onCursorUpdate(MouseArrows[3][0])
    }
    this.setState({ layerHover: true })
  }
  onMouseLeave(e){
    if (this.state.dragging) return;
    if (! this.state.controlPointHover) {
      this.props.onCursorUpdate('')
    }
    this.setState({ layerHover: false })
  }
  onMouseDown(e){
    if (!this.props.selected) {
      this.props.onLayerSelect && this.props.onLayerSelect(this.state.rect)
      return false
    }
  }
  onDragStart(e){
    if (!this.props.selected || this.state.dragging || this.state.resizing) return;
    const stage = this.props.stage
    this.setState({
      dragging: true,
      rect: Object.assign({}, this.props.rect),
      bounds: {
        width: stage.scale * stage.width * (1 - this.props.rect.width),
        height: stage.scale * stage.height * (1 - this.props.rect.height),
      },
    })
    this.props.onDragStart(this.props.rect)
    this.props.onCursorUpdate(MouseArrows[3][1])
    // this.props.onDragStart(this.props.rect.uuid)
  }
  onDragEnd(e){
    if (! this.state.dragging || this.state.resizing) return
    const stage = this.props.stage
    let x = this.refs.rect._lastPos.x / stage.scale / stage.width
    let y = this.refs.rect._lastPos.y / stage.scale / stage.height
    this.setState({
      dragging: false,
      rect: {
        ...this.props.rect,
        x, y,
      },
    })
    this.props.onCursorUpdate(MouseArrows[3][0])
    this.props.onLayerUpdate({
      ...this.props.rect,
      x, y,
    })
  }

  /* control point mouse events */

  onControlPointMouseEnter(y, x){
    return (e) => {
      if (this.state.dragging) return;
      this.props.onCursorUpdate(MouseArrows[y+1][x+1])
      this.setState({ controlPointHover: true })
    }
  }
  onControlPointMouseLeave(y, x){
    return (e) => {
      if (this.state.dragging) return;
      this.setState({ controlPointHover: false })
      if (this.state.layerHover) {
        this.props.onCursorUpdate(MouseArrows[3][0])
      }
    }
  }
  onControlPointDragStart(y, x){
    return (e) => {
      const stage = this.props.stage
      this.setState({
        dragging: true,
        resizing: true,
        rect: Object.assign({}, this.props.rect),
        resizeStart: {
          x: (e.evt.pageX - stage.left) / stage.scale,
          y: (e.evt.pageY - stage.top) / stage.scale,
        }
      })
      this.props.onDragStart(this.props.rect)
    }
  }
  onControlPointDragMove(edgeX, edgeY){
    return (e) => {
      if (! this.state.resizeStart.x) return
      const rect = this.props.rect
      const stage = this.props.stage
      const q = this.state.resizeStart

      const px = (e.evt.pageX - stage.left) / stage.scale;
      const py = (e.evt.pageY - stage.top) / stage.scale;

      const newPos = {
        x: clamp(px, 0, stage.width),
        y: clamp(py, 0, stage.height),
      }

      let dx = (newPos.x - q.x) * edgeX
      let dy = (newPos.y - q.y) * edgeY
      if (edgeX === 0) dx = 0
      if (edgeY === 0) dy = 0
      dx /= stage.width
      dy /= stage.height
      let x = edgeX === -1 ? rect.x - dx : rect.x
      let y = edgeY === -1 ? rect.y - dy : rect.y
      this.setState({
        rect: {
          x: x,
          y: y,
          width: rect.width + dx,
          height: rect.height + dy,
        },
      })
    }
  }
  onControlPointDragEnd(y, x){
    return (e) => {
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
        dragging: false, resizing: false,
        rect: { x, y, width, height },
        resizeStart: {},
      })
      this.props.onLayerUpdate({
        ...this.props.rect,
        x, y, width, height
      })
    }
  }
  getLabel(rect){
    let name = ""
    if (rect.tag) {
      let tag = typeof rect.tag === 'number' ? this.props.nodes[rect.tag] : rect.tag
      name = tag.name
      if (tag.is_attribute) {
        const parent = this.props.nodes[tag.parent]
        if (parent) {
          name = parent.name + " (" + name + ")"
        }
      }
    }
    return name
  }
  render(){
    const stage = this.props.stage
    const rect = (this.state.dragging || this.state.resizing) ? this.state.rect : this.props.rect

    const scale = this.props.stage.scale
    const hovering = this.state.layerHover
    const selected = this.props.selected
    const notSelected = this.props.notSelected
    const color = '0,0,255,'

    const layer = {
      x: rect.x * stage.width,
      y: rect.y * stage.height,
      width: rect.width * stage.width,
      height: rect.height * stage.height,
    }

    return (
      <Layer
        x={layer.x}
        y={layer.y}
        ref="rect"
        draggable
        dragBoundFunc={this.dragBounds}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
      >
        <Rect
          x={0}
          y={0}
          width={layer.width}
          height={layer.height}
          fill={notSelected ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}
          stroke={notSelected ? 'rgba(' + color + '0.7)' : 'rgba(' + color + '1)'}
          strokeWidth={(selected || hovering) ? 2 : 1}
          shadowForStrokeEnabled={false}
          strokeHitEnabled={false}
          transformsEnabled='position'
          onMouseDown={this.onMouseDown}
        />
        {this.renderLabel(layer, rect)}
        {this.renderCircles(layer, scale)}
      </Layer>
    );
  }
  renderLabel(layer, rect){
    if (! this.props.labels) return null;
    const name = this.getLabel(rect)
    const stage = this.props.stage
    const selected = this.props.selected
    const notSelected = this.props.notSelected
    const color = '0,0,255,'
    return (
      <Label
        x={layer.width < 0 ? layer.width : 0}
        y={layer.height < 0 ? layer.height : 0}
        width={layer.width < 0 ? -layer.width - 3 : layer.width}
        height={layer.height}
        listening={false}
        transformsEnabled='position'
        perfectDrawEnabled={false}
      >
        <Tag
          fill={selected ? "rgba(255,255,255,0.1)" : notSelected ? "transparent" : "rgba(" + color + "0.8)"}
        />
        <Text
          text={name}
          fontSize={12 / stage.scale}
          fill={selected
                ? "#000000"
                : notSelected
                  ? "rgba(255,255,255,0.1"
                  : "#ffffff"
                }
          width={layer.width}
          padding={3}
        />
      </Label>
    )
  }
  renderCircles(layer, scale){
    if (this.props.notSelected) return null
    return [
        <Circle
          x={0}
          y={0}
          radius={4 / scale}
          fill='white' stroke='black' strokeWidth='2'
          onMouseEnter={this.onControlPointMouseEnter(-1, -1)}
          onMouseLeave={this.onControlPointMouseLeave(-1, -1)}
          onDragStart={this.onControlPointDragStart(-1, -1)}
          onDragMove={this.onControlPointDragMove(-1, -1)}
          onDragEnd={this.onControlPointDragEnd(-1, -1)}
          perfectDrawEnabled={false}
          transformsEnabled='position'
          draggable
          key={0}
        />,
        <Circle
          x={layer.width}
          y={0}
          radius={4 / scale}
          fill='white' stroke='black' strokeWidth='2'
          onMouseEnter={this.onControlPointMouseEnter(1, -1)}
          onMouseLeave={this.onControlPointMouseLeave(1, -1)}
          onDragStart={this.onControlPointDragStart(1, -1)}
          onDragMove={this.onControlPointDragMove(1, -1)}
          onDragEnd={this.onControlPointDragEnd(1, -1)}
          perfectDrawEnabled={false}
          transformsEnabled='position'
          draggable
          key={1}
        />,
        <Circle
          x={0}
          y={layer.height}
          radius={4 / scale}
          fill='white' stroke='black' strokeWidth='2'
          onMouseEnter={this.onControlPointMouseEnter(-1, 1)}
          onMouseLeave={this.onControlPointMouseLeave(-1, 1)}
          onDragStart={this.onControlPointDragStart(-1, 1)}
          onDragMove={this.onControlPointDragMove(-1, 1)}
          onDragEnd={this.onControlPointDragEnd(-1, 1)}
          perfectDrawEnabled={false}
          transformsEnabled='position'
          draggable
          key={2}
        />,
        <Circle
          x={layer.width}
          y={layer.height}
          radius={4 / scale}
          fill='white' stroke='black' strokeWidth='2'
          onMouseEnter={this.onControlPointMouseEnter(1, 1)}
          onMouseLeave={this.onControlPointMouseLeave(1, 1)}
          onDragStart={this.onControlPointDragStart(1, 1)}
          onDragMove={this.onControlPointDragMove(1, 1)}
          onDragEnd={this.onControlPointDragEnd(1, 1)}
          perfectDrawEnabled={false}
          transformsEnabled='position'
          draggable
          key={3}
        />
      ]
  }
}

export default RegionLayer;
