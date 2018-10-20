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
    mouseX: 0,
    mouseY: 0,
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
    const mouseX = e.pageX
    const mouseY = e.pageY
    const x = mouseX - bounds.left
    const y = mouseY - bounds.top
    const w = 1
    const h = 1
    console.log(x, y, w, h)
    this.setState({
      dragging: true,
      bounds,
      mouseX,
      mouseY,
      box: {
        x, y, w, h,
      }
    })
  }

  handleMouseMove(e) {
    const { dragging, bounds, mouseX, mouseY, box } = this.state
    if (!dragging) return
    e.preventDefault()
    let { x, y } = box
    let w = clamp(e.pageX - mouseX, 0, bounds.width - x)
    let h = clamp(e.pageY - mouseY, 0, bounds.height - y)
    console.log(x, y, w, h)
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
  //   const img = this.imgRef
  //   const canvas = query_div.querySelector('canvas') || document.createElement('canvas')
  //   const ctx = canvas.getContext('2d')
  //   const ratio = img.naturalWidth / bounds.width
  //   canvas.width = dx * ratio
  //   canvas.height = dy * ratio
  //   if (dx < 10 || dy < 10) {
  //     if (canvas.parentNode) canvas.parentNode.removeChild(canvas)
  //     const box_el = document.querySelector('.box')
  //     if (box_el) box_el.parentNode.removeChild(box_el)
  //     return
  //   }
  //   // query_div.appendChild(canvas)
  //   ctx.drawImage(
  //     img,
  //     x * ratio,
  //     y * ratio,
  //     dx * ratio,
  //     dy * ratio,
  //     0, 0, canvas.width, canvas.height
  //   )
  //   const blob = window.dataUriToBlob(canvas.toDataURL('image/jpeg', 0.9))
  //   this.actions.upload(blob)
  }

  render() {
    const { query } = this.props.query
    const { box, bounds } = this.state
    const { x, y, w, h } = box
    if (!query) return null
    if (query.loading) {
      return <div className="searchQuery">Loading results...</div>
    }
    return (
      <div className="searchQuery row">
        <div className="searchBox">
          <img
            src={query.url}
            ref={ref => this.imgRef = ref}
            onMouseDown={this.handleMouseDown}
          />
          {!!w &&
            <div
              className="box"
              style={{
                left: x,
                top: y,
                width: w,
                height: h,
              }}
            />
          }
        </div>
        <div>
          <h3>Your Query</h3>
          <SearchMeta query={query} />
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
