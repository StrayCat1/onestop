import React from 'react'
import ky from 'ky'

export default class KyDownloader extends React.Component {

  download = () => {
    (async () => {
      const json = await ky.post('https://example.com', {json: {foo: true}}).json()

      console.log(json)
      //=> `{data: '🦄'}`
    })()
  }

  render() {
    return (
        <div>
          <button onClick={this.download}>Ky Download!</button>
        </div>
    )
  }
}