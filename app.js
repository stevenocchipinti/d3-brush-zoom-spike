// TODO: Will probably need to re-introduce the `.zoom` element (b937032)
// because dragging the area will successfully translate the chart, but above
// the area does not work

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleTime().range([0, width]),
    original_x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x),
    yAxis = d3.axisLeft(y).tickSize(-width).tickFormat("");

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.area()
    .curve(d3.curveMonotoneX)
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.price); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    .call(zoom);

function zoomed() {
  var t = d3.event.transform;
  x.domain(t.rescaleX(original_x).domain());
  focus.select(".area").attr("d", area);
  focus.select(".axis--x").call(xAxis);
}

// -----------------------------------------------------------------------------
// Data loading
// -----------------------------------------------------------------------------

d3.csv("sp500.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) { return d.price; })]);
  original_x.domain(x.domain());

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  focus.append("path")
      .datum(data)
      .attr("class", "area")
      .attr("d", area);
});

function type(d) {
  var parseDate = d3.timeParse("%b %Y");
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}