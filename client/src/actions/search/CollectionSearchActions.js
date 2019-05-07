import {
  buildSearchAction,
  buildGetAction,
  showLoading, hideLoading
} from './SearchActions'
import {
  assembleSearchRequest,
  assembleGranuleSearchRequest,
  decodeQueryString,
  encodeQueryString,
} from '../../utils/queryUtils'
import {
  // collectionDetailGranulesRequest,
  // collectionDetailGranulesSuccess,
  collectionDetailRequest,
  collectionDetailSuccess,
  collectionSearchRequest,
  collectionSearchSuccess,
} from './CollectionRequestActions'

import {
  granuleSearchRequest,
  granuleSearchSuccess,
  granuleSearchStart,
  granuleSearchComplete,
  granuleSearchError,
} from './GranuleRequestActions'
import {
  triggerGranuleSearch
} from './GranuleSearchActions'
import {
  // collectionClearFacets,
  // collectionClearSelectedIds,
  // collectionToggleSelectedId,
  granuleUpdateFilters,
} from './GranuleFilterActions'
import _ from 'lodash'
import {showErrors} from '../ErrorActions'
import {
  collectionClearFacets,
  collectionClearSelectedIds,
  collectionToggleSelectedId,
  collectionUpdateFilters,
} from './CollectionFilterActions'
import {
  apiPath,
  getCollectionIdFromDetailPath,
  getCollectionIdFromGranuleListPath,
} from '../../utils/urlUtils'
import {checkForErrors} from '../../utils/responseUtils'
import {
  collectionClearDetailGranulesResult,
  collectionClearResults,
  collectionMetadataReceived,
  // collectionUpdateDetailGranulesTotal,
  collectionUpdateTotal,
} from './CollectionResultActions'
import {fetchConfig} from '../ConfigActions'
import {fetchCounts, fetchInfo} from './InfoActions'

export const triggerSearch = (retrieveFacets = true) => { // TODO rename to collection something something
  const bodyBuilder = state => {
    const body = assembleSearchRequest(state, false, retrieveFacets)
    const inFlight =
      state.search.collectionRequest.collectionSearchRequestInFlight
    const hasQueries = body && body.queries && body.queries.length > 0
    const hasFilters = body && body.filters && body.filters.length > 0
    if (inFlight || !(hasQueries || hasFilters)) {
      return undefined
    }
    return body
  }
  const prefetchHandler = dispatch => {
    dispatch(showLoading())
    dispatch(collectionSearchRequest())
  }
  const successHandler = (dispatch, payload) => {
    const result = _.reduce(
      payload.data,
      (map, resource) => {
        return map.set(
          resource.id,
          _.assign({type: resource.type}, resource.attributes)
        )
      },
      new Map()
    )

    if (retrieveFacets) {
      dispatch(collectionMetadataReceived(payload.meta))
    }
    dispatch(collectionUpdateTotal(payload.meta.total))
    dispatch(collectionSearchSuccess(result))
    dispatch(hideLoading())
  }
  const errorHandler = (dispatch, e) => {
    dispatch(hideLoading())
    dispatch(showErrors(e.errors || e))
    dispatch(collectionClearFacets())
    dispatch(collectionSearchSuccess(new Map()))
  }

  return buildSearchAction(
    'collection',
    bodyBuilder,
    prefetchHandler,
    successHandler,
    errorHandler
  )
}

export const getCollection = collectionId => {
  const prefetchHandler = dispatch => {
    dispatch(showLoading())
    dispatch(collectionDetailRequest(collectionId))
  }

  const successHandler = (dispatch, payload) => {
    dispatch(collectionDetailSuccess(payload.data[0], payload.meta))
    dispatch(hideLoading())
  }

  const errorHandler = (dispatch, e) => {
    dispatch(hideLoading())
    dispatch(showErrors(e.errors || e))
    dispatch(collectionDetailSuccess(null))
  }

  return buildGetAction(
    'collection',
    collectionId,
    prefetchHandler,
    successHandler,
    errorHandler
  )
}

export const loadCollections = newQueryString => {
  return (dispatch, getState) => {
    if (newQueryString.indexOf('?') === 0) {
      newQueryString = newQueryString.slice(1)
    }
    const searchFromQuery = decodeQueryString(newQueryString)
    const searchFromState = _.get(getState(), 'search.collectionFilter')
    if (!_.isEqual(searchFromQuery, searchFromState)) {
      dispatch(collectionClearResults())
      dispatch(collectionClearDetailGranulesResult())
      dispatch(collectionClearSelectedIds())
      dispatch(collectionUpdateFilters(searchFromQuery))
      dispatch(triggerSearch())
    }
  }
}

export const showCollections = history => {
  return (dispatch, getState) => {
    dispatch(collectionClearSelectedIds())
    const query = encodeQueryString(getState())
    if (!_.isEmpty(query)) {
      const locationDescriptor = {
        pathname: '/collections',
        search: `?${query}`,
      }
      history.push(locationDescriptor)
    }
  }
}

// export const showGranulesList = (history, id) => { // TODO replace with showGranules from GranuleSearchActions? need to decombobulate the extra layer of state though...
//   if (!id) {
//     return
//   }
//   return (dispatch, getState) => {
//     const query = encodeQueryString(getState())
//     const locationDescriptor = {
//       pathname: `/collections/granules/${id}`,
//       search: `?${query}`,
//     }
//     history.push(locationDescriptor)
//   }
// }

export const showDetails = (history, id) => {
  if (!id) {
    return
  }
  return (dispatch, getState) => {
    const query = encodeQueryString(getState())
    const locationDescriptor = {
      pathname: `/collections/details/${id}`,
      search: _.isEmpty(query) ? null : `?${query}`,
    }
    history.push(locationDescriptor)
  }
}

export const loadDetails = path => {
  return (dispatch, getState) => {
    if (!getState().search.collectionRequest.collectionDetailRequestInFlight) {
      const detailId = getCollectionIdFromDetailPath(path)
      dispatch(getCollection(detailId))
    }
  }
}