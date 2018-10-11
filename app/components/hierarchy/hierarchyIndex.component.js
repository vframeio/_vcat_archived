import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import Loader from '../common/loader.component'

import rootNode from './rootNode'

class HierarchyIndex extends Component {
  constructor(props) {
    super()
    this.state = {}
  }
  componentWillMount() {
    this.props.actions.hierarchy.index()
  }
  render() {
    const currentId = this.props.currentId
    let { nodes, children } = this.props.hierarchy
    children = children || {}
    const node = nodes[currentId] || rootNode

    return (
      <div className='hierarchy'>
        <h2>{node.name}</h2>
        <div className='tree'>
          <TreeItem id={currentId} nodes={nodes} children={children} />
        </div>
        {this.props.hierarchy.loading && <Loader />}
      </div>
    );
  }
}

function TreeItem (props) {
  let { id, nodes, children } = props
  const childIds = children[id]
  if (!childIds || !childIds.length) return null
  const childLinks = childIds.map(id => [nodes[id].name || "", nodes[id]])
    .sort( (a, b) => a[0].localeCompare(b[0]) )
    .map( (pair, i) => {
      const node = pair[1]
      return (
        <li key={i}>
          <Link to={"/categories/" + node.id}>
            {node.name}
            {' (' + children[node.id].length + ')'}
          </Link>
          <TreeItem id={node.id} nodes={nodes} children={children} />
        </li>
      )
    })
  return (
    <ul>
      {childLinks}
    </ul>
  )
}

const mapStateToProps = (state, ownProps) => ({
  currentId: ownProps.match.params.id || null,
  auth: state.auth,
  hierarchy: state.hierarchy,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyIndex);
