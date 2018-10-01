import React from 'react';
require('./userSelect.css')

export default function UserSelect (props) {
  const options = props.list.map((el,i) => {
    return (
      <option key={i} value={el.id}>
        {el.username}
      </option>
    )
  })
  return (
    <select
      className="form-select user-select"
      value={props.value || 0}
      onChange={props.onChange}
    >
      <option value={0}>Assign a user</option>
      {options}
    </select>
  )
}