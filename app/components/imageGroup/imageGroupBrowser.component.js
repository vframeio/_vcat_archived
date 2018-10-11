import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import actions from '../../actions'

import ImageGroupRow from './imageGroupRow.component'

class ImageGroupBrowser extends Component {
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
    let search = props.location.search
    if ((props.userView || props.location.pathname.match("/groups/user/")) && !search.match('assigned_to')) {
      if (! search) search = "?"
      search += "assigned_to=" + props.auth.user.id
    }
    props.actions.imageGroup.index(search)
  }
  render(){
    if (this.props.imageGroup.loading) {
      return (<div>Loading...</div>)
    }
    const page = this.props.imageGroup.page || {}
    const path_partz = this.props.location.pathname.split('?')
    const pathname = path_partz[0]
    let prev_qs, next_qs
    if (page.next) {
      next_qs = page.next.split("?")[1]
    }
    if (page.previous) {
      prev_qs = page.previous.split("?")[1]
    }

    let groups = (page.results || []).map((group, i) => {
      return (
        <ImageGroupRow
          {...this.props}
          group={group}
          key={i}
        />
      )
    })

    if (this.props.userView && !groups.length) {
      groups = (
        <div className="columns">
          <div className="column col-12">
            No groups have been assigned to you.
          </div>
        </div>
      )
    }

    return (
      <div>
        <h4>{this.props.title || "Image Groups"}</h4>
        <ul className="tab">
          {this.props.adminView &&
            <li className="tab-item">
              <Link to={"/images/new/"}><button className='btn'>New Group</button></Link>
            </li>
          }
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
        {groups}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  auth: state.auth,
  user: state.user,
  image: state.image,
  imageGroup: state.imageGroup,
})

const mapDispatchToProps = (dispatch) => ({
  actions: {
    imageGroup: bindActionCreators({ ...actions.imageGroup }, dispatch),
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ImageGroupBrowser);

