import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import Thumbnail from '../common/thumbnail.component'

const groupFns = {
  date: {
    pair: (a) => [a.created_at.split("T")[0], a],
    sort: sortReverseAlphabetical,
    heading: (a) => a.created_at.split("T")[0],
  },
  source: {
    pair: (a) => [ a.from_sa ? "_sa:" + a.sa_hash : getDomain(a.source_url), a ],
    sort: sortAlphabetical,
    heading: (a) => a.from_sa ? "sa:" + a.sa_hash : getDomain(a.source_url),
  },
  tag: {
    sort: undefined,
    heading: (a, nodes, id) => {
      const tag = nodes[id] || {}
      let name = tag.name || "Unknown"
      if (tag && tag.is_attribute) {
        const parent = nodes[tag.parent]
        if (parent) {
          name = parent.name + " (" + name + ")"
        }
      }
      return name
    }
  },
}

function sortReverseAlphabetical(a,b){
  return b[0].localeCompare(a[0])
}
function sortAlphabetical(a,b){
  return a[0].localeCompare(b[0])
}
function getDomain(url) {
  return (url || "Unknown Source").replace(/https?:\/\//,"").replace(/\/.*/,"").replace(/www\./, "")
}

class ImageIndex extends Component {
  constructor(props) {
    super()
    this.state = {
      groupBy: "date",
    }
  }
  componentWillMount() {
    this.fetch(this.props)
  }
  componentWillReceiveProps(nextProps){
    if (this.props.location.pathname !== nextProps.location.pathname ||
        this.props.location.search !== nextProps.location.search) {
      this.fetch(nextProps)
    }
  }
  fetch(props) {
    let tag
    if (props.location.pathname === "/images/user/") {
      tag = "user/"
    }
    props.actions.image.index(tag, props.location.search)
  }
  render() {
    let fn = groupFns[this.state.groupBy || "date"]

    let imageData = (this.props.image.page.results || []).slice()
    .reverse()
    let mappedImages;

    if (this.state.groupBy === 'tag') {
      mappedImages = []
      imageData.forEach(img => {
        if (img.regions && img.regions.length) {
          img.regions.forEach(region => {
            mappedImages.push([ region.tag, img ])
          })
        } else {
          mappedImages.push([ Infinity, img ])
        }
      })
    } else {
      mappedImages = imageData.map(fn.pair)
    }

    const imageEls = mappedImages
    .sort(fn.sort)
    .reduce((acc, val) => {
      if (acc[acc.length-1][0] !== val[0]) {
        acc.push([val[0], val[1]])
      }
      else {
        acc[acc.length-1].push(val[1])
      }
      return acc
    }, [[]])
    const images = imageEls.map((group, i) => {
      if (group.length < 1) return null
      const heading = fn.heading(group[1], this.props.hierarchy.nodes, group[0])
      const els = group.map((el, i) => {
        if (i === 0) return null
        return (
          <Link to={"/images/annotate/" + el.id} key={i}>
            <Thumbnail
              key={i}
              type={'images'}
              node={el}
              showAnnotations
            />
          </Link>
        )
      })
      return (
        <div key={i}>
          <h4>{heading}</h4>
          <div className="column col-12 gallery">
            {els}
          </div>
        </div>
      )
    })

    const path_partz = this.props.location.pathname.split('?')
    const pathname = path_partz[0]

    let prev_qs, next_qs
    if (this.props.image.page.next) {
      next_qs = this.props.image.page.next.split("?")[1]
    }
    if (this.props.image.page.previous) {
      prev_qs = this.props.image.page.previous.split("?")[1]
    }

    return (
      <div>
        <h2>Images</h2>

        <ul className="tab">
          <li className="tab-item">
            <Link to={"/images/new/"}><button className='btn'>Add image</button></Link>
          </li>
          <li className="tab-item">
            <BoldLink to={"/images/"} currentPath={pathname}>All Images</BoldLink>
          </li>
          <li className="tab-item">
            <BoldLink to={"/images/user/"} currentPath={pathname}>Your Images</BoldLink>
          </li>
          <li className="tab-item tab-action">
            {"Group by "}
            <SelectedButton
              selected={this.state.groupBy === 'date'}
              onClick={() => this.setState({ groupBy: 'date' })}
            >
              Date
            </SelectedButton>
            {" "}
            <SelectedButton
              selected={this.state.groupBy === 'source'}
              onClick={() => this.setState({ groupBy: 'source' })}
            >
              Source
            </SelectedButton>
            {" "}
            <SelectedButton
              selected={this.state.groupBy === 'tag'}
              onClick={() => this.setState({ groupBy: 'tag' })}
            >
              Tag
            </SelectedButton>
          </li>
          {prev_qs &&
            <li className="tab-item tab-action">
              <Link to={pathname + "?" + prev_qs}><button className='btn'>{'<'}</button></Link>
            </li>
          }
          {next_qs &&
            <li className="tab-item tab-action">
              <Link to={pathname + "?" + next_qs}><button className='btn'>{'>'}</button></Link>
            </li>
          }
        </ul>
        {images}
      </div>
    );
  }
}

function BoldLink (props) {
  const { currentPath, ...newProps } = props
  return (
    <Link {...newProps}>
      {props.currentPath === props.to
        ? <b>{props.children}</b>
        : props.children
      }
    </Link>
  )
}

function SelectedButton(props) {
  let className = props.selected ? "btn btn-primary" : "btn"
  return (
    <button className={className} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

const mapStateToProps = (state, ownProps) => ({
  auth: state.auth,
  hierarchy: state.hierarchy,
  image: state.image,
  location: ownProps.location,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    hierarchy: bindActionCreators({ ...actions.hierarchy }, dispatch),
    image: bindActionCreators({ ...actions.image }, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageIndex);
