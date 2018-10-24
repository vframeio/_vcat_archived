import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import Loader from '../common/loader.component'
import Thumbnail from '../common/thumbnail.component'
import HierarchyGallery from './hierarchyGallery.component'
import Accordion from './accordion.component'

import rootNode from './rootNode'

const destroyConfirmationMessage = "Really delete the node '{{name}}'?\n\n" + 
  "This will delete all images and annotations in this category. The action cannot be undone."

class HierarchyView extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.handleDestroy = this.handleDestroy.bind(this)
    this.refresh = this.refresh.bind(this)
  }
  componentWillMount() {
    if (this.props.currentId) {
      this.props.actions.hierarchy.show_regions(this.props.currentId)
    } else {
      this.props.actions.hierarchy.index()
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.currentId !== this.props.currentId) {
      this.props.actions.hierarchy.show_regions(newProps.currentId)
    }
  }
  handleDestroy(e){
    e && e.preventDefault()
    const currentId = this.props.currentId
    const { nodes } = this.props.hierarchy
    const node = nodes[currentId]
    if (! node) return
    var shouldDestroy = window.confirm(destroyConfirmationMessage.replace(/{{name}}/, node.name))
    if (!shouldDestroy) return
    this.props.actions.hierarchy.destroy(node.id)
  }
  refresh() {
    this.props.actions.hierarchy.index()
  }
  renderNewCategoryButtons(node){
    if (node.is_attribute) return
    if (!this.props.auth.groups.staff) return
    const label = node === rootNode ? 'New Top-Level' : 'New Sub-Category'
    return (
      <Link to={"/categories/" + node.id + "/new"}>
        <button className="btn btn-sm">{label}</button>
      </Link>
    )
  }
  renderMetadata(node){
    if (node === rootNode) return
    if (!this.props.auth.groups.staff) return
    return (
      <p className="text-gray">
        <small>
          {"Path: "}{node.path}<br />
          {node.synonyms ?
            <span>{"Synonyms: "}{node.synonyms}<br /></span>
            : ""
          }
          {"Attribute? "}{node.is_attribute ? 'Yes' : 'No'}
        </small>
      </p>
    )
  }
  renderToplevelActions(node){
    return (
      <div>
        <ul className='cat-edit-opts'>
          <li className='cat-edit-opt-item'>
            {this.renderNewCategoryButtons(node)}
          </li>
        </ul>
      </div> 
    )   
  }
  renderActions(node){
    if (node === rootNode) return this.renderToplevelActions(node)
    if (!this.props.auth.groups.staff) return
    return (
      <div>
        <ul className='cat-edit-opts'>
          {node.is_attribute ? null :
          <li className='cat-edit-opt-item'>
            {this.renderNewCategoryButtons(node)}
          </li>
          }
          <li className='cat-edit-opt-item'>
            <Link className='' to={"/categories/" + node.id + "/edit"}>
              <button className="btn btn-sm">Edit</button>
            </Link>
          </li>
          <li className='cat-edit-item'>
            <a className='' href={'/categories/' + node.id + '/destroy'} onClick={this.handleDestroy}>
              <button className="btn btn-error btn-sm">Delete</button>
            </a>
          </li>
        </ul>
      </div>
    )
  }
  render404(node, nodes, children) {
    return (
      <div className="columns">
        <div className="column col-3">
          <Accordion node={node} nodes={nodes} children={children} />
        </div>
        <div className="column col-9">
          <div>404: Not Found</div>
        </div>
      </div>
    )
  }
  render() {
    if (this.props.currentId === "new") return
    const currentId = this.props.currentId
    let { nodes, children } = this.props.hierarchy
    children = children || {}
    const node = nodes[currentId] || rootNode
    if (currentId !== 0 && !nodes[currentId]) {
      return this.render404(node, nodes, children)
    }
    return (
      <div className="columns hierarchy">
        <div className="column col-3">
          <Accordion node={node} nodes={nodes} children={children} />
        </div>
        <div className="column col-9">
          <header>
            <Link to={node.image ? '/images/show/' + node.image.id : '.'}><Thumbnail node={node.image} type="images" size="square" /></Link>
            <h2 onClick={this.refresh}>{node.name}</h2>
          </header>

          <div className='new-category'>
            {this.renderActions(node)}
          </div>

          {this.renderMetadata(node)}

          <p className='description'>
            {node.description}
          </p>

          <HierarchyGallery node={node} />

          {this.props.hierarchy.loading && <Loader />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentId: ownProps.match.params.id || 0,
  auth: state.auth,
  hierarchy: state.hierarchy,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyView);
