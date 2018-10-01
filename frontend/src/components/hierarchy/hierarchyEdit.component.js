import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions';
import HierarchyForm from './hierarchyForm.component'
import rootNode from './rootNode';

class HierarchyEdit extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount(newProps) {
    console.log('willMount')
  }
  handleSubmit(data){
    console.log("edit...!", data)
    this.props.actions.update(data.id, data)
  }
  render() {
    if (!this.props.auth.groups.hierarchy && !this.props.auth.groups.staff) {
      return window.location.href = '/'
    }
    if (this.props.hierarchy.loading) {
      return (<div>Loading</div>)
    }
    const currentId = this.props.currentId
    const node = this.props.hierarchy.nodes[currentId] || rootNode
    const parent = this.props.hierarchy.nodes[node.parent] || rootNode
    return (
      <HierarchyForm
        title="Edit Node"
        node={node}
        parent={parent}
        closeModal={this.props.closeModal}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentId: ownProps.match.params.id || null,
  auth: state.auth,
  hierarchy: state.hierarchy,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.hierarchy }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyEdit);
