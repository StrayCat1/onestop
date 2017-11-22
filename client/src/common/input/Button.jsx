import React, { Component } from 'react'

const styleDefault = {
  color: 'white',
  background: '#277CB2', // $color_primary
  borderRadius: '0.309em',
  border: 'transparent',
  textAlign: 'center',
  fontSize: '1.25em',
  margin: 0,
  padding: '0.618em',
}

const styleHoverDefault = {
  background: 'linear-gradient(#277CB2, #28323E)',
}

const stylePressDefault = {
  outline: '1px solid yellow',
}

const styleFocusDefault = {
  /* DO NOT REMOVE */
  /* placeholder if we decide universal styles for button focus */
  /* more than likely, you will pass in props.styleFocus to customize or override per specific button */
}

const styleIconPadding = {
  padding: "0 0.618em",
}

export default class Button extends Component {
  componentWillMount() {
    this.setState({
      hovering: false,
      pressing: false,
      pressingGlobal: false,
      focusing: false,
    })
  }

  componentDidMount() {
    document.addEventListener('mouseup', this.handleGlobalMouseUp, false)
    document.addEventListener('mousedown', this.handleGlobalMouseDown, false)
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handleGlobalMouseUp, false)
    document.removeEventListener('mousedown', this.handleGlobalMouseDown, false)
  }

  handleMouseOver = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        hovering: true,
        pressing: prevState.pressingGlobal,
      }
    })
  }

  handleMouseOut = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        hovering: false,
        pressing: false,
      }
    })
  }

  handleGlobalMouseUp = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        pressingGlobal: false,
      }
    })
  }

  handleGlobalMouseDown = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        pressingGlobal: true,
      }
    })
  }

  handleMouseDown = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        pressing: true,
      }
    })
  }

  handleMouseUp = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        pressing: false,
      }
    })
  }

  handleFocus = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        focusing: true,
      }
    })
  }

  handleBlur = event => {
    this.setState(prevState => {
      return {
        ...prevState,
        focusing: false,
      }
    })
  }

  render() {
    const {
      text,
      icon,
      onClick,
      style,
      styleHover,
      stylePress,
      styleFocus,
      ariaLabel
    } = this.props

    const stylesMerged = {
      ...styleDefault,
      ...style,
      ...(this.state.hovering ? { ...styleHoverDefault, styleHover } : {}),
      ...(this.state.pressing ? { ...stylePressDefault, stylePress } : {}),
      ...(this.state.focusing ? { ...styleFocusDefault, styleFocus } : {}),
      ...(icon && !text ? styleIconPadding : {}),
    }

    return (
      <button
        style={stylesMerged}
        onClick={onClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        aria-label={ariaLabel}
      >
        {icon ? (
          <img src={icon} style={{ width: '2em', height: '2em' }} />
        ) : null}
        {text}
      </button>
    )
  }
}
