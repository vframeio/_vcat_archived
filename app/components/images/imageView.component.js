import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import Thumbnail from '../common/thumbnail.component';

const destroyConfirmationMessage = "Are you sure you want to delete this image?\n\n" + 
  "This action cannot be undone."

class ImageView extends Component {
  constructor(props) {
    super()
    this.state = {}
    this.handleDestroy = this.handleDestroy.bind(this)
  }
  componentWillMount() {
    if (this.props.currentId === "new") return
    this.props.actions.image.show(this.props.currentId)
  }
  componentWillReceiveProps(newProps) {
    if (newProps.currentId !== this.props.currentId) {
      // this.props.actions.hierarchy.show(newProps.currentId)
    }
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
  render() {
    if (this.props.currentId === "new") return null
    if (this.props.image.loading) return <div>Loading...</div>
    const node = this.props.image.image
    let source_link
    console.log(node)
    if (!node) return null
    if (!node.from_sa) {
      if (node.source_url && node.source_url.match("http")) {
        source_link = (
          <Link to={node.source_url}>{node.source_url}</Link>
        )
      } else {
        source_link = node.source_url
      }
    }
    return (
      <div className='image'>
          <h2>View Image</h2>

          <ul className='tab'>
            <li className='tab-item'>
              <Link className='' to={"/images/"}>Back</Link>
            </li>

            <li className='tab-item'>
              <Link className='' to={"/images/" + node.id + "/edit"}>Edit</Link>
            </li>

            <li className='tab-item'>
              <Link className='' to={"/images/" + node.id + "/annotate"}>Annotate</Link>
            </li>

            <li className='tab-item'>
              <a href='#' onClick={this.handleDestroy}>Destroy</a>
            </li>
          </ul>

          <Thumbnail node={node} type={"images"} size={'md'} />

          <p>
            {node.original_fn}
          </p>

          <p>
            Uploaded by {node.user ? node.user.username : "unknown"}
          </p>

          {node.from_sa ?
            <p>
              From SA: Yes<br/>
              SA Hash: {node.sa_hash}
            </p>
            :
            <p>
              From SA: No<br/>
              Source URL: {source_link}
            </p>
          }
          
          <p>
            {node.description}
          </p>
      </div>
    );
  }
}

/*
<li className='tab-item'>
  <a className='' href={'/images/' + node.id + '/destroy'} onClick={this.handleDestroy}>Delete</a>
</li>
*/

const mapStateToProps = (state, ownProps) => ({
  currentId: ownProps.match.params.id || null,
  auth: state.auth,
  hierarchy: state.hierarchy,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
    image: bindActionCreators({ ...actions.image }, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageView);
