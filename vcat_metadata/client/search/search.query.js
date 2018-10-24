import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import toBlob from 'data-uri-to-blob'

import { clamp, px } from '../util'
import { Loader } from '../common'

import * as searchActions from './search.actions'
import SearchMeta from './search.meta'

const defaultState = {
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

class SearchQuery extends Component {
  state = {
    ...defaultState
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

  componentDidUpdate(prevProps) {
    // console.log(this.props.query.query, !prevProps.query.query)
    if (this.state.bounds && (!this.props.query.query || !prevProps.query.query || this.props.query.query.url !== prevProps.query.query.url)) {
      this.setState({ ...defaultState })
    }
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
    this.setState({
      box: {
        x, y, w, h,
      }
    })
  }

  handleMouseUp(e) {
    const { actions } = this.props
    const { dragging, bounds, box } = this.state
    if (!dragging) return
    e.preventDefault()
    const { x, y, w, h } = box
    console.log(x, y, w, h)
    const img = this.imgRef
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const ratio = img.naturalWidth / bounds.width
    canvas.width = w * ratio
    canvas.height = h * ratio
    if (w < 10 || h < 10) {
      this.setState({ dragging: false, box: { x: 0, y: 0, w: 0, h: 0 } })
      return
    }
    this.setState({ dragging: false })
    // query_div.appendChild(canvas)
    const newImage = new Image()
    let loaded = false
    newImage.onload = () => {
      if (loaded) return
      loaded = true
      newImage.onload = null
      ctx.drawImage(
        newImage,
        Math.round(x * ratio),
        Math.round(y * ratio),
        Math.round(w * ratio),
        Math.round(h * ratio),
        0, 0, canvas.width, canvas.height
      )
      const blob = toBlob(canvas.toDataURL('image/jpeg', 0.9))
      actions.upload(blob, {
        ...this.props.query.query,
        crop: {
          x, y, w, h,
        }
      })
    }
    // console.log(img.src)
    newImage.crossOrigin = 'anonymous'
    newImage.src = img.src
    if (newImage.complete) {
      newImage.onload()
    }
  }

  render() {
    const { query } = this.props.query
    const { box } = this.state
    const { x, y, w, h } = box
    if (!query) return null
    if (query.loading) {
      return <div className="searchQuery column"><h2>Loading results...</h2><Loader /></div>
    }
    let { url } = query
    if (url && url.indexOf('static') === 0) {
      url = '/search/' + url
    }
    return (
      <div className="searchQuery row">
        <div className="searchBox">
          <img
            src={url}
            ref={ref => this.imgRef = ref}
            onMouseDown={this.handleMouseDown}
            crossOrigin='anonymous'
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
