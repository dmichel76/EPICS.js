import React from 'react'
import ReactDOM from 'react-dom'

import TextUpdate from './textUpdate.js'
import Led from './led.js'
import Tank from './tank.js'
import TimePlot from './timeplot.js'
import Gauge from './gauge.js'
import Heatmap from './heatmap.js'

import Button from 'react-bootstrap/lib/Button'
import PageHeader from 'react-bootstrap/lib/PageHeader'
import Panel from 'react-bootstrap/lib/Panel'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

class App extends React.Component {
  render() {
    return (
      <div>
        <PageHeader>EPICS.js demo <small>EPICS on the web, using Socket.io and REACT.js and HTM5 canvas </small></PageHeader>
        <Grid>
          <Row className="show-grid">
            <Col md={4}>
              <Panel header="LEDs">
                <Led pv="TEST:BLINK"/>
                <Led pv="TEST:BLINK" oncolor="blue" offcolor="darkblue"/>
                <Led pv="TEST:BLINK" size="60" ontext="ON" offtext="OFF" oncolor="lightgreen" offcolor="darkgrey"/>
                <Led pv="TEST:BLINK" size="105" strokecolor="black" strokecolor2="grey" strokewidth="15"/>
                <Led pv="TEST:BLINK" size="70" strokecolor="grey" oncolor="yellow" offcolor="orange"/>
              </Panel>
            </Col>
            <Col md={5}>
              <Panel header="Tank">
                <Tank pv="TEST:PROGRESS" scale="yes" scalestep="10" scalefontsize="10" scalecolor="red" text="${pv}" fontcolor="white" fontsize="25"/>
                <Tank pv="TEST:PROGRESS2" scale="yes" scalestep="40" minimum="-100" maximum="100" foreground="red" background="lightgrey"/>
              </Panel>
            </Col>
            <Col md={3}>
              <Panel header="TextUpdate">
                <TextUpdate bb="yes" width="100" pretext="state is " pv="TEST:BLINK"/>
                <TextUpdate background="black" fontcolor="white" width="150" pretext="Processing " pv="TEST:PROGRESS" posttext="%"/>
              </Panel>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col md={8}>
              <Panel header="Heatmap">
                <Heatmap pv="TEST:PROGRESS2" showcolormap="no"/>
                <Heatmap pv="TEST:PROGRESS2" bb="yes" colormap="hot" colormap_nshades="100"/>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
