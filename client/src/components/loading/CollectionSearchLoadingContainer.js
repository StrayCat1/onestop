import {connect} from 'react-redux'
import LoadingBar from './LoadingBar'

import {withRouter} from 'react-router'

const mapStateToProps = state => {
  const {loading} = state.search.loading

  const text = loading ? 'loading' : 'load complete'
  const loadingId = `loading-id::${loading}`

  return {
    loading: loading ? 1 : 0,
    loadingText: text,
    loadingAlertId: loadingId,
  }
}

const CollectionSearchLoadingContainer = withRouter(connect(mapStateToProps)(LoadingBar))

export default CollectionSearchLoadingContainer
