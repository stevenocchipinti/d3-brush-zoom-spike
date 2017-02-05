var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 20, left: 20},
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

var line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.price); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

function zoomed() {
  x.domain(d3.event.transform.rescaleX(original_x).domain());
  focus.select(".line").attr("d", line);
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
      .attr("class", "line")
      .attr("d", line);

  focus.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .call(zoom)
});

function type(d) {
  var parseDate = d3.timeParse("%b %Y");
  d.date = parseDate(d.date);
  d.price = +d.price;
  return d;
}
