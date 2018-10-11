import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ScaledStage, RegionLayer } from '../regions';

import actions from '../../actions';

class RegionTest extends Component {
  constructor() {
    super()
    this.state = {
      stage: {
        width: 1024,
        height: 768,
        scale: 1,
      },
      layer: {
        width: 100,
        height: 100,
        x: 100,
        y: 100,
      },
      cursor: '',
    }
    this.handleStageResize = this.handleStageResize.bind(this)
    this.handleLayerUpdate = this.handleLayerUpdate.bind(this)
    this.handleCursorUpdate = this.handleCursorUpdate.bind(this)
  }
  handleStageResize(newStage){
    this.setState({
      stage: {
        ...this.state.stage,
        ...newStage,
      }
    })
  }
  handleLayerUpdate(layer){
    this.setState({ layer })
  }
  handleCursorUpdate(cursor){
    this.setState({ cursor })
  }
  render(){
    return (
      <ScaledStage
        dims={this.state.stage}
        onResize={this.handleStageResize}
        cursor={this.state.cursor}
      >
        <RegionLayer
          stage={this.state.stage}
          layer={this.state.layer}
          label={'This is a long description which is cropped properly'}
          onLayerUpdate={this.handleLayerUpdate}
          onCursorUpdate={this.handleCursorUpdate}
        />
      </ScaledStage>
    );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ ...actions.hierarchy }, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(RegionTest);
