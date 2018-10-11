import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import EditorApp from './editorApp.component'

import actions from '../../actions'

class EditorView extends Component {
  constructor(props) {
    super()
  }
  componentWillMount() {
    if (this.props.group_id) {
      this.props.actions.imageGroup.show(this.props.group_id, this.props.image_id)
    } else {
      this.props.actions.image.show(this.props.image_id)
    }
  }
  componentWillReceiveProps(newProps) {
    if (newProps.image_id !== this.props.image_id) {
      this.props.actions.image.show(newProps.image_id)
    }
  }
  render() {
    return (
      <EditorApp />
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  image_id: ownProps.match.params.id || null,
  group_id: ownProps.match.params.group_id || null,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators({ ...actions.image }, dispatch),
    imageGroup: bindActionCreators({ ...actions.imageGroup }, dispatch),
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorView);
