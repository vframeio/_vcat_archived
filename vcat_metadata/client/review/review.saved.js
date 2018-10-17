import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actions from './review.actions'
import { Keyframes } from '../common'
import AnnotatorMenu from './annotatorMenu.component'

class ReviewSaved extends Component {
  state = {
    showAnnotator: false,
  }

  render() {
    const { saved } = this.props
    const { showAnnotator } = this.state
    const results = Object.keys(saved).sort().map(key => {
      const { verified, hash, frames } = saved[key]
      return Object.keys(frames).sort().map(frame => ({
        verified,
        hash,
        frame,
      }))
    }).reduce((a, b) => ((b && b.length) ? a.concat(b) : a), [])
    const noResults = results.length === 0
    return (
      <div className="reviewSaved">
        <h2>Saved Images</h2>
        <div className='reviewButtons'>
          <button className='btn' disabled={noResults} onClick={() => this.setState({ showAnnotator: !showAnnotator })}>Import into VCAT</button>
          <button className='btn' disabled={noResults} onClick={() => this.props.actions.exportCSV()}>Export CSV</button>
          <button className='btn' disabled={noResults} onClick={() => this.props.actions.refresh()}>Refresh</button>
          <button className='btn reset' disabled={noResults} onClick={() => confirm("This will clear your saved images.") && this.props.actions.clear()}>Reset</button>
        </div>
        {showAnnotator && <AnnotatorMenu />}
        <Keyframes
          frames={results}
          showHash
          showTimestamp
          showSearchButton
          showSaveButton
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  saved: state.review.saved,
})

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({ ...actions }, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(ReviewSaved)
