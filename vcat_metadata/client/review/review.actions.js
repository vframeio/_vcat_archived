import { format } from 'date-fns'
import stringify from 'csv-stringify'
import saveAs from 'file-saver'

import * as types from '../types'
import { store } from '../store'

const getSavedFromStore = () => store.getState().review.saved

// add a hash/frame to the reviewer
export const save = opt => dispatch => {
  console.log('save', opt)
  let saved = getSavedFromStore()
  let hash = saved[opt.hash] || {
    frames: {},
    hash: opt.hash,
    verified: opt.verified,
  }
  if (opt.frame) {
    hash.frames[parseInt(opt.frame, 10)] = true
  }
  hash.verified = opt.verified
  saved[opt.hash] = hash
  dispatch({ type: types.review.save, saved })
}

// mark a frame as being not for export
export const unsave = (opt) => dispatch => {
  console.log('unsave', opt)
  let saved = getSavedFromStore()
  let hash = saved[opt.hash]
  if (hash) {
    if (opt.frame && hash.frames[parseInt(opt.frame, 10)]) {
      hash.frames[parseInt(opt.frame, 10)] = false
    }
  }
  dispatch({ type: types.review.unsave, saved })
}

// refresh the stored frames
export const refresh = () => dispatch => {
  let saved = getSavedFromStore()
  Object.keys(saved).forEach(key => {
    const hash = saved[key]
    let deleted = 0
    const frames = Object.keys(hash.frames)
    frames.forEach(frame => {
      if (!hash.frames[frame]) {
        delete hash.frames[frame]
        deleted += 1
      }
    })
    if (!frames.length || frames.length === deleted) {
      delete saved[key]
    }
  })
  dispatch({ type: types.review.refresh, saved })
}

// clear the stored frames
export const clear = () => dispatch => {
  dispatch({ type: types.review.clear })
}

export const exportCSV = () => dispatch => {
  console.log('export CSV')
  let saved = getSavedFromStore()
  const results = Object.keys(saved).sort().map(key => {
    const { verified, hash, frames } = saved[key]
    return [
      verified,
      hash,
      Object.keys(frames).join(', '),
    ]
  })
  stringify(results, (err, csv) => {
    const blob = new Blob([csv], {
      type: 'text/csv'
    })
    saveAs(blob, 'vsearch_investigation_' + format(new Date(), 'YYYYMMDD_HHmm') + '.csv')
  })
}