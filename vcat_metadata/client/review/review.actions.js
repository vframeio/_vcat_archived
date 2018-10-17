import { format } from 'date-fns'
import stringify from 'csv-stringify'
import saveAs from 'file-saver'

import * as types from '../types'
import { store } from '../store'
import { verify } from '../util'

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

// export a CSV of the stored sha256's
export const exportCSV = () => dispatch => {
  console.log('export CSV')
  let saved = getSavedFromStore()
  const results = Object.keys(saved).sort().map(key => {
    const { verified, hash, frames } = saved[key]
    return [
      hash,
      Object.keys(frames).join(', '),
      verify(verified),
    ]
  })
  stringify(results, (err, csv) => {
    const blob = new Blob([csv], {
      type: 'text/csv'
    })
    saveAs(blob, 'vsearch_investigation_' + format(new Date(), 'YYYYMMDD_HHmm') + '.csv')
  })
}

// // check duplicates
// export const checkDuplicates = () => {
//   post('/api/images/import/search/', {
//     saved: window.store.get('saved') || [],
//   }).then(res => {
//     console.log(res)
//     const { good, bad } = res
//     // did_check = true
//     window.store.set('saved', good)
//     if (!bad.length) {
//       return alert("No duplicates found.")
//     }
//     bad.forEach(path => {
//       const el = document.querySelector('img[src="' + path + '"]')
//       if (el) el.parentNode.classList.remove('saved')
//     })
//     return alert("Untagged " + bad.length + " duplicate" + (bad.length === 1 ? "" : "s") + ".")
//   })
// }
