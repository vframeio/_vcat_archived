import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions';
import { site } from '../../util/site'

import ImageForm from './imageForm.component'

class ImageCreate extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleSubmit(data){
    console.log("create...!", data)
    const { node, images } = data
    if (! images.length)
      return alert("Please add some images")
    if (node.from_sa && !node.sa_hash)
      return alert("Please add the " + site.client_name + " video hash")
    if (!node.from_sa && !node.source_url)
      return alert("Please enter the source URL of these images")
    this.props.actions.upload(node, images)
  }
  render() {
    if (this.props.image.loading) {
      return (<div>Loading</div>)
    }
    return (
      <ImageForm
        title="New Image Group"
        node={{
          from_sa: true,
          graphic: false,
          verified: false,
        }}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentId: ownProps.match.params.id || null,
  auth: state.auth,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.image }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageCreate);
