import React, { Component } from 'react';
import logo from './logo.svg';
import { scaleLinear, scaleTime } from "d3-scale";
import { axisBottom } from "d3-axis";
import { line } from "d3";
import { zoom } from "d3-zoom";
import { select } from "d3-selection";
import './App.css';

const MARGINS = {top: 20, right: 20, bottom: 20, left: 20};
const HEIGHT = 500 - MARGINS.left - MARGINS.right;
const WIDTH = 500 - MARGINS.top - MARGINS.bottom;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xScale: scaleTime()
        .range([0, WIDTH])
        .domain([new Date("2017-01-01"), new Date("2017-01-22")]),

      xScalePrime: scaleTime()
        .range([0, WIDTH])
        .domain([new Date("2017-01-01"), new Date("2017-01-22")]),

      yScale: scaleLinear()
        .range([HEIGHT, 0])
        .domain([20, 26]),

      data: [
        { date: new Date("2017-01-01"), value: 25 },
        { date: new Date("2017-01-08"), value: 23 },
        { date: new Date("2017-01-15"), value: 24 },
        { date: new Date("2017-01-22"), value: 21 }
      ]
    };
  }

  componentDidMount() { this.setupZoom(); }
  componentDidUpdate() { this.setupZoom(); }
  setupZoom() {
    const zoomed = () => {
      const e = require("d3-selection").event;
      this.setState({
        ...this.state,
        xScale: e.transform.rescaleX(this.state.xScalePrime)
      });
    }
    const zoomBehaviour = zoom()
      .scaleExtent([1, Infinity])
      .translateExtent([[0, 0], [WIDTH, HEIGHT]])
      .extent([[0, 0], [WIDTH, HEIGHT]])
      .on("zoom", zoomed);
    select(this.refs.focus).call(zoomBehaviour);
  }

  render() {
    const xAxisRef = (ref) => {
      select(ref).call(
        axisBottom(this.state.xScale)
      );
    };

    const lineGenerator = line()
      .x((d) => { return this.state.xScale(d.date); })
      .y((d) => { return this.state.yScale(d.value); });
    const linePath = lineGenerator(this.state.data)

    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React + D3</h2>
        </div>

        <svg style={{ border: "1px dashed #000" }} width={500} height={500}>
          <defs>
            <clipPath id="clip">
              <rect width={WIDTH} height={HEIGHT}/>
            </clipPath>
          </defs>

          <g ref="focus" className="focus" transform={`translate(${MARGINS.left}, ${MARGINS.top})`}>
            <g
              ref={xAxisRef}
              className="xAxis"
              transform={`translate(0, ${HEIGHT})`}
            />
            <path
              className="line"
              style={{fill: "none", stroke: "steelblue", clipPath: "url(#clip)"}}
              d={linePath}
            />
            <rect
              className="zoom"
              height={HEIGHT}
              width={WIDTH}
              style={{ cursor: "move", fill: "none", pointerEvents: "all" }}
            ></rect>
          </g>

        </svg>
      </div>
    );
  }
}

export default App;
