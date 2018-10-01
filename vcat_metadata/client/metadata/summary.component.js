import React from 'react'

import {
  Sugarcube, MediaRecord, MediaInfo, Places365, Coco
} from '.'

export default function Summary() {
  return (
    <div>
      <Sugarcube summary />
      <MediaRecord />
      <MediaInfo summary />
      <Places365 summary />
      <Coco summary />
    </div>
  )
}
