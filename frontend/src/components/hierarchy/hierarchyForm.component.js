import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions';

import { FormField, InfoField, SubmitField } from '../common/formField.component';

import Thumbnail from '../common/thumbnail.component';

function node_to_slug(raw_name, node, nodes){
  let name = name_to_slug(raw_name)
  if (node.is_attribute) {
    const parent = nodes[node.parent]
    return parent.slug + ":" + name
  }
  return name
}
function name_to_slug(name) {
  return (name || "").toLowerCase().replace(/[^-a-z0-9 _]+/g, "").replace(/\s+/g, "_")
}

class HierarchyForm extends Component {
  constructor(props) {
    super()
    this.state = {
      node: {
        ...props.node,
        path: (props.parent && props.parent.path),
      },
      image: null,
      thumbnail: null,
      error: null,
      addAnother: false,
    }
    this.handleChange = this.handleChange.bind(this)
    this.getImageDimensions = this.getImageDimensions.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    if (name === "name" || name === "is_attribute") {
      const slug = node_to_slug(newState.node.name, newState.node, this.props.nodes)
      newState.node['slug'] = slug
      newState.node['path'] = (this.props.parent.path + '/' + name_to_slug(newState.node.name)).replace('//', '/')
      if (name === "name" && newState.node['display_name'] === this.state.node.name) {
        newState.node['display_name'] = value
      }
    }
    this.setState(newState)
  }
  handleUpload(e) {
    e.stopPropagation()
    e.preventDefault()
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    if (!files.length) {
      return this.setState({ image: null, thumbnail: null })
    }
    let i, f
    for (i = 0, f; i < files.length; i++) {
      f = files[i]
      if (!f) continue
      if (!f.type.match('image.*')) continue
      if (i === 0) {
        this.getImageDimensions(f)
      }
    }
  }
  getImageDimensions(f) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 200
        canvas.height = 200 * (img.naturalHeight/img.naturalWidth)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const thumbnail = canvas.toDataURL('image/jpeg')
        this.setState({ thumbnail, image: f })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(f);
  }
  handleSubmit(e) {
    e.preventDefault()
    const node = this.state.node
    const image = this.state.image
    if (! node.slug) return
    if (image) {
      this.props.actions.image.upload({
        from_sa: false,
        source_url: "hierarchy",
        description: "Canonical image for " + node.name,
        graphic: false,
      }, [image], (data) => {
        console.log("got images", data)
        if (data.length && data[0] && data[0].id) {
          node.image = data[0].id
        }
        this.props.onSubmit && this.props.onSubmit(node, image)
      })
    }
    else {
      this.props.onSubmit && this.props.onSubmit(node, image)
    }
  }
  saveAndAddAnother(e){
    this.setState({'addAnother': true})
  }
  render(){
    const node = this.state.node
    const parent = this.props.nodes[node.parent]

    // also: image!
    return (
      <form className="form-horizontal container" onSubmit={this.handleSubmit}>
        <h2>{this.props.title}</h2>
        <InfoField
          label="Slug"
          value={node.slug}
          placeholder="..."
        />
        <InfoField
          label="Path"
          value={node.path}
          placeholder="..."
          />

        <FormField
          label="Name"
          name="name"
          type="text"
          placeholder="Name"
          instruction="Required. Name of this entity, unicode acceptable."
          required
          value={node.name}
          autoComplete="off"
          onChange={this.handleChange}
        />
        <FormField
          label="Display Name"
          name="display_name"
          type="text"
          placeholder="Display Name"
          instruction="Required. The full label to be displayed graphically on videos."
          required
          value={node.display_name}
          autoComplete="off"
          onChange={this.handleChange}
        />
        {parent ?
          <FormField
            label="Attribute?"
            name="is_attribute"
            type="checkbox"
            instruction="Check this field if this node is an attribute of its parent."
            checked={node.is_attribute}
            value={node.is_attribute}
            onChange={this.handleChange}
          />
          : null
        }
        <FormField
          label="Synonyms"
          name="synonyms"
          type="textarea"
          placeholder="Synonyms"
          instruction="Optional. List alternate names and spellings. One per line."
          value={node.synonyms}
          onChange={this.handleChange}
        />
        <FormField
          label="Description"
          name="description"
          type="textarea"
          placeholder="Description"
          instruction="Optional. Short description of this item."
          value={node.description}
          onChange={this.handleChange}
        />

        <div className="form-group">
          <div className="col-2">Image</div>
          <div className="col-6">
            {(this.state.thumbnail || node.id) ?
              <Thumbnail src={this.state.thumbnail} noplaceholder node={node} type='images' size='th' />
              : null
            }
            <div>
              <input type="file" onChange={this.handleUpload} />
            </div>
            <span className="instruction">
              {'Optional. Images should be JPG or PNG format.'}
            </span>
          </div>
        </div>

        <SubmitField
          label='Save'
          loading={this.props.loading}
          onClick={this.save}
        />
      </form>
    );
  }
}

/*
  <SubmitField
   label='Save and Add Another'
   loading={this.props.loading}
    onClick={this.saveAndAddAnother}
  />
*/

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  node: ownProps.node,
  title: ownProps.title,
  loading: state.hierarchy.loading,
  nodes: state.hierarchy.nodes,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
    image: bindActionCreators({ ...actions.image }, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyForm);
