import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import actions from '../../actions'

import './autocomplete.css'

function formatLabel(label, value) {
  if (!value) {
    return label;
  }
  let len = 0
  return (<span>{
    label.split(new RegExp(value.replace(/[-\[\]\(\)\+\*\\\^\$\{\}\.\?\&\|\<\>]/g, ''), "i")) // eslint-disable-line
      .reduce((prev, current, i) => {
        if (!i) {
          len += current.length
          return [current];
        }
        const ret = prev.concat(<b key={i}>{label.substr(len, value.length)}</b>, current);
        len += value.length + current.length
        return ret
      }, [])
    }
  </span>);
}
function sanitizeForAutocomplete(s) {
  return (s || "")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim()
    .replace(/\\/g, '')
}

class Autocomplete extends Component {
  constructor(props) {
    super()
    this.state = {
      q: props.q || "",
      selected: 0,
      matches: []
    }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }
  componentWillMount() {
    // build index based on what's in the hierarchy
    const nodes = this.props.hierarchy.nodes
    let index = this.index = []
    Object.keys(nodes).forEach(key => {
      const node = nodes[key]
      if (!key || !node || !node.name || !node.parent) return
      let name = node.name
      let prefixName = name
      if (node.is_attribute) {
        const parent = nodes[node.parent]
        if (parent) {
          prefixName = parent.name + " (" + name + ")"
        }
      }
      index.push([sanitizeForAutocomplete(prefixName), name, node.id])
      node.synonyms
        .split("\n")
        .map(word => word = word.trim())
        .filter(word => !!word)
        .forEach(word => index.push([prefixName, name, node.id]))
    })
  }
  handleKeyDown(e) {
    switch (e.keyCode) {
      case 27: // escape
        e.preventDefault()
        this.handleCancel()
        break
      case 37: // left
      case 38: // up
        e.preventDefault()
        this.setState({
          selected: (this.state.matches.length+this.state.selected-1) % this.state.matches.length
        })
        return false
      case 39: // right
      case 40: // down
        e.preventDefault()
        this.setState({
          selected: (this.state.selected+1) % this.state.matches.length
        })
        return false
      case 13: // enter
        const id = this.state.matches[this.state.selected]
        e.preventDefault()
        this.handleSelect(id)
        return false
      default:
        break
    }
  }
  handleChange(e) {
    // search for the given string in our index
    const q = e.target.value
    let value = sanitizeForAutocomplete(q)
    if (! value.length) {
      this.setState({
        q,
        selected: 0,
        matches: [],
      })
      return
    }
    const re = new RegExp(value)
    let matches = []
    let seen = {}
    this.index.forEach(pair => {
      if (seen[pair[2]]) return
      if (pair[0].match(re)) {
        seen[pair[2]] = true
        if (pair[1].indexOf(value) === 0) {
          matches.unshift(pair[2])
        } else {
          matches.push(pair[2])
        }
      }
    })
    this.setState({
      q,
      selected: 0,
      matches: matches.slice(0, 10),
    })
  }
  handleSelect(id){
    const nodes = this.props.hierarchy.nodes
    const node = nodes[id]
    this.props.onSelect && this.props.onSelect(node)
    this.setState({ q: "", selected: 0, matches: [], })
  }
  handleCancel(){
    this.props.onCancel && this.props.onCancel()
    this.setState({ q: "", selected: 0, matches: [], })
  }
  render() {
    // const suggestions = this.state.suggestions.map((suggestion))
    const nodes = this.props.hierarchy.nodes
    const q = this.state.q
    const selected = this.state.selected
    const matches = this.state.matches.map((match, i) => {
      const node = nodes[match]
      const parent = nodes[node.parent]
      let label;
      if (node.is_attribute) {
        label = (
          <span>
            {formatLabel(parent.name, q)}
            {' '}<small>{'('}{formatLabel(node.name, q)}{')'}</small>
          </span>
        )
      }
      else {
        label = formatLabel(node.name, q)
      }
      return (
        <div
          key={i}
          className={selected === i ? 'selected' : ''}
          onClick={() => this.handleSelect(node.id)}
          onMouseEnter={() => this.setState({ selected: i })}
        >
          {label}
        </div>
      )
    })
    return (
      <div className="autocomplete">
        <input
          type="text"
          name="q"
          value={this.state.q}
          onKeyDown={this.handleKeyDown}
          onChange={this.handleChange}
          autoFocus
          autoCapitalize="off"
          autoComplete="off"
          placeholder="Start typing a name"
        />
        <div className="matches">
          {matches}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  hierarchy: state.hierarchy,
  image: state.image,
  onSelect: ownProps.onSelect,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
    image: bindActionCreators({ ...actions.image }, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Autocomplete);
