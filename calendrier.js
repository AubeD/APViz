var width1 = 960,
    height1 = 136,
    cellSize1 = 17; 

var format1 = d3.timeFormat("%Y-%m-%d");
var tooltip1 = d3.select("#calendrier").append('div')
            .attr('class', 'hidden tooltip');


var color1 = d3.scaleLinear().domain([100,7000])
    .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#E0FFFF"), d3.rgb('#000080')]);

var svg1 = d3.select("#calendrier").selectAll("svg")
    .data(d3.range(2018, 2020)) 
  .enter().append("svg")
    .attr("width", width1)
    .attr("height", height1)
  .append("g")
    .attr("transform", "translate(" + ((width1 - cellSize1 * 53) / 2) + "," + (height1 - cellSize1 * 7 - 1) + ")");

svg1.append("text")
    .attr("transform", "translate(-6," + cellSize1 * 3.5 + ")rotate(-90)")
    .style("text-anchor", "middle")
    .text(function(d) { return d; });
svg1.append("text")
  .attr("transform", "translate(30,-5)")
	.text(function (d){return "Janvier"})
svg1.append("text")
  .attr("transform", "translate(100,-5)")
	.text(function (d){return "Février"})
svg1.append("text")
  .attr("transform", "translate(175,-5)")
	.text(function (d){return "Mars"})
svg1.append("text")
  .attr("transform", "translate(250,-5)")
	.text(function (d){return "Avril"})
svg1.append("text")
  .attr("transform", "translate(330,-5)")
	.text(function (d){return "Mai"})
svg1.append("text")
  .attr("transform", "translate(395,-5)")
	.text(function (d){return "Juin"})
svg1.append("text")
  .attr("transform", "translate(474,-5)")
	.text(function (d){return "Juillet"})
svg1.append("text")
  .attr("transform", "translate(550,-5)")
	.text(function (d){return "Août"})
svg1.append("text")
  .attr("transform", "translate(610,-5)")
	.text(function (d){return "Septembre"})
svg1.append("text")
  .attr("transform", "translate(695,-5)")
	.text(function (d){return "Octobre"})
svg1.append("text")
  .attr("transform", "translate(760,-5)")
	.text(function (d){return "Novembre"})
svg1.append("text")
  .attr("transform", "translate(835,-5)")
	.text(function (d){return "Décembre"})
  

var rect1 = svg1.selectAll(".day")
    .data(function(d) { return d3.timeDays(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
  .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize1)
    .attr("height", cellSize1)
    .attr("x", function(d) { return d3.timeWeek.count(d3.timeYear(d),d) * cellSize1; })
    .attr("y", function(d) { return d.getDay() * cellSize1; })
    .datum(format1);


svg1.selectAll(".month")
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

    rect1
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
              return color1(data.get(d))})
    .select("title")
        .text(function (d) {
            return d + ": " +data.get(d)+" mètres";
        })

});

function monthPath(t0) {
  var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
      d0 = t0.getDay(), w0 = d3.timeWeek.count(d3.timeYear(t0),t0),
      d1 = t1.getDay(), w1 = d3.timeWeek.count(d3.timeYear(t1),t1);
  return "M" + (w0 + 1) * cellSize1 + "," + d0 * cellSize1
      + "H" + w0 * cellSize1 + "V" + 7 * cellSize1
      + "H" + w1 * cellSize1 + "V" + (d1 + 1) * cellSize1
      + "H" + (w1 + 1) * cellSize1 + "V" + 0
      + "H" + (w0 + 1) * cellSize1 + "Z";
}
