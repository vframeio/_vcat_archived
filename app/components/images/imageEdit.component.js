import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import actions from '../../actions';

import ImageForm from './imageForm.component'

const destroyConfirmationMessage = "Really delete this image?\n\n" + 
  "This action cannot be undone."

class ImageEdit extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleDestroy = this.handleDestroy.bind(this)
  }
  componentWillMount() {
    this.props.actions.image.show(this.props.currentId)
  }
  handleDestroy(e){
    e && e.preventDefault()
    const image = this.props.image.image
    if (! image) return
    var shouldDestroy = window.confirm(destroyConfirmationMessage)
    if (!shouldDestroy) return
    this.props.actions.image.destroy(image.id)
    setTimeout(() => {
      window.location.href = "/images/"
    }, 100)
  }
  handleSubmit(data){
    console.log("edit...!", data)
    this.props.actions.image.update(this.props.currentId, data.node, () => {
      window.location.href = "/images/annotate/" + this.props.currentId
    })
  }
  render() {
    if (this.props.image.loading) {
      return (<div>Loading</div>)
    }
    return (
      <div>
        <ImageForm
          title="Edit Image"
          node={this.props.image.image}
          onSubmit={this.handleSubmit}
        />
        <div className='columns'>
          <div className="col-2"></div>
          <div className="col-10" style={{paddingLeft: '4px'}}>
            <br/><br/>
            <button className="btn" onClick={this.handleDestroy}>Delete this Image</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentId: ownProps.match.params.id || null,
  auth: state.auth,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators({ ...actions.image }, dispatch)
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageEdit);
