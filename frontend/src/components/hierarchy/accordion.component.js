import React from 'react';
import { Link } from 'react-router-dom'

import './accordion.css'

import rootNode from './rootNode'

const MIN_COLLAPSED_DEPTH = 2

export default function Accordion(props){
  const { node, nodes, children } = props
  let openNodes = [node.id]
  let parentNode = nodes[node.parent] || rootNode
  if (node !== rootNode) {
    let count = 0
    while (parentNode !== rootNode && count < 11) {
      openNodes.push(parentNode.id)
      parentNode = nodes[parentNode.parent] || rootNode
      count += 1
    }
  }
  return (
    <div className='accordion'>
      <h5><Link to="/categories/">Categories</Link></h5>
      <AccordionItem
        node={rootNode}
        nodes={nodes}
        children={children}
        openNodes={openNodes}
        selected={node.id}
        depth={0}
      />
    </div>
  )
}

function AccordionItem(props) {
  let { selected, node, nodes, children, openNodes } = props
  const id = node.id
  const childIds = children[id]
  openNodes = openNodes.concat()
  const nextOpen = openNodes.pop()
  if (!childIds || !childIds.length) return null
  const childLinks = childIds.filter(id => id in nodes).map(id => [nodes[id].name || "", nodes[id]])
    .sort( (a, b) => a[0].localeCompare(b[0]) )
    .map( (pair, i) => {
      const node = pair[1]
      const isOpen = nextOpen === node.id || props.depth < MIN_COLLAPSED_DEPTH
      const isSelected = selected === node.id
      const isSelectedClass = isSelected ? 'active nav-item' : 'nav-item'
      return (
        <li className={isSelectedClass} key={i}>
          <Link to={"/categories/" + node.id}>
            {node.name}
            {node.is_attribute ? '' : ' (' + children[node.id].length + ')'}
          </Link>
          {isOpen &&
            <AccordionItem
              node={node}
              nodes={nodes}
              children={children}
              openNodes={openNodes}
              selected={selected}
              depth={props.depth+1}
            />
          }
        </li>
      )
    })
  return (
    <ul className='nav'>
      {childLinks}
    </ul>
  )
}

    // breadcrumbs.unshift(<Link key={parentNode.id} to={"/hierarchy/" + parentNode.id}>{parentNode.name}</Link>)
    // breadcrumbs.unshift(
    //   <Link key={'root'} to={"/categories/"}>VCAT</Link>
    // )
    // breadcrumbs.push(
    //   <Link key={'item'} to={"/categories/" + node.id} className="name">{node.name}</Link>
    // )
