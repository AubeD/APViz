var margin2 = {top: 20, right: 20, bottom: 20, left: 35},
    width2 = 500 - margin2.left - margin2.right,
    height2 = 200 - margin2.top - margin2.bottom;

var imgHeight2 = height2*0.75;
var imgWidth2 = width2*0.8;


//-- Create the SVG --//
var svg2 = d3.select("#graph2").append("svg")
  .attr("width", width2)
  .attr("height", height2)
  .append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

  // Scales  
  var y2 = d3.scaleLinear()
    .range([imgHeight2, 0]);
  
  var t2 = d3.scaleTime()
    .range([0, imgWidth2]);

  // Date format https://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
  var parseTime  = d3.timeParse("%Y-%m-%d %H:%M:%S.000")
  
  var color = d3.scaleOrdinal(d3.schemeCategory20) 



  // Load stocks data
  // Ex: 0: {symbol: "MSFT", date: "Jan 2000", price: "39.81"}
  d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/exercise.csv', function(error, raw2) {
    //console.log(raw)
    //var symbols = [];
    console.log(imgHeight2);

    // Data pre-processing
    raw2.forEach(function(d, i) {
      
      // String to INT
      d.value = +d.distance;     
 
      // Parsing time
      
      d.date = new Date(d.start_time);
      //console.log(d.value);
      //console.log(d.date);
    });


    
    // Calculated on the flat dataset
    t2.domain(d3.extent(raw2, function(d) {
      return d.date;
    }))
    
    y2.domain([0, d3.max(raw2, function(d) {
      return d.value;
    })])

    function sortByDateAscending(a, b) {
        // Dates will be cast to numbers automagically:
        return a.date - b.date;
    }

    raw2 = raw2.sort(sortByDateAscending);
    
    // We update the x-scale using the Temporal scale t
    var xAxis = d3.axisBottom()
      .scale(t2)
      .tickFormat(displayDate);
    var yAxis = d3.axisLeft()
      .scale(y2);
    
    // Line generator
    var line = d3.line()//.curve(d3.curveCardinal)
      .x(function(d) { return t2(d.date); }) // Update X mapping
      .y(function(d) { return y2(d.value); }) // Update Y mapping

      //console.log(raw);

    svg2.selectAll(".line").data([raw2]).enter()
      .append("path")
      .attr("class", "line")
      .attr("d", function(d) { 
        //console.log(line(d)); 
        return line(d); })  
      .attr("stroke", color(1))
      .attr("fill", "none");

    var line2 = d3.line()//.curve(d3.curveCardinal)
      .x(function(d) { return t(d.date); }) // Update X mapping
      .y(function(d) { return y(d.value); }) // Update Y mapping

    
    svg2.append('g')
      .attr('transform', 'translate(0,' + imgHeight2 + ')')
      .attr('class', 'x axis')
      .call(xAxis);

    svg2.append('g')
      .attr('transform', 'translate(0,' + 0 + ')')
      .attr('class', 'y axis')
      .call(yAxis);

  });