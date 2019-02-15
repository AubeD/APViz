//-- Margin setup --//
var margin = {top: 20, right: 20, bottom: 20, left: 35},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var imgHeight = height*0.85, imgWidth = width*0.8

//-- Create the SVG --//
var svg3 = d3.select("#graph3").append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//-- Parsers --//
var parseDate = d3.utcParse("%Y-%m-%d %H:%M:%S.%L"),
    parseDateBis = d3.timeParse("%e-%_m-%Y"),
    parseTime = d3.timeParse("%H:%M"),
    parseTimeOffset = d3.timeParse("UTC+%Z")
    displayDate = d3.timeFormat("%b %y"),
    displayTime = d3.timeFormat("%H:%M"),
    displayValue = d3.format(",.0f");

d3.csv("exercise.csv", function(error, data) {
  if (error) throw error;

  //-- Managing data --//
  data.forEach( function(d){
    d["end_time"] = parseDate(d["end_time"])
    d["start_time"] = parseDate(d["start_time"])
    d["duration"] = +d["duration"]/1000
    d["exercise_type"] = +d["exercise_type"]
    d["calorie"] = +d["calorie"]
    d["distance"] = +d["distance"]
    d["max_speed"] = +d["max_speed"]
    d["mean_speed"] = +d["mean_speed"]
    d["create_time"] = parseDate(d["create_time"])
    d["update_time"] = parseDate(d["update_time"])
    d["time_offset"] = (d["time_offset"]);
  })

  var nested_data = d3
    .nest()
    .key( function(d){
      return d["start_time"].getDate() + "-" +  (d["start_time"].getMonth()+1) + "-" + d["start_time"].getFullYear();})
    .entries(data)

  //-- Scales and axis --//

  //Dates max and min to define the scales' domains
  var min_date = d3
    .min(nested_data.map( function(d){return parseDateBis(d.key)})),
      max_date = d3
    .max(nested_data.map( function(d){return parseDateBis(d.key)}));
  // Scales definition
  var xScale = d3
    .scaleBand()
    .range([0, imgWidth])
    .domain([min_date, max_date]),
    yScale = d3
    .scaleTime()
    .range([0,imgHeight])
    .domain([ parseTime("00:00"), parseTime("23:59") ]),
    xBandWidth = d3
    .scaleBand()
    .domain(xScale)
    .range([0, 6]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  // Axis definition
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(displayDate),
      yAxis = d3.axisLeft().scale(yScale).tickFormat(displayTime);
  // Axis creation on the SVG
  svg3.append("g")
  .attr("transform", "translate("+ 0 + "," + imgHeight +")")
  .attr("class", "x axis")
  .call(xAxis);
  svg3.append("g")
  .attr("transform", "translate("+ 0 + "," + 0 +")")
  .attr("class", "y axis")
  .call(yAxis);

  //-- Drawing the bar chart --//
  svg3.append("g")
    .selectAll("g")
    .data(nested_data)
    .enter()

  nested_data.forEach(function(dates){
    dates["values"].map(function(exercise) {

      var start_time = parseTime( exercise
                                 .start_time.getHours() + ":" + exercise
                                 .start_time.getMinutes()),
          end_time = parseTime( exercise
                               .end_time.getHours() + ":" + exercise
                               .end_time.getMinutes())

      svg3.append("g").selectAll(".bar")
        .data(exercise)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return xScale(parseDateBis(dates.key)); })
        .attr("width", 3)
        .attr("y0", function(d) {
          return yScale(start_time); })
        .attr("y1", function(d) {
          return yScale(end_time); });
      })
    })

})
