import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import clamp from 'clamp'

import Autocomplete from '../common/autocomplete.component'

class RegionAnnotate extends Component {
  constructor(props) {
    super()
    this.state = {
    }
  }
  render(){
    if (! this.props.rect || this.props.dragging || ! this.props.shouldAnnotate) return null
    const rect = this.props.rect
    const stage = this.props.stage
    const x = rect.x * stage.width * stage.scale
    const y = (rect.y + rect.height) * stage.height * stage.scale + 5
    const style = {
      top: y,
      left: x,
      width: clamp(rect.width * stage.width * stage.scale, 200, stage.width * stage.scale)
    }
    return (
      <div className="annotate" style={style}>
        <Autocomplete
          onSelect={this.props.onSelect}
          onCancel={this.props.onCancel}
        />
      </div>
    );
  }
}

export default RegionAnnotate;
