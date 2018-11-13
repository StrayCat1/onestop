import React from 'react'

const Method = {
  GET: "GET",
  HEAD: "HEAD",
  POST: "POST"
}

const ReadyState = {
  UNSENT: 0,
  OPENED: 1,
  HEADERS_RECEIVED: 2,
  LOADING: 3,
  DONE: 4
}

const TEST_DOWNLOAD_FILE_URL = "http://data.nodc.noaa.gov/ndbc/co-ops/2016/12/NOS_1611400_201612_D1_v00.nc"

const printInfoXHR = (label, xhr, event) => {
  console.log(label)
  console.log("xhr:", xhr)
  console.log("event:", event)
}

export default class Downloader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  handleOnLoadStart = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnLoadStart", xhr, progressEvent)
    }
  }

  handleOnProgress = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnProgress", xhr, progressEvent)
    }
  }

  handleOnAbort = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnAbort", xhr, progressEvent)
    }
  }

  handleOnError = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnError", xhr, progressEvent)
      console.error(xhr.statusText)
    }
  }

  handleOnLoad = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnLoad", xhr, progressEvent)
      switch(xhr.readyState) {
        case ReadyState.UNSENT:
          // the request object has been constructed
          console.log("UNSENT: The request object has been constructed.")
          break;
        case ReadyState.OPENED:
          // The open() method has been successfully invoked.
          // During this state request headers can be set using setRequestHeader(),
          // and the fetch can be initiated using the send() method.
          console.log("OPENED: The open() method has been successfully invoked.\n" +
              "\tDuring this state request headers can be set using setRequestHeader(),\n" +
              "\tand the fetch can be initiated using the send() method.")
          break;
        case ReadyState.HEADERS_RECEIVED:
          // All redirects (if any) have been followed,
          // and all HTTP headers of the response have been received.
          console.log("HEADERS_RECEIVED: All redirects (if any) have been followed,\n" +
              "\tand all HTTP headers of the response have been received.")
          break;
        case ReadyState.LOADING:
          // The response’s body is being received.
          console.log("LOADING: The response’s body is being received.")
          break;
        case ReadyState.DONE:
          // The data transfer has been completed,
          // or something went wrong during the transfer (e.g. infinite redirects).
          console.log("DONE: The data transfer has been completed," +
              "\tor something went wrong during the transfer (e.g. infinite redirects).")
          break;
        default:
          break;
      }
      if (xhr.readyState === ReadyState.DONE) {
        if (xhr.status === 200) {
          let json_obj = JSON.parse(xhr.responseText)
          status = true
          this.setState({ json_obj })
        } else {
          console.error(xhr.statusText)
        }
      }
    }
  }

  handleOnTimeout = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnTimeout", xhr, progressEvent)
    }
  }

  handleOnLoadEnd = xhr => {
    return progressEvent => {
      printInfoXHR("handleOnLoadEnd", xhr, progressEvent)
    }
  }

  handleOnReadyStateChange = xhr => {
    return event => {
      printInfoXHR("handleOnReadyStateChange", xhr, event)
      if(this.readyState == ReadyState.HEADERS_RECEIVED) {
        console.log("HEADERS_RECEIVED:", xhr.getResponseHeader("Content-Type"))
      }
    }
  }

  getInfo = () => {
    let xhr = new XMLHttpRequest()
    xhr.open(Method.HEAD, TEST_DOWNLOAD_FILE_URL, true)
    xhr.onloadstart = this.handleOnLoadStart(xhr)
    xhr.onprogress = this.handleOnProgress(xhr)
    xhr.onabort = this.handleOnAbort(xhr)
    xhr.onerror = this.handleOnError(xhr)
    xhr.onload = this.handleOnLoad(xhr)
    xhr.ontimeout = this.handleOnTimeout(xhr)
    xhr.onloadend = this.handleOnLoadEnd(xhr)
    xhr.onreadystatechange = this.handleOnReadyStateChange(xhr)
    xhr.send(null)
  }

  download = () => {
    let xhr = new XMLHttpRequest()

    xhr.open(Method.GET, TEST_DOWNLOAD_FILE_URL, true)
    xhr.onloadstart = this.handleOnLoadStart(xhr)
    xhr.onprogress = this.handleOnProgress(xhr)
    xhr.onabort = this.handleOnAbort(xhr)
    xhr.onerror = this.handleOnError(xhr)
    xhr.onload = this.handleOnLoad(xhr)
    xhr.ontimeout = this.handleOnTimeout(xhr)
    xhr.onloadend = this.handleOnLoadEnd(xhr)
    xhr.onreadystatechange = this.handleOnReadyStateChange(xhr)
    xhr.send(null)
  }

  // componentDidMount() {
  //
  // }

  render()
  {
    return (
        <div>
          <button onClick={this.download}>Downloader!</button>
        </div>
    )
  }
}