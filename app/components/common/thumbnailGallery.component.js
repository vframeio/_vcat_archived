import React from 'react';
import { Link } from 'react-router-dom';

import Thumbnail from './thumbnail.component'

export default function ThumbnailGallery (props) {
  const seen = {}
  const images = (props.images || []).filter(img => {
    if (seen[img.id]) return false
    seen[img.id] = true
    return true
  }).map((img, i) => {
    if (! img.ext.match(/(gif|jpg|jpeg|png)$/)) return null;
    return (
      <Link to={"/images/annotate/" + img.id} key={i}>
        <Thumbnail
          node={img}
          type="images"
          alt={"Thumbnail"}
          showAnnotations={props.showAnnotations}
        />
      </Link>
    )
  })
  if (images.length) {
    return (
      <div className='column col-12 gallery'>
        {images}
      </div>
    )
  }
  return null
}
