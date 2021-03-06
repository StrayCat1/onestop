import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import TimeFilter from '../time/TimeFilter'
import {
  granuleRemoveDateRange,
  granuleUpdateDateRange,
} from '../../../actions/routing/GranuleSearchStateActions'
import {submitGranuleSearch} from '../../../actions/routing/GranuleSearchRouteActions'

const mapStateToProps = state => {
  const {startDateTime, endDateTime} = state.search.granuleFilter
  return {
    startDateTime: startDateTime,
    endDateTime: endDateTime,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    updateDateRange: (startDate, endDate) => {
      dispatch(granuleUpdateDateRange(startDate, endDate))
    },
    removeDateRange: () => {
      dispatch(granuleRemoveDateRange())
    },
    submit: () => {
      dispatch(submitGranuleSearch(ownProps.history, ownProps.match.params.id))
    },
  }
}

const GranuleTimeFilterContainer = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TimeFilter)
)

export default GranuleTimeFilterContainer
