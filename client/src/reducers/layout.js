import Immutable from 'seamless-immutable'
import {isDetailPage, isGranuleListPage} from '../utils/urlUtils'

import {
  TOGGLE_LEFT_OPEN,
  TOGGLE_RIGHT_OPEN,
  TOGGLE_MAP,
  SET_HEADER_MENU_OPEN,
  SHOW_GRANULE_VIDEO,
} from '../actions/LayoutActions'

export const initialState = Immutable({
  leftOpen: true,
  showRight: false,
  showMap: false,
  onDetailPage: false,
  headerMenuOpen: false,
  granuleVideo: null,
})

export const layout = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_LEFT_OPEN:
      return Immutable.set(state, 'leftOpen', action.open)
    case TOGGLE_RIGHT_OPEN:
      return Immutable.set(state, 'rightOpen', action.open)
    case TOGGLE_MAP:
      const previousShowMap = state.showMap
      return Immutable.set(state, 'showMap', !previousShowMap)
    case SHOW_GRANULE_VIDEO:
      return Immutable.set(state, 'granuleVideo', action.granuleVideo)
    case SET_HEADER_MENU_OPEN:
      return Immutable.set(state, 'headerMenuOpen', action.value)
    default:
      return state
  }
}

export default layout
