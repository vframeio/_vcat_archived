import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { clamp, px } from '../util'

import * as searchActions from './search.actions'
import SearchMeta from './search.meta'

class SearchQuery extends Component {
  state = {
    dragging: false,
    bounds: null,
    mouse_x: 0,
    mouse_y: 0,
    box: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    }
  }

  constructor() {
    super()
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
  }

  componentDidMount() {
    document.body.addEventListener('mousemove', this.handleMouseMove)
    document.body.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.handleMouseMove)
    document.body.removeEventListener('mouseup', this.handleMouseUp)
  }

  handleMouseDown(e) {
    e.preventDefault()
    const bounds = this.imgRef.getBoundingClientRect()
    const mouse_x = e.pageX
    const mouse_y = e.pageY
    const x = mouse_x - bounds.left
    const y = mouse_y - bounds.top
    const w = 0
    const h = 0
    this.setState({
      dragging: true,
      bounds,
      box: {
        x, y, w, h,
      }
    })
  }

  handleMouseMove(e) {
    const { dragging, bounds, box } = this.state
    if (!dragging) return
    e.preventDefault()
    let { x, y } = box
    let w = clamp(e.pageX - x, 0, bounds.width - x)
    let h = clamp(e.pageY - y, 0, bounds.height - y)
    this.setState({
      box: {
        x, y, w, h,
      }
    })
  }

  handleMouseUp(e) {
    const { dragging, box } = this.state
    if (!dragging) return
    this.setState({
      dragging: false,
    })
    e.preventDefault()
    const img = this.imgRef
    const canvas = query_div.querySelector('canvas') || document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const ratio = img.naturalWidth / bounds.width
    canvas.width = dx * ratio
    canvas.height = dy * ratio
    if (dx < 10 || dy < 10) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
      const box_el = document.querySelector('.box')
      if (box_el) box_el.parentNode.removeChild(box_el)
      return
    }
    // query_div.appendChild(canvas)
    ctx.drawImage(
      img,
      x * ratio,
      y * ratio,
      dx * ratio,
      dy * ratio,
      0, 0, canvas.width, canvas.height
    )
    const blob = window.dataUriToBlob(canvas.toDataURL('image/jpeg', 0.9))
    this.actions.upload(blob)
  }

  render() {
    const { query } = this.props.query
    const { dragging, box, bounds } = this.state
    const { x, y, w, h } = box
    if (!query) return null
    if (query.loading) {
      return <div className="searchQuery">Loading results...</div>
    }
    return (
      <div className="searchQuery">
        <SearchMeta query={query} />
        <div className="query">
          <img
            src={query.url}
            ref={ref => this.img = ref}
            onMouseDown={this.handleMouseDown}
          />
          <div
            className="box"
            style={{
              left: px(rect[0], width),
              top: px(rect[1], height),
              width: px(rect[2] - rect[0], width),
              height: px(rect[3] - rect[1], height),
            }}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  query: state.search.query,
  options: state.search.options,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...searchActions }, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchQuery)
