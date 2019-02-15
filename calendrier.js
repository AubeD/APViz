

var width = 960,
    height = 136,
    cellSize = 17; // cell size

var percent = d3.format(".1%"),
    format = d3.timeFormat("%Y-%m-%d");
var tooltip = d3.select('body').append('div')
            .attr('class', 'hidden tooltip');


var color = d3.scaleLinear().domain([100,7000])
    .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#E0FFFF"), d3.rgb('#000080')]);

var svg = d3.select("body").selectAll("svg")
    .data(d3.range(2018, 2020)) 
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "RdYlGn")
  .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });
svg.append("text")
  .attr("transform", "translate(30,-5)")
	.text(function (d){return "Janvier"})
svg.append("text")
  .attr("transform", "translate(100,-5)")
	.text(function (d){return "Février"})
svg.append("text")
  .attr("transform", "translate(175,-5)")
	.text(function (d){return "Mars"})
svg.append("text")
  .attr("transform", "translate(250,-5)")
	.text(function (d){return "Avril"})
svg.append("text")
  .attr("transform", "translate(330,-5)")
	.text(function (d){return "Mai"})
svg.append("text")
  .attr("transform", "translate(395,-5)")
	.text(function (d){return "Juin"})
svg.append("text")
  .attr("transform", "translate(474,-5)")
	.text(function (d){return "Juillet"})
svg.append("text")
  .attr("transform", "translate(550,-5)")
	.text(function (d){return "Août"})
svg.append("text")
  .attr("transform", "translate(610,-5)")
	.text(function (d){return "Septembre"})
svg.append("text")
  .attr("transform", "translate(695,-5)")
	.text(function (d){return "Octobre"})
svg.append("text")
  .attr("transform", "translate(760,-5)")
	.text(function (d){return "Novembre"})
svg.append("text")
  .attr("transform", "translate(835,-5)")
	.text(function (d){return "Décembre"})
  

var rect = svg.selectAll(".day")
    .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d),d) * cellSize; })
    .attr("y", function(d) { return d.getDay() * cellSize; })
    .datum(format);

rect.append("title")
    .text(function(d) { return d; });

svg.selectAll(".month")
    .data(function(d) { return d3.timeMonths(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);

d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);
    console.log(data)

    rect
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
              return color(data.get(d))})
    .select("title")
        .text(function (d) {
            return d + ": " +data.get(d)+" mètres";
        })

});

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0),t0),
      d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1),t1);
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}

