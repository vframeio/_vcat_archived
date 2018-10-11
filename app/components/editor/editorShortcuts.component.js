import React from 'react'

export default function EditorShortcuts () {
  return (
    <div className='shortcuts'>
      <div>
        Keyboard&nbsp;Shortcuts:
      </div>
      <div>
        <div>
          <EditorKey>&larr;</EditorKey>
          <EditorKey>&rarr;</EditorKey>
          <EditorKey>&uarr;</EditorKey>
          <EditorKey>&darr;</EditorKey>
        </div>
        <EditorLabel>Nudge Box</EditorLabel>
      </div>
      
      <div>
        <div>
          <EditorKey className='word'>SHIFT</EditorKey>
          {' + '}
          <EditorKey>&larr;</EditorKey>
          <EditorKey>&rarr;</EditorKey>
          <EditorKey>&uarr;</EditorKey>
          <EditorKey>&darr;</EditorKey>
        </div>
        <EditorLabel>Resize Box</EditorLabel>
      </div>
      
      <div>
        <div>
          <EditorKey className='word'>D</EditorKey>
        </div>
        <EditorLabel>Delete Box</EditorLabel>
      </div>

      <div>
        <div>
          <EditorKey className='word'>E</EditorKey>
        </div>
        <EditorLabel>Edit Label</EditorLabel>
      </div>

      <div>
        <div>
          <EditorKey className='word'>L</EditorKey>
        </div>
        <EditorLabel>Toggle Labels</EditorLabel>
      </div>
    </div>
  )
}

function EditorKey (props) {
  let className = 'editorKey'
  if (props.className) {
    className += ' ' + props.className
  }
  return (
    <div className={className}>
      {props.children}
    </div>
  )
}
function EditorLabel (props) {
  return (
    <div className='editorLabel'>
      {props.children}
    </div>
  )
}


