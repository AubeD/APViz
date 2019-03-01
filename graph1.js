var width1 = 960,
    height1 = 136,
    cellSize1 = 17; 

var format1 = d3.timeFormat("%Y-%m-%d");

var color1 = d3.scaleLinear().domain([100,7000])
    .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#E0FFFF"), d3.rgb('#000080')]);

var svg1 = d3.select("#graph1").selectAll("svg")
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
rect1.append("title")
    .text(function(d) { return d; });


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

function toutes(){d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);

    rect1
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
              return color1(data.get(d))})

}); 
}
function grenoble(){d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);
    if (true){
    rect1
        .filter(function (d) {
            return data.has(d);
        })
    .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-08-06'))
        var a2=formatDate(parseDate('2018-08-16'))
        if (d>a1 & d<a2){
              return color1(data.get(d))}
        var b1=formatDate(parseDate('2018-10-19'))
        var b2=formatDate(parseDate('2018-11-06'))
        if (d>b1 & d<b2){
            return color1(data.get(d))}
        var c1=formatDate(parseDate('2018-12-29'))
        var c2=formatDate(parseDate('2019-01-07'))
        if (d>c1 & d<c2){
            return color1(data.get(d))}
    })
    }

}); 
}
function londres(){d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);
    if (true){
    rect1
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-02-01'))
        var a2=formatDate(parseDate('2018-08-01'))
        if (d>a1 & d<a2){
              return color1(data.get(d))}
    })
    }

}); 
}
function lyon(){d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);
    if (true){
    rect1
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-08-05'))
        var a2=formatDate(parseDate('2018-08-07'))
        if (d>a1 & d<a2){
              return color1(data.get(d))}
        var b1=formatDate(parseDate('2018-08-27'))
        var b2=formatDate(parseDate('2018-10-21'))
        if (d>b1 & d<b2){
            return color1(data.get(d))}
        var c1=formatDate(parseDate('2018-11-05'))
        var c2=formatDate(parseDate('2018-12-22'))
        if (d>c1 & d<c2){
            return color1(data.get(d))}
        var d1=formatDate(parseDate('2019-01-06'))
        if (d>d1){
            return color1(data.get(d))}
    })
    }

}); 
}
function rennes(){d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);
    if (true){
    rect1
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-07-31'))
        var a2=formatDate(parseDate('2018-08-06'))
        if (d>a1 & d<a2){
              return color1(data.get(d))}
        var b1=formatDate(parseDate('2018-08-15'))
        var b2=formatDate(parseDate('2018-08-26'))
        if (d>b1 & d<b2){
            return color1(data.get(d))}
        var c1=formatDate(parseDate('2018-12-21'))
        var c2=formatDate(parseDate('2018-12-30'))
        if (d>c1 & d<c2){
            return color1(data.get(d))}
    })
    }

}); 
}
d3.select("input[value=\"toutes\"]").on("click", toutes);
d3.select("input[value=\"grenoble\"]").on("click", grenoble);
d3.select("input[value=\"londres\"]").on("click", londres);
d3.select("input[value=\"lyon\"]").on("click", lyon);
d3.select("input[value=\"rennes\"]").on("click", rennes); 

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