import * as types from '../types'
import * as cache from './review.cache'

const initialState = {
  saved: cache.getSaved()
}

export default function reviewReducer(state = initialState, action) {
  const { saved } = action
  switch (action.type) {
    case types.review.save:
    case types.review.unsave:
    case types.review.refresh:
      cache.setSaved(saved)
      return {
        ...state,
        saved: { ...saved },
      }

    case types.review.reset:
      cache.setSaved({})
      return {
        ...state,
        saved: {},
      }

    default:
      return state
  }
}
