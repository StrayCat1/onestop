import React from 'react'
import { DateRange } from './TemporalActions'
import DayPicker, { DateUtils } from 'react-day-picker'
import styles from './temporal.css'
import ReactDOM from 'react-dom'
import ToggleDisplay from 'react-toggle-display'
import YearMonthForm from './YearMonthForm'

const currentYear = (new Date()).getFullYear()
const fromMonth = new Date(currentYear - 100, 0, 1, 0, 0)
const toMonth = new Date()

class TemporalSearch extends React.Component {
  constructor(props) {
    super(props)
    this.handleDayClick = this.handleDayClick.bind(this)
    this.handleResetClick = this.handleResetClick.bind(this)
    this.showCurrentDate = this.showCurrentDate.bind(this)
    this.emitRange = this.emitRange.bind(this)
    this.render = this.render.bind(this)
    this.toggleDate = this.toggleDate.bind(this)
    this.state = this.initialState()
    this.handleClick = this.handleClick.bind(this)
  }

  initialState() {
    return {
      from: null,
      to: null,
      initialMonth: toMonth,
      showCalendar: false
    }
  }

  handleDayClick(e, day) {
    const range = DateUtils.addDayToRange(day, this.state)
    this.setState(range)
    this.emitRange(range.from, range.to)
  }

  showCurrentDate() {
    this.setState({showCalendar: !this.state.showCalendar})
  }

  handleResetClick(e) {
    e.preventDefault()
    this.setState({
      from: null,
      to: null
    })
    this.emitRange(this.setState.from, this.setState.to)
  }

  emitRange(from, to) {
    this.props.updateOnChange(from, DateRange.START_DATE)
    this.props.updateOnChange(to, DateRange.END_DATE)
  }

  handleClick(e) {
    var component = ReactDOM.findDOMNode(this.refs.daypicker)
    if (this.state.showCalendar && !component.contains(e.target) && e.srcElement.id !== 'inputDate') {
      this.toggleDate()
    }
  }

  componentWillMount() {
    document.addEventListener('click', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClick, false);
  }

  toggleDate() {
    this.state.showCalendar = !this.state.showCalendar
    this.forceUpdate()
  }

  render() {
    const { from, to } = this.state
    return (
      <div>
        <div>
          <div className={styles.dateInputLeft}>
            <input
              id="inputDate"
              type="text"
              value={ this.state.from }
              placeholder="YYYY-MM-DD"
              onFocus={ this.showCurrentDate }
            />
          </div>
          <div className={styles.dateInputRight} >
            <input
              id="inputDate"
              type="text"
              value={ this.state.to }
              placeholder="YYYY-MM-DD"
              onFocus={ this.showCurrentDate }
            />
          </div>
        </div>
        <ToggleDisplay show={this.state.showCalendar}>
          <div className={styles.calendarBox}>
            <DayPicker
              ref="daypicker"
              onDayClick={ this.handleDayClick }
              initialMonth={ this.state.initialMonth }
              fromMonth={ fromMonth }
              toMonth={ toMonth }
              selectedDays={ day => DateUtils.isDayInRange(day, { from, to }) }
              captionElement={
                <YearMonthForm onChange={ initialMonth => this.setState({ initialMonth }) } />
              }
            />
            <div className={styles.resetSelection}>
              <button href="#" onClick={ this.handleResetClick }><strong>Reset</strong></button>
            </div>
          </div>
        </ToggleDisplay>
      </div>
    )
  }
}

export default TemporalSearch
