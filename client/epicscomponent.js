import React from 'react'
import ReactDOM from 'react-dom'

import io from 'socket.io-client'
let socket = io(window.location.host)

module.exports = class EPICSComponent extends React.Component {

  constructor(props){
    super(props)

    this.bb = (typeof this.props.bb == "undefined") ? "no" : this.props.bb
    this.bbcolor = (typeof this.props.bbcolor == "undefined") ? "purple" : this.props.bbcolor
    this.bbstrokewidth = (typeof this.props.bbstrokewidth == "undefined") ? 5 : this.props.bbstrokewidth
    this.state = { pvvalue: '' }
  }

  componentDidMount() {
    this.register_pv(this.props.pv)
    this.monitor_pv(this.props.pv)
  }

  register_pv (pvname) {
    socket.emit('register', pvname)
  }

  monitor_pv (pvname) {
    socket.on(pvname, data => {
      this.setState({ pvvalue : data.val }, this.onChange(data))
    })
  }

  onChange(pv) {
    // do nothing here
  }

  render(){
    return (
        <div >
          {this.props.children}
        </div>
    )
  }

}
