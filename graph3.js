//-- Margin setup --//
var margin3 = {top: 20, right: 20, bottom: 20, left: 35},
    width3 = 700 - margin3.left - margin3.right,
    height3 = 400 - margin3.top - margin3.bottom;
var imgHeight3 = height3*0.85, imgWidth3 = width3*0.8

var margin4 = {top: 20, right: 20, bottom: 20, left: 35},
    width4 = 500 - margin4.left - margin4.right,
    height4 = 400 - margin4.top - margin4.bottom;
var imgHeight4 = height4*0.85, imgWidth4 = width4*0.8

//-- Create the SVG --//
var svg3 = d3.select("#graph3").append("svg")
  .attr("width", width3)
  .attr("height", height3)
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

var svg4 = d3.select("#graph4").append("svg")
  .attr("width", width4)
  .attr("height", height4)
  .append("g")
  .attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");


//============================================================================//
// graph3
//============================================================================//

//-- Create the tooltip --//
var div = d3.select("#graph3").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//-- Parsers --//
var displayDate3 = d3.timeFormat("%b %y"),
    displayTime3 = d3.timeFormat("%H:%M"),
    displayValue3 = d3.format(",.0f");

//-------------------------Crunching "exercise.csv"---------------------------//
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
    .domain([ parseTime3("03:00"), parseTime3("23:59") ]);

  //==========================Function for graph4=============================//
  // (called later in "on click")
  function livedata_graph(){
  }
  //==========================End graph4 function=============================//

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
          return yScale(end_time)-yScale(start_time); })
        .style("fill", "blue")
        .on("mouseover", function(d) {

          d3.select(this)
            .transition().duration(200)
      			.style("opacity", 1.0)
            .style("fill", "deepskyblue");

          div.transition()
             .duration(200)
             .style("opacity", .9);
          div.html(displayTime3(start_time) + " - " + displayTime3(end_time) + "<br/>" + Math.round(exercise.distance/1000 * 100)/100 + " km")
             .style("top", (yScale(start_time) - 18).toString() + "px")
             .style("left", (xScale(parseDateBis3(dates.key))+10).toString() + "px")
           })
        .on("mouseout", function(d) {

          d3.select(this)
            .transition().duration(400)
            .style("fill", "blue")
      			.style("opacity", 1.0);

          div.transition()
             .duration(400)
             .style("opacity", 0); })
          .on("click", function(d) {
            //============================json file===========================//
            d3.json("live/" + d.live_data, function(error, json_data){
              if (error) throw error;
              console.log(json_data);
              // Scales definition
              var xScale4 = d3
                .scaleTime()
                .range([0, imgWidth4])
                .domain([d.start_time, d.end_time]),
                yScale4 = d3
                .scaleLinear()
                .range([imgHeight4,0])
                .domain([0,16])
              var xAxis4 = d3.axisBottom().scale(xScale4).tickFormat(displayTime3),
                  yAxis4 = d3.axisLeft().scale(yScale4);
              // Axis creation on the SVG
              svg4.append("g")
                  .attr("transform", "translate("+ 0 + "," + imgHeight4 +")")
                  .attr("class", "x axis")
                  .call(xAxis4);
              svg4.append("g")
                  .attr("transform", "translate("+ 0 + "," + 0 +")")
                  .attr("class", "y axis")
                  .call(yAxis4);
              svg4.append("text")
                  .attr("transform", "rotate(-90)")
                  .attr("y", 0 - margin4.left)
                  .attr("x",0 - (imgHeight4 / 2))
                  .attr("dy", "1em")
                  .style("text-anchor", "middle")
                  .text("Vitesse (km/h)");

              // define the line
              var line = d3
                  .line()
                  .x(function(d) { return xScale4(d.start_time); })
                  .y(function(d) { return yScale4(d.speed * 3.6); });
              // Add the valueline path.
              svg4.selectAll(".line")
                 .data(json_data).enter()
                 .append("path")
                 .attr("class", "line")
                 .attr("d", function(d){ console.log(line); });
                 // .attr("stroke", "blue")
                 // .attr("fill", "none");

            })//end of d3.json...
          })//end of "on click"

      })//end of exercise loop (dates["values"]...)
    })// end of nested_data.forEach


    //-------------------------Crunching "EDT.csv"----------------------------//
    d3.csv("EDT.csv", function(error, data){
      if (error) throw error;

      //--Specific parsers for this dataset--//
      var parseDate32 = d3.timeParse("%m/%d/%Y %H:%M"),
          parseDateBis32 = d3.timeParse("%_d/%_m/%Y")
          parseTime32 = d3.timeParse("%H:%M");
      //-- Managing data --//
      data.forEach(function(d){
        var day = parseDate32(d["start"]).getDate().toString(),
            month = (parseDate32(d["start"]).getMonth()+1).toString(),
            year = parseDate32(d["start"]).getFullYear().toString(),
            hour = parseDate32(d["start"]).getHours().toString(),
            minutes = parseDate32(d["start"]).getMinutes().toString(),
            date = parseDateBis32(day + "/" + month + "/" + year),
            start_time = parseTime32(hour + ":" + minutes);
        var hour = parseDate32(d["end"]).getHours().toString(),
            minutes = parseDate32(d["end"]).getMinutes().toString(),
            end_time = parseTime32(hour + ":" + minutes);
        d["title"] = d["title"];
        d["start"] = start_time;
        d["end"] = end_time;
        d["date"] = date;
      }) //end of data parsing

      //-- Drawing the bar chart --//
      svg3.append("g")
        .selectAll("g")
        .data(data)
        .enter()
      data.forEach(function(cours) {
        svg3.append("g").selectAll(".bar")
          .data([cours])
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) {
            if (d["date"].getTime() <= max_date.getTime()) {
              return xScale(d["date"]);}
            })
          .attr("width", 1.5)
          .attr("y", function(d) {
            if (d["date"].getTime() <= max_date.getTime()) {
              return yScale(d["start"]);}
             })
          .attr("height", function(d) {
            if (d["date"].getTime() <= max_date.getTime()) {
              return yScale(d["end"])-yScale(d["start"]);}
            })
          .style("fill", function(d) {
            if (d["title"].includes("Examen") || d["title"].includes("Restitution")) {
              return "orangered";
            } else {
              return "yellowgreen";
            }})
          .on("mouseover", function(d) {

              d3.select(this)
                .transition().duration(200);
              if (d["title"].includes("Examen") || d["title"].includes("Restitution")) {
                  d3.select(this).style("fill", "firebrick"); }
              else { d3.select(this).style("fill", "olivedrab"); }

              div.transition()
                 .duration(200)
                 .style("opacity", .9);
              if (d["title"].includes("Examen") || d["title"].includes("Restitution")) {
                div.html("Examen<br/>" + displayTime3(d.start) + " - " + displayTime3(d.end))
                   .style("top", (yScale(d["start"]) - 18).toString() + "px")
                   .style("left", (xScale(d["date"])+10).toString() + "px") }
              else {
                div.html("Cours<br/>" + displayTime3(d.start) + " - " + displayTime3(d.end))
                 .style("top", (yScale(d["start"]) - 18).toString() + "px")
                 .style("left", (xScale(d["date"])+10).toString() + "px") }

               })
          .on("mouseout", function(d) {

              d3.select(this)
                .transition().duration(400);
              if (d["title"].includes("Examen") || d["title"].includes("Restitution")) {
                  d3.select(this).style("fill", "orangered"); }
              else { d3.select(this).style("fill", "yellowgreen"); }

              div.transition()
                 .duration(400)
                 .style("opacity", 0); });
      })
    })//end of EDT loop
}) //end of "exercise.csv" crunching
