import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import actions from '../../actions'

import Autocomplete from '../common/autocomplete.component'

import './autocomplete.css'

class AutocompleteTest extends Component {
  constructor(props) {
    super()
    this.state = {
      selections: [],
    }
    this.handleSelect = this.handleSelect.bind(this)
  }
  handleSelect(node){
    this.setState({
      selections: [node].concat(this.state.selections),
    })
  }
  render() {
    const selections = this.state.selections.map((node, i) => {
      return (
        <li key={i}>
          <Link to={"/categories/" + node.id}>{node.name}</Link>
        </li>
      )
    })
    return (
      <div>
        <Autocomplete onSelect={this.handleSelect} />
        <ul>
          {selections.length ? selections : "Selections will appear here"}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteTest);

