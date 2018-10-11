import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import actions from '../../actions';
import { site } from '../../util/site'

import {
  FormField, SubmitField, RadioButton,
} from '../common/formField.component';

import Thumbnail from '../common/thumbnail.component';

class ImageForm extends Component {
  constructor(props) {
    super()
    this.state = {
      node: { ...props.node },
      images: [],
      thumbnail: null,
      error: null,
    }
    this.handleUpload = this.handleUpload.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleUpload(e) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({ thumbnails: [], images: [] })
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    let i, f
    for (i = 0, f; i < files.length; i++) {
      f = files[i]
      if (!f) continue
      if (!f.type.match('image.*')) continue
      this.getImageDimensions(f)
    }
  }
  getImageDimensions(f) {
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
        this.props.actions.image.search(f, (data) => {
          let newState = {
            thumbnails: this.state.thumbnails.concat({ thumbnail, data }),            
          }
          if (!data.length) {
            newState['images'] = this.state.images.concat(f)
          }
          this.setState(newState)
        })
      }
      image.src = e.target.result
    }
    reader.readAsDataURL(f);
  }
  handleChange(e) {
    const name = e.target.name
    const value = e.target.value
    const newState = {
      node: {
        ...this.state.node,
        [name]: value,
      },
      error: null,
    }
    this.setState(newState)
  }
  handleSubmit(e) {
    e.preventDefault()
    this.props.onSubmit && this.props.onSubmit(this.state)
  }
  renderThumbnails(){
    const thumbs = this.state.thumbnails || []
    const badThumbs = thumbs.filter(t => !!t.data.length).map((t, i) => {
      return (
        <div key={i}>
          <Thumbnail
            src={t.thumbnail}
            type='images'
            size='th'
          />
          <Link to={"/images/show/" + t.data[0].id} target="_blank">
            <Thumbnail
              node={t.data[0]}
              type='images'
              size='th'
            />
          </Link>
          <b>{"✗ Possible duplicate "}</b>
        </div>
      )
    })

    const goodThumbs = thumbs.filter(t => !t.data.length).map((t, i) => {
      return (
        <div key={i}>
          <Thumbnail
            src={t.thumbnail}
            type='images'
            size='th'
          />
          {"✓ Unique"}
        </div>
      )
    })

    if (! badThumbs.length) {
      return (
        <div className="verifyThumbnails">{goodThumbs}</div>
      )
    }
    return (
      <div className="verifyThumbnails">
        <h4>These images are already in the database:</h4>
        {badThumbs}

        <h4>These images are unique:</h4>
        {goodThumbs}
      </div>
    )
  }
  render(){
    const node = this.state.node

    return (
      <form className="form-horizontal container" onSubmit={this.handleSubmit}>
        <h2>{this.props.title}</h2>

        <div className="form-group">
          <div className="col-2">Image</div>
          {!!node.id &&
            <div className="col-6">
              <Thumbnail node={node} type='images' size='th' />
            </div>
          }

          {!node.id &&
            <div className="col-8">
              {this.renderThumbnails()}
              <div>
                <input type="file" multiple onChange={this.handleUpload} />
              </div>
              <span className="instruction">
                {'Required. Images should be JPG or PNG format. Ideally 1280x720 pixels. '+
                'Minimum dimension 400 pixels. Avoid using pixellated or degraded images. '+
                'See '} <Link to="/help/">Image Tips</Link>
              </span>
            </div>
          }
        </div>

        <div className="form-group">
          <div className="col-2">Origin</div>
          <div className="col-6">
            <div className="radio-buttons">
              <RadioButton
                name="from_sa"
                label="WWW"
                value={false}
                checked={!node.from_sa}
                onChange={this.handleChange}
              />

              <RadioButton
                name="from_sa"
                label={site.client_name}
                value={true}
                checked={!!node.from_sa}
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>

        {!!node.from_sa &&
          <FormField
            name="sa_hash"
            placeholder={site.client_name + " reference code (e.g. \"e6837f4c\")"}
            instruction="Required. Reference code is full sha256 code (64 characters)"
            type="text"
            value={node.sa_hash}
            onChange={this.handleChange}
          />
        }
        {!node.from_sa &&
          <FormField
            name="source_url"
            placeholder="URL"
            instruction="Required. Preferably the URL of the page hosting the image or video. Otherwise, direct URL."
            type="text"
            value={node.source_url}
            onChange={this.handleChange}
          />
        }

        <FormField
          name="tags"
          type="text"
          label="Tags"
          placeholder={"tag1, tag2"}
          instruction="Optional. Tags should be separated by commas."
          value={node.tags}
          onChange={this.handleChange}
        />

        <FormField
          name="description"
          type="textarea"
          label="Description"
          placeholder={"Description"}
          instruction="Optional. Descriptions are sentence-like and used for searching, and for training scene detection and activity recognition algorithms. These can be edited later."
          value={node.description}
          onChange={this.handleChange}
        />

        <FormField
          name="graphic"
          label={"Graphic content?"}
          instruction={"This image contains graphic content."}
          type="checkbox"
          value={node.graphic}
          onChange={this.handleChange}
        />

        <SubmitField
          label='Save'
          loading={this.props.image.loading}
        />
      </form>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  image: state.image,
  node: ownProps.node,
  title: ownProps.title,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators({ ...actions.image }, dispatch)
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageForm);
