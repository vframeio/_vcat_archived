import * as types from '../types'
import * as cache from './review.cache'

const saveCache = cache.getSaved()
const initialState = {
  saved: saveCache,
  count: cache.getSavedCount(saveCache),
  deduped: false,
  dedupe: { count: 0 },
  create: {},
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
        count: cache.getSavedCount(saved),
        saved: { ...saved },
      }

    case types.review.clear:
      cache.setSaved({})
      return {
        ...state,
        count: 0,
        saved: {},
      }

    case types.review.dedupe:
      return {
        ...state,
        deduped: action.deduped,
      }

    case types.review.loading:
      return {
        ...state,
        [action.tag]: { loading: true },
      }

    case types.review.loaded:
      return {
        ...state,
        [action.tag]: action.data || {},
      }

    case types.review.error:
      return {
        ...state,
        [action.tag]: { error: action.err },
      }

    default:
      return state
  }
}
