import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { image_url } from '../../util/api'

import RegionThumbnail from './regionThumbnail.component'

let loadedImages = {}

export default class RegionGallery extends Component {
  constructor(props){
    super(props)
    this.state = { updated: Date.now() }
  }
  componentWillMount(){
    loadedImages = {}
    this.preloadImages(this.props)
  }
  componentWillUpdate(nextProps){
    if (nextProps.images !== this.props.images || nextProps.regions !== this.props.regions) {
      this.preloadImages(nextProps)
    }
  }
  preloadImages(props){
    const imageLookup = props.images
    const imageDedupe = {}
    let seen = {}
    let saw_new = false
    props.regions.forEach(region => {
      if (imageLookup[region.image]) {
        imageDedupe[region.image] = imageLookup[region.image]
      }
    })
    Object.keys(imageDedupe).forEach(id => {
      if (seen[id]) return
      seen[id] = true
      const el = imageDedupe[id]
      const img = new Image ()
      let loaded = false
      img.onload = () => {
        if (loaded) return
        loaded = true
        loadedImages[id] = img
        this.setState({ updated: Date.now() })
      }
      img.src = image_url(el, 'images', 'md')
      if (img.complete) {
        img.onload()
      }
    })
  }
  render(){
    const regions = (this.props.regions || []).map((region, i) => {
      const img = loadedImages[region.image] || { loading: true }
      return (
        <Link key={region.id} to={"/images/annotate/" + region.image} key={i}>
          <RegionThumbnail img={img} rect={region} />
        </Link>
      )
    })
    if (regions.length) {
      return (
        <div className='column col-12 gallery region-gallery'>
          {regions}
        </div>
      )
    }
    return null
  }
}
