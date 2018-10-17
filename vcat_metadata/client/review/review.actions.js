import * as types from '../types'
import { store } from '../store'

const getSavedFromStore = () => store.getState().review.saved

// add a hash/frame to the reviewer
export const save = opt => dispatch => {
  let saved = getSavedFromStore()
  let hash = [opt.hash] || {
    frames: {},
    hash: opt.hash,
    verified: opt.verified,
  }
  if (opt.frame) {
    hash.frames[opt.frame] = true
  }
  hash.verified = opt.verified
  saved[opt.hash] = {}
  dispatch({ type: types.review.save, saved })
}

// mark a frame as being not for export
export const unsave = (opt) => dispatch => {
  let saved = getSavedFromStore()
  let hash = saved[opt.hash]
  if (hash) {
    if (opt.frame && hash.frames[opt.frame]) {
      hash.frames[opt.frame] = false
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
