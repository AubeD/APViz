var width = 960,
    height = 136,
    cellSize = 17; // cell size

var format = d3.timeFormat("%Y-%m-%d");
var tooltip = d3.select("body")
      .append("div").attr("id", "tooltip")
      .attr('class', 'hidden tooltip')
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .text("a simple tooltip");


var color = d3.scaleLinear().domain([100,7000])
    .interpolate(d3.interpolateHcl)
  .range([d3.rgb("#E0FFFF"), d3.rgb('#000080')]);

var svg = d3.select("body").selectAll("svg")
    .data(d3.range(2018, 2020)) 
  .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
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
              return color(data.get(d))
    })
    //  Tooltip
      rect.on("mouseover", mouseover);
      rect.on("mouseout", mouseout);
      function mouseover(d) {
        tooltip.style("visibility", "visible");
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var c=formatDate(parseDate('2019-01-01'))
        if (data.get(d)==undefined){
        var purchase_text = d+": "+" aucune activité";}
        else {var purchase_text = d + ": " +data.get(d)+" mètres";}

        tooltip.transition()        
                    .duration(200)      
                    .style("opacity", .9);      
        tooltip.html(purchase_text)  
                    .style("left", (d3.event.pageX)+20 + "px")     
                    .style("top", (d3.event.pageY) + "px"); 
      }
      function mouseout (d) {
        tooltip.style('visibility','hidden');
      }

});

function toutes(){d3.csv("exercises.csv", function(error, csv) {
  if (error) throw error;

    var data = d3.nest()
    .key(function(d) { return d.end_time; })
        .rollup(function (d) {
            return d[0].distance;
        })
    .map(csv);

    rect
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
              return color(data.get(d))})

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
    rect
        .filter(function (d) {
            return data.has(d);
        })
    .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-08-06'))
        var a2=formatDate(parseDate('2018-08-16'))
        if (d>a1 & d<a2){
              return color(data.get(d))}
        var b1=formatDate(parseDate('2018-10-19'))
        var b2=formatDate(parseDate('2018-11-06'))
        if (d>b1 & d<b2){
            return color(data.get(d))}
        var c1=formatDate(parseDate('2018-12-29'))
        var c2=formatDate(parseDate('2019-01-07'))
        if (d>c1 & d<c2){
            return color(data.get(d))}
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
    rect
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-02-01'))
        var a2=formatDate(parseDate('2018-08-01'))
        if (d>a1 & d<a2){
              return color(data.get(d))}
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
    rect
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-08-05'))
        var a2=formatDate(parseDate('2018-08-07'))
        if (d>a1 & d<a2){
              return color(data.get(d))}
        var b1=formatDate(parseDate('2018-08-27'))
        var b2=formatDate(parseDate('2018-10-21'))
        if (d>b1 & d<b2){
            return color(data.get(d))}
        var c1=formatDate(parseDate('2018-11-05'))
        var c2=formatDate(parseDate('2018-12-22'))
        if (d>c1 & d<c2){
            return color(data.get(d))}
        var d1=formatDate(parseDate('2019-01-06'))
        if (d>d1){
            return color(data.get(d))}
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
    rect
        .filter(function (d) {
            return data.has(d);
        })
        .style("fill", function(d) {
        var parseDate = d3.utcParse("%Y-%m-%d")
        var formatDate = d3.timeFormat("%Y-%m-%d")
        var a1=formatDate(parseDate('2018-07-31'))
        var a2=formatDate(parseDate('2018-08-06'))
        if (d>a1 & d<a2){
              return color(data.get(d))}
        var b1=formatDate(parseDate('2018-08-15'))
        var b2=formatDate(parseDate('2018-08-26'))
        if (d>b1 & d<b2){
            return color(data.get(d))}
        var c1=formatDate(parseDate('2018-12-21'))
        var c2=formatDate(parseDate('2018-12-30'))
        if (d>c1 & d<c2){
            return color(data.get(d))}
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
  return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
      + "H" + w0 * cellSize + "V" + 7 * cellSize
      + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
      + "H" + (w1 + 1) * cellSize + "V" + 0
      + "H" + (w0 + 1) * cellSize + "Z";
}
