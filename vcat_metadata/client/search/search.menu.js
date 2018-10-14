import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './search.actions'
import PanicButton from './panicButton.component'

class SearchMenu extends Component {
  upload(e) {
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files
    let i
    let file
    for (i = 0; i < files.length; i++) {
      file = files[i]
      if (file && file.type.match('image.*')) break
    }
    if (!file) return
    this.props.actions.upload(file)
  }

  random() {
    this.props.actions.random()
  }

  render() {
    return (
      <div className="searchForm row">
        <div className='row'>
          <div className='upload'>
            <button className='btn'><span>⤴</span> Upload an Image</button>
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={this.upload.bind(this)}
              required
            />
          </div>
          <button className='btn random' onClick={this.random.bind(this)}><span>♘</span> Random</button>
          <PanicButton />
          <Link to='/search/saved/'>
            <button className='btn view_saved'><span>⇪</span> View Saved</button>
          </Link>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(SearchMenu)