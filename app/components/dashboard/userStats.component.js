import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';

import actions from '../../actions'

class UserStats extends Component {
  componentWillMount(){
    this.props.actions.image.stats()
  }
  render(){
    const stats = this.props.image.stats
    if (!stats) return null
    return (
      <div>
        <ul className="userStats">
          <Stat value={stats.image.total} label={'images'} />
          <Stat value={stats.image.complete} label={'complete'} />
          <Stat value={stats.image.incomplete} label={'incomplete'} />
        </ul>
        <ul className="userStats">
          <Stat value={stats.annotations.total} label={'annotation{}'} />
          <Stat value={stats.annotations.user} label={'yours'} />
          <Stat value={stats.annotations.today} label={'today'} />
        </ul>
      </div>
    )
  }
}
function Stat(props) {
  return (
    <li>
      <b>{props.value}</b>
      <span>{courtesyS(props.value, props.label)}</span>
    </li>
  )
}

function courtesyS(n, s, pl) {
  pl = pl || "s"
  return n !== 1 ? s.replace('{}', pl) : s.replace('{}', '')
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  image: state.image,
});

const mapDispatchToProps = (dispatch) => ({
  actions: {
    image: bindActionCreators({ ...actions.image }, dispatch),
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(UserStats);
