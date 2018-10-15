import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions';
import HierarchyForm from './hierarchyForm.component'
import rootNode from './rootNode';

function singular(s){
  return (s || "").replace(/ies$/, "y").replace(/s$/, "")
}
class HierarchyCreate extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount(newProps) {
  }
  handleSubmit(data){
    if (data.parent === 0) {
      data.parent = null
      data.category = data.slug
    }
    console.log("create...!", data)
    this.props.actions.create(data)
  }
  render() {
    if (!this.props.auth.groups.staff) {
      return window.location.href = '/'
    }
    if (this.props.hierarchy.loading) {
      return (<div>Loading</div>)
    }
    const currentId = this.props.currentId
    let { nodes } = this.props.hierarchy
    const parent = nodes[currentId] || rootNode
    const category = singular(parent.category)
    const node = {
      category: category,
      parent: parent.id,
      image: null,
      synonyms: "",
      is_attribute: false,
    };
    return (
      <HierarchyForm
        title={"New " + (parent === rootNode ? 'Top-Level Category' : category)}
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

export default connect(mapStateToProps, mapDispatchToProps)(HierarchyCreate);
