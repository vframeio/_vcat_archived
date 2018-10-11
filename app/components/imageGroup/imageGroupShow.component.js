import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import EditorView from '../editor/editorView.component'
import ImageGroupRow from './imageGroupRow.component'

class ImageGroupShow extends Component {
  constructor(props){
    super()
    props.actions.imageGroup.show(props.match.params.group_id, props.match.params.image_id)
  }
  render(){
    if (! this.props.image.group) {
      return (<div>Loading...</div>)
    }
    return (
      <div className='container'>
        <ImageGroupRow group={this.props.image.group} />
      </div>
    )
  }
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  image: state.image,
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    imageGroup: bindActionCreators({ ...actions.imageGroup }, dispatch),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageGroupShow);
