import React from 'react'
import { Link } from 'react-router-dom'
import { site } from '../../util/site'

export default function LoggedOutDashboard (props) {
  return (
    <div className='dashboard logged-out'>
      <h1>welcome to vcat</h1>
      <h2>{site.client_name}</h2>
      <br /><br />
      <Link to='/accounts/login'><button>Log In</button></Link>
    </div>
  )
}