import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './search.actions'

class SearchMenu extends Component {
  componentDidMount() {
  }

  componentDidUpdate(prevProps) {
  }

  fetch(hash) {
  }

  render() {
    return (
      <div className="form">
        <div>
          <input type="file" name="img" accept="image/*" required />
          <button className='btn upload_again'>Upload Again</button>
        </div>
        <div className="general_ui">
          <button className='btn panic'>Panic</button>
          <button className='btn random'>Random</button>
          <button className='btn view_saved'>View Saved</button>
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