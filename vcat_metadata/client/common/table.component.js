import React from 'react'

import { formatName } from '../util'

const __HR__ = '__HR__'

export function TableObject({ tag, object, order, summary }) {
  if (!object) return null
  if (object === 'loading') {
    return <div className='tableObject loading'>{tag}{': Loading'}</div>
  }
  if (object.err) {
    return <div className='tableObject error'>{tag}{' Error: '}{object.err}</div>
  }
  let objects = Object.keys(object)
  if (order) {
    const grouped = objects.reduce((a, b) => {
      const index = order.indexOf(b)
      if (index !== -1) {
        a.order.push([index, b])
      } else {
        a.alpha.push(b)
      }
      return a
    }, { order: [], alpha: [] })
    objects = grouped.order
      .sort((a, b) => a[0] - b[0])
      .map(([i, s]) => s)
    if (!summary) {
      objects = objects
        // .concat([__HR__])
        .concat(grouped.alpha.sort())
    }
  } else {
    objects = objects.sort()
  }
  return (
    <div>
      {tag && <h3>{tag}</h3>}
      <table className={'tableObject ' + tag}>
        <tbody>
          {objects.map((key, i) => (
            <TableRow key={key + '_' + i} name={key} value={object[key]} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableArray({ tag, list }) {
  if (!list) return null
  return (
    <div>
      {tag && <h3>{tag}</h3>}
      <table className={'tableArray ' + tag}>
        <tbody>
          {list.map((value, i) => (
            <tr key={tag + '_' + i}>
              <TableCell value={value} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableTuples({ tag, list }) {
  if (!list) return null
  return (
    <div>
      {tag && <h3>{tag}</h3>}
      <table className={'tableTuples ' + tag}>
        <tbody>
          {list.map(([key, ...values], i) => (
            <tr key={tag + '_' + i}>
              <th>{formatName(key)}</th>
              {values.map((value, j) => (
                <TableCell key={i + '_' + j} value={value} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function TableRow({ name, value }) {
  if (name === __HR__) {
    return (
      <tr>
        <th className='tr'>
          <hr />
        </th>
      </tr>
    )
  }
  return (
    <tr>
      <th>{formatName(name)}</th>
      <TableCell name={name} value={value} />
    </tr>
  )
}

export function TableCell({ value }) {
  if (value && typeof value === 'object') {
    if (value._raw) {
      value = value.value
    } else if (value.length) {
      value = <TableArray nested tag={''} list={value} />
    } else {
      value = <TableObject nested tag={''} object={value} />
    }
  }
  return (
    <td>{value}</td>
  )
}
