//-- Margin setup --//
var margin3 = {top: 20, right: 20, bottom: 20, left: 35},
    width3 = 700 - margin3.left - margin3.right,
    height3 = 400 - margin3.top - margin3.bottom;

var imgHeight3 = height3*0.85, imgWidth3 = width3*0.8

//-- Create the SVG --//
var svg3 = d3.select("#graph3").append("svg")
  .attr("width", width3)
  .attr("height", height3)
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

//-- Parsers --//
var displayDate3 = d3.timeFormat("%b %y"),
    displayTime3 = d3.timeFormat("%H:%M"),
    displayValue3 = d3.format(",.0f");

//--Crunching "exercise.csv"--//
d3.csv("exercise.csv", function(error, data) {
  if (error) throw error;
  //--Specific parsers for this dataset--//
  var parseDate3 = d3.timeParse("%Y-%m-%d %H:%M:%S.%L"),
      parseDateBis3 = d3.timeParse("%e-%_m-%Y"),
      parseTime3 = d3.timeParse("%H:%M"),
      parseTimeOffset3 = d3.timeParse("UTC+%Z");
  //-- Managing data --//
  data.forEach( function(d){
    d["end_time"] = parseDate3(d["end_time"])
    d["start_time"] = parseDate3(d["start_time"])
    d["duration"] = +d["duration"]/1000
    d["exercise_type"] = +d["exercise_type"]
    d["calorie"] = +d["calorie"]
    d["distance"] = +d["distance"]
    d["max_speed"] = +d["max_speed"]
    d["mean_speed"] = +d["mean_speed"]
    d["create_time"] = parseDate3(d["create_time"])
    d["update_time"] = parseDate3(d["update_time"])
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
    .min(nested_data.map( function(d){return parseDateBis3(d.key)})),
      max_date = d3
    .max(nested_data.map( function(d){return parseDateBis3(d.key)}));
  // Scales definition
  var xScale = d3
    .scaleTime()
    .range([0, imgWidth3])
    .domain([min_date, max_date]),
    yScale = d3
    .scaleTime()
    .range([0,imgHeight3])
    .domain([ parseTime3("03:00"), parseTime3("23:59") ]),
    colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  // Axis definition
  var xAxis = d3.axisBottom().scale(xScale).tickFormat(displayDate3),
      yAxis = d3.axisLeft().scale(yScale).tickFormat(displayTime3);
  // Axis creation on the SVG
  svg3.append("g")
  .attr("transform", "translate("+ 0 + "," + imgHeight3 +")")
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
  // creation of each activity bar
  nested_data.forEach(function(dates){
    dates["values"].map(function(exercise) {
      var start_time = parseTime3( exercise
                                 .start_time.getHours() + ":" + exercise
                                 .start_time.getMinutes()),
          end_time = parseTime3( exercise
                               .end_time.getHours() + ":" + exercise
                               .end_time.getMinutes())

      svg3.append("g").selectAll(".bar")
        .data([exercise])
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
          return xScale(parseDateBis3(dates.key))})
        .attr("width", 1.5)
        .attr("y", function(d) {
          return yScale(start_time); })
        .attr("height", function(d) {
          return yScale(end_time)-yScale(start_time); });
      })//end of exercise loop (dates["values"]...)
    })// end of nested_data.forEach
}) //end of "exercise.csv" crunching

//--Crunching "EDT.csv"--//
d3.csv("EDT.csv", function(error, data){
  if (error) throw error;

  //--Specific parsers for this dataset--//
  var parseDate3 = d3.timeParse("%d/%m/%Y %I:%M %p"),
      parseDateBis3 = d3.timeParse("%_d/%_m/%Y")
      parseTime3 = d3.timeParse("%H:%M");
  //-- Managing data --//
  data.forEach(function(d){
    d["course"] = d["title"];
    console.log(d["start"], parseDate3(d["start"]));
    // if (parseDate3(d["start"]).getFullYear() == "2021") {
    //     console.log(d["start"], parseDate3(d["start"]));
    // }
    // if (parseDate3(d["start"]).getFullYear() == "2020") {
    //     console.log(d["start"], parseDate3(d["start"]));
    // }

    var day = parseDate3(d["start"]).getDate().toString(),
        month = parseDate3(d["start"]).getMonth().toString(),
        year = parseDate3(d["start"]).getFullYear().toString(),
        date = parseDateBis3(day + "/" + month + "/" + year);

  }) //end of data parsing
})//end of EDT loop
