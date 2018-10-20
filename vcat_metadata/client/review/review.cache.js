import session from '../session'
import { store } from '../store'
import { imageUrl } from '../util'

export const getSavedUrls = () => {
  const saved = getSavedFromStore()
  Object.keys(saved).sort().map(key => {
    const { verified, hash, frames } = saved[key]
    return Object.keys(frames).map(frame => imageUrl(verified, hash, frame))
  }).reduce((a, b) => ((b && b.length) ? a.concat(b) : a), [])
}

export const getSavedCount = () => {
  const saved = getSavedFromStore()
  Object.keys(saved).sort().map(key => {
    const { frames } = saved[key]
    return Object.keys(frames).filter(frame => frames[frame]).length
  }).reduce((a, b) => (a + b), 0)
}

export const getSavedFromStore = () => store.getState().review.saved

export const getSaved = () => {
  try {
    return JSON.parse(session('saved')) || {}
  } catch (e) {
    console.log('error getting saved!', e)
    return {}
  }
}

export const setSaved = (saved) => {
  try {
    session('saved', JSON.stringify(saved))
  } catch (e) {
    console.log('error setting saved!', e)
  }
}
