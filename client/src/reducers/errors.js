import Immutable from 'seamless-immutable'
import {CLEAR_ERRORS, SET_ERRORS} from '../actions/ErrorActions'

import {
  GRANULE_SEARCH_ERROR,
} from '../actions/search/GranuleRequestActions'

export const initialState = Immutable(new Set())

const errors = (state = initialState, action) => {
  switch (action.type) {
    case SET_ERRORS:
      return Immutable(action.errors)

    case GRANULE_SEARCH_ERROR:
      console.log('error reducer got granule error! (note, this does not push to the error display page)')
      return Immutable(action.errors)

    case CLEAR_ERRORS:
      return initialState

    default:
      return state
  }
}

export default errors
