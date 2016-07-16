import { connect } from 'react-redux'
import { setFocus } from './DetailActions'
import { textSearch } from '../search/SearchActions'
import Detail from './DetailComponent'

const mapStateToProps = (reduxState, reactProps) => {
  const focusedId = reduxState.get('details').get('focusedId')
  const focusedItem = reduxState.get('results').get(focusedId)
  return {
    id: focusedId,
    item: focusedItem ? focusedItem.toJS() : null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => dispatch(setFocus(null)),
    textSearch: (text) => dispatch(textSearch(text))
  }
}

const DetailContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Detail)

export default DetailContainer
