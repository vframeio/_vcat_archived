import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './search.actions'

class SearchMenu extends Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

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
          <button className='btn random'><span>♘</span> Random</button>
          <button className='btn panic'><span>⚠</span> Panic</button>
          <button className='btn view_saved'><span>⇪</span> View Saved</button>
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

/*
<div class="query">
  <span class='msg'></span>
  <div></div>
</div>

<div class="results">
</div>


</div>
<script type="text/html" id="result-template">
  <div class='{className}'>
    <img src="{img}" crossorigin="anonymous">
    <div>
      <div class='score'>{score}</div>
      <a href='{metadata}'><button class='btn metadata'>Info</button></a>
      <a href='{browse}'><button class='btn browse'>Expand</button></a>
      <a href='{search}'><button class='btn search'>Search</button></a>
    </div>
  </div>
</script>
</body>

*/