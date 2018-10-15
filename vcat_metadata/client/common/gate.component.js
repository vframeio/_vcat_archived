import React from 'react'
import { connect } from 'react-redux'

function Gate(props) {
  const { app, tag, View } = props
  const data = app[tag]
  if (!data) return null
  if (data === 'loading') {
    return <div className='tableObject loading'>{tag}{': Loading'}</div>
  }
  if (data.err) {
    return <div className='tableObject error'>{tag}{' Error: '}{data.err}</div>
  }
  return <View data={data} {...props} />
}

const mapStateToProps = state => ({
  app: state.metadata
})

export default connect(mapStateToProps)(Gate)
