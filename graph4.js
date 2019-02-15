var margin = {top: 20, right: 20, bottom: 20, left: 35},
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

var imgHeight = height*0.85, imgWidth = width*0.8

//-- Create the SVG --//
var svg = d3.select("#graph4").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scales  
  var y = d3.scaleLinear()
    .range([imgHeight, 0]);
  
  var t = d3.scaleTime()
    .range([0, imgWidth]);

  // Date format https://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
  var parseTime  = d3.timeParse("%b %Y")
  
  var color = d3.scaleOrdinal(d3.schemeCategory20) 

  // Load stocks data
  // Ex: 0: {symbol: "MSFT", date: "Jan 2000", price: "39.81"}
  d3.csv('https://raw.githubusercontent.com/LyonDataViz/MOS5.5-Dataviz/master/data/stocks.csv', function(error, raw) {
    
    var symbols = [];
    
    var data = []
    
    // Data pre-processing
    raw.forEach(function(d, i) {
      
      if(symbols.indexOf(d.symbol) < 0) {
        symbols.push(d.symbol)
        data[symbols.indexOf(d.symbol)] = [];
      }
      
      // String to INT
      d.value = +d.price;     
 
      // Parsing time
      d.date = parseTime(d.date)
      data[symbols.indexOf(d.symbol)].push(d);
    });
    
    // Calculated on the flat dataset
    t.domain(d3.extent(raw, function(d) {
      return d.date;
    }))
    
    y.domain([0, d3.max(raw, function(d) {
      return d.value;
    })])
    
    // We update the x-scale using the Temporal scale t
    var xAxis = d3.axisBottom()
      .scale(t);

    var yAxis = d3.axisLeft()
      .scale(y);
    
    // Line generator
    var line = d3.line()//.curve(d3.curveCardinal)
      .x(function(d) { return t(d.date); }) // Update X mapping
      .y(function(d) { return y(d.price); }) // Update Y mapping

    svg.selectAll(".line").data(data).enter()
      .append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d); })  
      .attr("stroke", function(d, i) { return color(i); })
      .attr("fill", "none");
    
    svg.append('g')
      .attr('transform', 'translate(0,' + imgHeight + ')')
      .attr('class', 'x axis')
      .call(xAxis);

    svg.append('g')
      .attr('transform', 'translate(0,' + 0 + ')')
      .attr('class', 'y axis')
      .call(yAxis);

  });