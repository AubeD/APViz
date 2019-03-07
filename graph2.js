var margin2 = {top: 20, right: 20, bottom: 20, left: 35},
    width2 = 1200 - margin2.left - margin2.right,
    height2 = 300 - margin2.top - margin2.bottom;

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

  var time2 = d3.scaleTime()
    .range([0, imgWidth2]);

  // Date format https://bl.ocks.org/zanarmstrong/ca0adb7e426c12c06a95
  var parseTime  = d3.timeParse("%Y-%m-%d %H:%M:%S.000");
  
  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var opacity_highlights = 0.3;
  var color_highlights = color(4)



  // Load stocks data
  // Ex: 0: {symbol: "MSFT", date: "Jan 2000", price: "39.81"}
  d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/exercise.csv', function(error, raw2) {

    // Data pre-processing
    raw2.forEach(function(d, i) {
      
      // String to INT
      d.value = +d.distance;     
 
      // Parsing time
      
      d.date = new Date(d.start_time);
    });

    d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/weather-lyon.csv', function(error, meteo_lyon) {
      var meteo=new Array();


      // Dates - lieux
      var dates_lyon = new Array([new Date("Aug 6 2018"), new Date("Aug 7 2018")], 
        [new Date("Aug 26 2018"), new Date("Oct 20 2018")],
        [new Date("Nov 5 2018"), new Date("Dec 21 2018")],
        [new Date("Jan 7 2019"), new Date("Feb 01 2019")]);
      var dates_rennes = new Array([new Date("Aug 1 2018"), new Date("Aug 5 2018")],
        [new Date("Aug 16 2018"), new Date("Aug 25 2018")],
        [new Date("Dec 22 2018"), new Date("Dec 29 2018")]);
      var dates_grenoble = new Array([new Date("Aug 7 2018"), new Date("Aug 15 2018")],
        [new Date("Oct 21 2018"), new Date("Nov 5 2018")],
        [new Date("Dec 30 2018"), new Date("Jan 6 2019")]);
      var date_max_londres = new Date("Jul 31 2018");
      var dates_londres = new Array([date_min, date_max_londres]);
      /*var date_min1_rennes = new Date("Aug 1 2018");
      var date_max1_rennes = new Date("Aug 5 2018")
      var date_min1_lyon = new Date("Aug 6 2018");
      var date_max1_lyon = new Date("Aug 7 2018");
      var date_min1_grenoble = new Date("Aug 7 2018");
      var date_max1_grenoble = new Date("Aug 15 2018");
      var date_min2_rennes = new Date("Aug 16 2018");
      var date_max2_rennes = new Date("Aug 25 2018");
      var date_min2_lyon = new Date("Aug 26 2018");
      var date_max2_lyon = new Date("Oct 20 2018");
      var date_min2_grenoble = new Date("Oct 21 2018");
      var date_max2_grenoble = new Date("Nov 5 2018");
      var date_min3_lyon = new Date("Aug 6 2018");
      var date_max3_lyon = new Date("Dec 21 2018");*/

      // Data pre-processing
      meteo_lyon.forEach(function(d, i) {
        
        // String to INT

        d.temp = +d.Temperature-272.15;     
   
        // Parsing time
        
        d.date = new Date(d.Date);
        if(d.Temperature==0){
          meteo_lyon.splice(meteo_lyon.indexOf(d), 1);

        }
        else{
          for (i=0; i<dates_lyon.length; i++){
            if (d.date>=dates_lyon[i][0] && d.date<=dates_lyon[i][1]){
              meteo.push(d);
            }
            
          }
          for (i=0; i<dates_grenoble.length; i++){
            if (d.date>=dates_grenoble[i][0] && d.date<=dates_grenoble[i][1]){
              meteo.push(d);
            }
          }
          
        }
        
        
      });

      
      
      
      var meteo = d3.nest()
        .key(function(d) {

          if(d.date){
            var day = new Date();
            day.setFullYear(d.date.getFullYear());
            day.setMonth(d.date.getMonth());
            day.setDate(d.date.getDate());
            return day;

          }
         })
        .rollup(function(v) { return d3.mean(v, function(d) { return d.temp; }); })
        .entries(meteo);

      

      meteo = meteo.filter(function(d){
        if (typeof(d.value)!="undefined"){
          return d.value;
        }
      });

      function sortDate(a, b) {
            // Dates will be cast to numbers automagically:
            return new Date(a.key) - new Date(b.key);
        }

      meteo = meteo.sort(sortDate);

      var date_min = d3.min(raw2, function(d) {return d.date;});
      var date_max = d3.max(meteo, function(d){return new Date(d.key);});

      //On charge la météo de londres
      d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/weather-london.csv', function(error, meteo_londres) {
        
        
        var parseTime  = d3.timeParse("%d/%m/%Y %H:%M");
        var date_max_londres = new Date("Jul 31 2018");
        
        meteo_londres = meteo_londres.filter(function(d){
            var date = parseTime(d.Time_UTC);
            if(date){
              if (date <= date_max_londres && date >= date_min){

                return d.Time_UTC;
              }
              
            }
          })


          
          // On groupe les températures par jour (moyenne)
        var meteo_londres = d3.nest()
          .key(function(d) {
            var date = parseTime(d.Time_UTC);
            if (date){
              var day = parseTime("01/01/2001 00:00");
              day.setFullYear(date.getFullYear());
              day.setMonth(date.getMonth());
              day.setDate(date.getDate());
              return day;
            }
            
           })
          .rollup(function(v) { return d3.mean(v, function(d) {return +d.Tair; }); })
          .entries(meteo_londres);

        meteo_londres = meteo_londres.filter(function(d){
          if (d.value!=0){
            return d.value;
          }
        });

        meteo_londres.forEach(function(d, i) {
          var date = new Date(d.key);
          if (date <= date_max_londres && date >= date_min){
            meteo.push(d);
          }
        });

        meteo = meteo.sort(sortDate);



        d3.csv('weather-rennes.csv', function(error, meteo_rennes) {
           // On groupe les températures par jour (moyenne)
          var meteo_rennes = d3.nest()
            .key(function(d) {
              var date = new Date(d.Date);
              if (date){
                var day = parseTime("01/01/2001 00:00");
                day.setFullYear(date.getFullYear());
                day.setMonth(date.getMonth());
                day.setDate(date.getDate());
                return day;
              }
              
             })
            .rollup(function(v) { return d3.mean(v, function(d) {return +d.Temperature-272.15; }); })
            .entries(meteo_rennes);



        meteo_rennes.forEach(function(d, i) {
          var date = new Date(d.key);

          for (i=0; i<dates_rennes.length; i++){
            if (date>=dates_rennes[i][0] && date<=dates_rennes[i][1]){
              d.date = new Date(d.key);
              meteo.push(d);
            }
            
          }
        });


        
        meteo = meteo.sort(sortDate);

        

        meteo.forEach(function(d, i) {
          d.date = new Date(d.key);
        });

        });

      
      
        // Calculated on the flat dataset
        
        time2.domain([date_min,date_max]);
        
        y2.domain([0, d3.max(raw2, function(d) {
          return d.value;
        })]);

        y_temp.domain([0, d3.max(meteo, function(d) {
          return d.value;
        })]);

        function sortByDateAscending(a, b) {
            // Dates will be cast to numbers automagically:
            return a.date - b.date;
        }


        raw2 = raw2.sort(sortByDateAscending);

        var displayDate2 = d3.timeFormat("%b %y");
        var xAxis = d3.axisBottom()
          .scale(time2)
          .tickFormat(displayDate2);
        var yAxis = d3.axisLeft()
          .scale(y2);
        var yAxis_temp = d3.axisRight()
          .scale(y_temp);

        // Line generator
        var line = d3.line()//.curve(d3.curveCardinal)
          .defined(function(d) {return d.date < date_max && d.date > date_min;})
          .x(function(d) { return time2(d.date); }) // Update X mapping
          .y(function(d) { return y2(d.value); }) // Update Y mapping

        var line_temp = d3.line()//.curve(d3.curveCardinal)
          .defined(function(d) {
            date=new Date(d.key); 
            return (date < date_max && date > date_min);
          })
          .x(function(d) { return time2(new Date(d.key)); }) // Update X mapping
          .y(function(d) { return y_temp(d.value); }) // Update Y mapping


        


          svg2.selectAll("#line_temp").data([meteo]).enter()
          .append("path")
          .attr("id", "line_temp")
          .attr("class", "line")
          .attr("d", function(d) {return line_temp(d); })  
          .attr("stroke", color(2))
          .attr("fill", "none");

        // Nuage de point pour température

        svg2.selectAll(".circle").data(meteo).enter()
        .append("circle")
        .attr("class", "circle")
        .attr("r", 2)
        .attr("cx", function(d) { 
          
           
          var day = new Date(d.key);
          console.log(time2(date_max));
          return time2(day); })  
        .attr("cy", function(d) {return y_temp(d.value); })
        .attr("stroke", function(d){
          var day = new Date(d.key);
          if (day<date_min){
            return "none";
          }
          return color(3);
        })
        .attr("fill", color(3));

        svg2.selectAll("#line_dist").data([raw2]).enter()
          .append("path")
          .attr("id", "line_dist")
          .attr("class", "line")
          .attr("d", function(d) { 
            return line(d); })  
          .attr("stroke", color(1))
          .attr("fill", "none");

        svg2.append('g')
          .attr("id", "Axe_x")
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

        
        

        function layout_grenoble(){
          svg2.selectAll("rect").remove();
          for (i=0;i<dates_grenoble.length;i++){
            svg2.append("rect")
          .attr("width", function(){
            if (dates_grenoble[i][1]<date_max){
              return time2(dates_grenoble[i][1])-time2(dates_grenoble[i][0]);
            }
            else{
              return time2(date_max)-time2(dates_grenoble[i][0]);
            }
            })
          .attr("height", imgHeight2)
          .attr("x", time2(dates_grenoble[i][0]))
          .attr("y", 0)
          .attr("fill", color_highlights)
          .style("opacity", opacity_highlights);
          }
          
        }

        function layout_londres(){
          svg2.selectAll("rect").remove();
          for (i=0;i<dates_londres.length;i++){
            svg2.append("rect")
            .attr("width", time2(date_max_londres)-time2(date_min))
            .attr("height", imgHeight2)
            .attr("x", time2(date_min))
            .attr("y", 0)
            .attr("fill", color_highlights)
            .style("opacity", opacity_highlights);
          }
          
        }

        function layout_lyon(){
          svg2.selectAll("rect").remove();
          for (i=0;i<dates_lyon.length;i++){
            svg2.append("rect")
            .attr("width", function(){
            if (dates_lyon[i][1]<date_max){
              return time2(dates_lyon[i][1])-time2(dates_lyon[i][0]);
            }
            else{
              return time2(date_max)-time2(dates_lyon[i][0]);
            }
            })
            .attr("height", imgHeight2)
            .attr("x", time2(dates_lyon[i][0]))
            .attr("y", 0)
            .attr("fill", color_highlights)
            .style("opacity", opacity_highlights);
          }
          
        }

        function layout_rennes(){
          svg2.selectAll("rect").remove();
          for (i=0;i<dates_rennes.length;i++){
            svg2.append("rect")
            .attr("width", time2(dates_rennes[i][1])-time2(dates_rennes[i][0]))
            .attr("height", imgHeight2)
            .attr("x", time2(dates_rennes[i][0]))
            .attr("y", 0)
            .attr("fill", color_highlights)
            .style("opacity", opacity_highlights);
          }
          
        }

        function layout_all(){
          svg2.selectAll("rect").remove();
        }

        d3.select("input[value=\"grenoble\"]").on("click", layout_grenoble);
        d3.select("input[value=\"londres\"]").on("click", layout_londres);
        d3.select("input[value=\"lyon\"]").on("click", layout_lyon);
        d3.select("input[value=\"rennes\"]").on("click", layout_rennes);

        d3.select("input[value=\"toutes\"]").on("click", layout_all);


      


    });

  



  });