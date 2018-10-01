import React from 'react'

require('./arrows.css')

function ArrowLeft () { return <div className='arrowLeft' /> }
function ArrowRight () { return <div className='arrowRight' /> }
function ArrowUp () { return <div className='arrowUp' /> }
function ArrowDown () { return <div className='arrowDown' /> }

export {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
}