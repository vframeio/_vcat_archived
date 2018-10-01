import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import RegionThumbnail from '../common/regionThumbnail.component'
import actions from '../../actions'

class RegionList extends Component {
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
    const img = this.props.img
    if (!img || !img.complete) {
      return <div>Loading...</div>
    }

    const image = this.props.image
    const regions = image ? image.regions : []
    const groups = (regions || [])
    .map(rect => [
        this.getLabel(rect),
        rect,
      ])
    .sort((a,b) => a[0].localeCompare(b[0]))
    .reduce((rv, x) => {
        (rv[x[0]] = rv[x[0]] || []).push(x[1]);
        return rv;
      }, {})
    const regionGroups = Object.keys(groups).map((label, i) => {
      return (
        <RegionGroup
          key={i}
          img={img}
          label={label}
          regions={groups[label]}
          nodes={this.props.nodes}
          actions={this.props.actions}
        />
      )
    })
    return (
      <div className='regionList'>
        <div className='scroller'>
          {regionGroups}
        </div>
      </div>
    )
  }
}

class RegionGroup extends Component {
  constructor(props){
    super(props)
  }
  renderLabel(){
    const rect = this.props.regions[0]
    if (! rect.tag) {
      return <h6>Unlabeled</h6>
    }
    let tag = typeof rect.tag === 'number' ? this.props.nodes[rect.tag] : rect.tag
    const name = tag.name
    if (tag.is_attribute) {
      const parent = this.props.nodes[tag.parent]
      if (parent) {
        return (
          <h6>
            <b><Link to={"/categories/" + tag.id}>{parent.name}</Link></b>
            <Link to={"/categories/" + tag.id}>{name}</Link>
          </h6>
        )
      }
    }
    return (
      <h6>
        <b><Link to={"/categories/" + tag.id}>{name}</Link></b>
      </h6>
    )
  }
  render(){
    const thumbnails = this.props.regions
    .map(rect => [rect.id, rect])
    .sort((a,b) => a[0] - b[0])
    .map( (pair, i) => {
      const rect = pair[1]
      return (
        <RegionThumbnail
          key={i}
          img={this.props.img}
          rect={rect}
          onClick={() => {
            this.props.actions.editor.setSelectedId(rect.uuid)
          }}
        />
      )
    })
    return (
      <div className='regionGroup'>
        {this.renderLabel()}
        {thumbnails}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  image: state.image.image,
  nodes: state.hierarchy.nodes,
  editor: state.editor,
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    editor: bindActionCreators(actions.editor, dispatch),
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(RegionList);
