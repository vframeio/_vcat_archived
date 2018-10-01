import React from 'react'
import { NavLink } from 'react-router-dom'

export default function ActiveLink({
  to,
  className = 'navlink',
  children
}) {
  return (
    <span className={className}>
      <NavLink to={to}>
        {children}
      </NavLink>
    </span>
  )
}
