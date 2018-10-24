import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { site } from '../../util/site'

import actions from '../../actions'

class UserStats extends Component {
  componentWillMount(){
    this.props.actions.image.stats()
  }
  render(){
    const stats = this.props.image.stats
    if (!stats) return null
    // <h3>VCAT: Visual Collection, Annotation and Tagging</h3>
    let userWidth = this.props.auth.groups.staff ? (100 * stats.image.user_total / stats.image.total) : 100
    let [userAchievement, nextGoal] = getUserAchievement(stats.annotations.user)
    return (
      <div>
        <h1><b>VCAT:</b> {site.client_name}</h1>
        <div className="userProgress">
          <div>Your progress: {stats.image.user_complete} images complete / {stats.image.user_total} total</div>
          <progress
            className="progress"
            value={stats.image.user_complete}
            max={stats.image.user_total}
            style={{ width: userWidth + "%" }}
          />
        </div>
        <div className="userProgress">
          <div>Project overall progress: {stats.image.complete} images complete / {stats.image.total} total</div>
          <progress
            className="progress"
            value={stats.image.complete}
            max={stats.image.total}
          />
        </div>
        <ul className="userStats">
          <Stat value={stats.annotations.total} label={'total annotations'} />
          <Stat value={stats.annotations.user} label={'annotations by you'} />
          <Stat value={stats.annotations.today} label={'annotations today'} />
          <Stat value={stats.image.total} label={'images in the system'} />
          <Stat value={stats.image.complete} label={'images marked complete'} />
          <Stat value={stats.image.incomplete} label={'images marked incomplete'} />
        </ul>
        <div className='userAchievement'>
          {'You are an '}{userAchievement}
          {nextGoal && '. Make {} annotations to level up!'.replace("{}", nextGoal)}
        </div>
      </div>
    )
  }
}
function Stat(props) {
  return (
    <li>
      {props.value} {props.label}
    </li>
  )
}
function getUserAchievement(total) {
  if (total >= 99){
    return ["Annomaniac!", 0]
  } else if (total > 9){
    return ["Annoprentice", 99 - total]
  }
  return ['Annon00bie', 9 - total]
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
