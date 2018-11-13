import {connect} from 'react-redux'
import {withRouter} from 'react-router'
import KyDownloader from './KyDownloader'

const mapStateToProps = state => {
  return {
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
  }
}

const DownloaderContainer = withRouter(
    connect(mapStateToProps, mapDispatchToProps)(KyDownloader)
)

export default KyDownloader

