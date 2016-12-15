import Immutable from 'immutable'
import { combineReducers } from 'redux-immutable'
import config from './config/ConfigReducer'
import search from './search/SearchReducer'
import collections from './result/collections/CollectionReducer'
import details from './detail/DetailReducer'
import facets from './search/facet/FacetReducer'
import map from './search/map/MapReducer'
import temporal from './search/temporal/TemporalReducer'
import loading from './loading/LoadingReducer'
import errors from './error/ErrorReducer'
import granules from './result/granules/GranulesReducer'
import routing from './routing/RoutingReducer'

const reducer = combineReducers({
  config,
  search,
  collections,
  details,
  routing,
  facets,
  temporal,
  map,
  loading,
  errors,
  granules
})

export default reducer
