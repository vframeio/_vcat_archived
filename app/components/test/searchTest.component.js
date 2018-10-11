import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import actions from '../../actions'

import Thumbnail from '../common/thumbnail.component';

import './searchTest.css'

class SearchTest extends Component {
  constructor(props) {
    super()
    this.state = {
      thumbnail: null,
      results: null,
    }
    this.handleUpload = this.handleUpload.bind(this)
  }
  handleUpload(e) {
    e.stopPropagation()
    e.preventDefault()
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    let i, f
    for (i = 0, f; i < files.length; i++) {
      f = files[i]
      if (!f) continue
      if (!f.type.match('image.*')) continue
      if (i === 0) this.getImageDimensions(f)
    }
  }
  getImageDimensions(f) {
    this.setState({ results: null, thumbnail: null })
    const reader = new FileReader();
    reader.onload = (e) => {
      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 200
        canvas.height = 200 * (image.naturalHeight/image.naturalWidth)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        const thumbnail = canvas.toDataURL('image/jpeg')
        this.setState({ thumbnail })
        this.props.actions.image.search(f, (data) => {
          this.setState({ results: data })
        })
      }
      image.src = e.target.result
    }
    reader.readAsDataURL(f);
  }
  render() {
    const images = (this.state.results || []).map((img, i) => {
      if (! img.ext.match(/(gif|jpg|jpeg|png)$/)) return null;
      return (
        <Link to={"/images/annotate/" + img.id} key={i}>
          <Thumbnail node={img} type="images" alt={"Thumbnail"} />
          <br />
          Hamming distance: {img.hamming_distance}
        </Link>
      )
    })
    let status = null
    if (! this.state.thumbnail) {
      status = "Choose an image to search."
    }
    else if (this.state.thumbnail && ! this.state.results) {
      status = "Searching..."
    }
    else if (this.state.results.length) {
      status = this.state.results.length + " results found."
      if (this.state.results[0].hamming_distance < 5) {
        status += " Image probably not unique."
      }
    }
    else if (!this.state.results.length) {
      status = "No results found. Image is probably unique."
    }
    return (
      <div className="searchTest">
        <input type="file" onChange={this.handleUpload} />
        <Thumbnail src={this.state.thumbnail} type='images' size='th' />
        {status}
        <div className='column col-12 gallery'>
          {images}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  hierarchy: state.hierarchy,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
    image: bindActionCreators({ ...actions.image }, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchTest);

