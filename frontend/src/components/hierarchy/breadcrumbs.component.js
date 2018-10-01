import React from 'react';
import { Link } from 'react-router-dom'

import rootNode from './rootNode'

export default function Breadcrumbs(props){
  const { node, nodes } = props
  let breadcrumbs = []
  let parentNode = nodes[node.parent] || rootNode
  if (node !== rootNode) {
    let count = 0
    while (parentNode !== rootNode && count < 11) {
      breadcrumbs.unshift(<Link key={parentNode.id} to={"/hierarchy/" + parentNode.id}>{parentNode.name}</Link>)
      parentNode = nodes[parentNode.parent] || rootNode
      count += 1
    }
    breadcrumbs.unshift(
      <Link key={'root'} to={"/hierarchy/"}>VCAT</Link>
    )
    breadcrumbs.push(
      <Link key={'item'} to={"/hierarchy/" + node.id} className="name">{node.name}</Link>
    )
  }
  return (
    <div className="breadcrumbs">
      {breadcrumbs}
    </div>
  )
}