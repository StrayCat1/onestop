import React, { Component } from 'react'

const styleContainer = {
  display: 'flex',
}

const styleIcon = {
  display: 'flex',
  alignItems: 'center',
  marginRight: '0.616em',
  width: '2em',
  height: '2em',
}

const styleIconImage = {
  width: '100%',
  height: '100%',
}

const styleText = {
  width: '100%',
  alignSelf: 'center',
  fontSize: '1em',
  fontWeight: 'normal',
  margin: '0'
}

export default class FilterHeading extends Component {
  render() {
    return (
        <div style={{...styleContainer, ...this.props.style}}>
          <div style={styleIcon} aria-hidden='true'>
            <img
                style={styleIconImage}
                src={this.props.icon}
                alt={`${this.props.text} Icon`}
            />
          </div>
          <h2 style={styleText}>{this.props.text}</h2>
        </div>
    )
  }
}
