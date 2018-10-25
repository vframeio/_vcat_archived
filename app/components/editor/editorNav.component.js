import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { ArrowUp, ArrowLeft, ArrowRight } from '../common/arrows.component'

import actions from '../../actions'

class EditorNav extends Component {
  constructor(props) {
    super()
    this.handleComplete = this.handleComplete.bind(this)
  }
  previous(){
    this.props.actions.imageGroup.prevIndex()
  }
  next() {
    this.props.actions.imageGroup.nextIndex()
  }
  saveAndNext(){
    this.updateComplete(true)
    if (this.props.image.group.images.length === this.props.image.index+1) {
      push("/groups/show/" + this.props.image.group.id)
    }
    else {
      this.props.actions.imageGroup.nextIndex()
    }
  }
  updateComplete(complete){
    const { image } = this.props.image
    if (image.complete === complete) return
    this.props.actions.image.update(image.id, {
      ...image,
      complete,
    })
  }
  handleComplete(e){
    this.updateComplete(!this.props.image.image.complete)
  }
  render() {
    let { group, index, image } = this.props.image
    // if (!group || !group.images || !image) return <ul className="editorNav tab tab-block"></ul>
    group = group || { images: [] }
    image = image || {}
    return (
      <ul className="editorNav tab tab-block">
        <li className="tab-item">
          <div className="input-group input-inline">
            <Link to={"/groups/show/" + group.id}>
              <button className="btn btn-sm" type="text">
                <ArrowUp />
              </button>
            </Link>
          </div>
          Image {index+1} / {group.images.length}
          <label className="form-checkbox complete_toggle">
            <input id="image_complete" type="checkbox" onChange={this.handleComplete} checked={image.complete} />
            <i className="form-icon"></i> Complete
          </label>
        </li>
        <li className="tab-item tab-action">
          <div className="input-group input-inline">
            <button className="btn btn-sm" onClick={() => this.previous()}>
              <ArrowLeft />
            </button>
            <button className="btn btn-sm" onClick={() => this.next()}>
              <ArrowRight />
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => this.saveAndNext()}>
              {"Save and Mark Complete "}&nbsp;
              <ArrowRight />
            </button>
          </div>
        </li>
      </ul>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  image: state.image,
  imageGroup: state.imageGroup,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators({ ...actions.image }, dispatch),
    imageGroup: bindActionCreators({ ...actions.imageGroup }, dispatch),
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorNav);
