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

  var y_temp = d3.scaleLinear()
    .range([imgHeight2, 0]);

  
  var t2 = d3.scaleTime()
    .range([0, imgWidth2]);

  // Date format https://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
  var parseTime  = d3.timeParse("%Y-%m-%d %H:%M:%S.000");
  
  var color = d3.scaleOrdinal(d3.schemeCategory20);



  // Load stocks data
  // Ex: 0: {symbol: "MSFT", date: "Jan 2000", price: "39.81"}
  d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/exercise.csv', function(error, raw2) {

    // Data pre-processing
    raw2.forEach(function(d, i) {
      
      // String to INT
      d.value = +d.distance;     
 
      // Parsing time
      
      d.date = new Date(d.start_time);
      //console.log(d.value);
      //console.log(d.date);
    });

    d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/weather-lyon.csv', function(error, meteo_lyon) {
    console.log(meteo_lyon);
    // Data pre-processing
      meteo_lyon.forEach(function(d, i) {
        
        // String to INT

        d.temp = +d.Temperature-272.15;     
   
        // Parsing time
        
        d.date = new Date(d.Date);
        if(d.temp<-10){
        console.log(d.temp);
        }
        //console.log(d.date);
        if(d.Temperature==0){
          meteo_lyon.splice(meteo_lyon.indexOf(d), 1);
        }
      });


    
    // Calculated on the flat dataset
    var date_min = d3.min(raw2, function(d) {return d.date;});
    var date_max = d3.max(meteo_lyon, function(d){return d.date;});
    t2.domain([date_min,date_max]);
    
    y2.domain([0, d3.max(raw2, function(d) {
      return d.value;
    })]);

    y_temp.domain([0, d3.max(meteo_lyon, function(d) {
      return d.temp;
    })]);

    function sortByDateAscending(a, b) {
        // Dates will be cast to numbers automagically:
        return a.date - b.date;
    }

    meteo_lyon = meteo_lyon.sort(sortByDateAscending);

    //console.log(meteo_lyon);

    raw2 = raw2.sort(sortByDateAscending);
    
    // We update the x-scale using the Temporal scale t
    var xAxis = d3.axisBottom()
      .scale(t2)
      .tickFormat(displayDate);
    var yAxis = d3.axisLeft()
      .scale(y2);
    var yAxis_temp = d3.axisLeft()
      .scale(y_temp);
    
    // Line generator
    var line = d3.line()//.curve(d3.curveCardinal)
      .defined(function(d) {return d.date < date_max && d.date > date_min;})
      .x(function(d) { return t2(d.date); }) // Update X mapping
      .y(function(d) { return y2(d.value); }) // Update Y mapping

    var line_temp = d3.line()//.curve(d3.curveCardinal)
      .defined(function(d) {return (d.date < date_max && d.date > date_min);})
      .x(function(d) { return t2(d.date); }) // Update X mapping
      .y(function(d) { return y_temp(d.temp); }) // Update Y mapping

      //console.log(raw);

    svg2.selectAll(".line").data([raw2]).enter()
      .append("path")
      .attr("class", "line")
      .attr("d", function(d) { 
        //console.log(line(d)); 
        return line(d); })  
      .attr("stroke", color(1))
      .attr("fill", "none");

      /*svg2.selectAll(".line_temp").data([meteo_lyon]).enter()
      .append("path")
      .attr("class", "line_temp")
      .attr("d", function(d) { 
        //console.log(line(d)); 
        return line_temp(d); })  
      .attr("stroke", color(0))
      .attr("fill", "none");*/

      svg2.selectAll(".circle").data(meteo_lyon).enter()
      .append("circle")
      .attr("class", "circle")
      .attr("r", 1)
      .attr("cx", function(d) { 
        
        //console.log(d.date); 
        return t2(d.date); })  
      .attr("cy", function(d) { 
        //console.log(d.date); 
        return y_temp(d.temp); })
      .attr("stroke", function(d){
        if (d.date<date_min){
          return "none";
        }
        return color(0);
      })
      .attr("fill", "none");

    
    svg2.append('g')
      .attr('transform', 'translate(0,' + imgHeight2 + ')')
      .attr('class', 'x axis')
      .call(xAxis);

    svg2.append('g')
      .attr('transform', 'translate(0,' + 0 + ')')
      .attr('class', 'y axis')
      .call(yAxis);

    svg2.append('g')
      .attr('transform', 'translate('+imgWidth2+',' + 0 + ')')
      .attr('class', 'y axis')
      .call(yAxis_temp);

  });


  });