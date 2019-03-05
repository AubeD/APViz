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
    
      // Data pre-processing
      meteo_lyon.forEach(function(d, i) {
        
        // String to INT

        d.temp = +d.Temperature-272.15;     
   
        // Parsing time
        
        d.date = new Date(d.Date);
        if(d.temp<-10){
        }
        //console.log(d.date);
        if(d.Temperature==0){
          meteo_lyon.splice(meteo_lyon.indexOf(d), 1);
        }


      });

      

      //console.log(meteo_lyon);
      var meteo_lyon = d3.nest()
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
        .entries(meteo_lyon);

      meteo_lyon = meteo_lyon.filter(function(d){
        if (typeof(d.value)!="undefined"){
          return d.value;
        }
      });

      var meteo = meteo_lyon;


      //On charge la météo de londres
      d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/weather-london.csv', function(error, meteo_londres) {
        var date_min = d3.min(raw2, function(d) {return d.date;});
        var date_max = d3.max(meteo_lyon, function(d){return new Date(d.key);});
        console.log(meteo_lyon);
        var parseTime  = d3.timeParse("%d/%m/%Y %H:%M");
        var date_max_londres = new Date("Jul 31 2018");
        
        meteo_londres = meteo_londres.filter(function(d){
            var date = parseTime(d.Time_UTC);
            if(date){
              if (date < date_max_londres && date > date_min){

                return d.Time_UTC;
              }
              
            }
          })
          
          // On groupe les températures par jour (moyenne)
        var meteo_londres = d3.nest()
          .key(function(d) {
            //console.log(d.Time_UTC);
            var date = parseTime(d.Time_UTC);
            //console.log(date);
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

        console.log(meteo_lyon);
        console.log(meteo_londres);

        //meteo.forEach(function(d, i) {
      
      
      
        // Calculated on the flat dataset
        
        time2.domain([date_min,date_max]);
        
        y2.domain([0, d3.max(raw2, function(d) {
          return d.value;
        })]);

        y_temp.domain([0, d3.max(meteo_lyon, function(d) {
          return d.value;
        })]);

        function sortByDateAscending(a, b) {
            // Dates will be cast to numbers automagically:
            return a.date - b.date;
        }

        //meteo_lyon = meteo_lyon.sort(function(a,b){return a.key-b.key;});

        //console.log(meteo_lyon);


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
          .defined(function(d) {return (d.date < date_max && d.date > date_min);})
          .x(function(d) { return time2(d.date); }) // Update X mapping
          .y(function(d) { return y_temp(d.temp); }) // Update Y mapping


        svg2.selectAll("#line_dist").data([raw2]).enter()
          .append("path")
          .attr("id", "line_dist")
          .attr("class", "line")
          .attr("d", function(d) { 
            //console.log(line(d)); 
            return line(d); })  
          .attr("stroke", color(1))
          .attr("fill", "none");

        // Nuage de point pour température

        svg2.selectAll(".circle").data(meteo_lyon).enter()
        .append("circle")
        .attr("class", "circle")
        .attr("r", 1)
        .attr("cx", function(d) { 
          
           
          var day = new Date(d.key);
          console.log(time2(date_max));
          return time2(day); })  
        .attr("cy", function(d) { 
          //console.log(d.date); 
          return y_temp(d.value); })
        .attr("stroke", function(d){
          var day = new Date(d.key);
          if (day<date_min){
            return "none";
          }
          return color(0);
        })
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

        

        


      
      

      

      



      
      
      
      
      
      

      

        //Line pour température

        /*svg2.selectAll(".line_temp").data([meteo_lyon]).enter()
        .append("path")
        .attr("class", "line_temp")
        .attr("d", function(d) { 
          //console.log(line(d)); 
          return line_temp(d); })  
        .attr("stroke", color(0))
        .attr("fill", "none");*/


        

      /*function layout_londres(){
        // On définit la période spéciale
        var date_max = new Date("Jul 31 2018");
        //console.log(date_max);

        time2.domain([date_min, date_max]);
        var line_dist = d3.line()//.curve(d3.curveCardinal)
        .defined(function(d) {return d.date < date_max && d.date > date_min;})
        .x(function(d) { return time2(d.date); }) // Update X mapping
        .y(function(d) { return y2(d.value); }) // Update Y mapping

        // On retrace la ligne
        svg2.selectAll("#line_dist").data([raw2])
        .attr("d", function(d) { 
          //console.log(line(d)); 
          return line_dist(d); })  
        .attr("stroke", color(1))
        .attr("fill", "none");

        

        var displayDate2 = d3.timeFormat("%d %b %y");

        var xAxis = d3.axisBottom()
        .scale(time2)
        .tickFormat(displayDate2);

        svg2.select("#Axe_x")
        .attr('transform', 'translate(0,' + imgHeight2 + ')')
        .attr('class', 'x axis')
        .call(xAxis);

        //On charge la météo de londres
        d3.csv('https://raw.githubusercontent.com/AubeD/APViz/master/weather-london.csv', function(error, meteo_londres) {
          console.log(meteo_londres);
          //On enlève les headers ou valeurs mal remplies
          var parseTime  = d3.timeParse("%d/%m/%Y %H:%M");

          
        meteo_londres = meteo_londres.filter(function(d){
            var date = parseTime(d.Time_UTC);
            if(date){
              if (date < date_max && date > date_min){

                return d.Time_UTC;
              }
              
            }
          })
          
          // On groupe les températures par jour (moyenne)
        var meteo_londres = d3.nest()
          .key(function(d) {
            //console.log(d.Time_UTC);
            var date = parseTime(d.Time_UTC);
            //console.log(date);
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


        meteo_londres.forEach(function(d){

        });
          console.log(meteo_londres);

          svg2.selectAll(".circle").remove();
          svg2.selectAll(".circle").data(meteo_londres).enter()
          .append("circle")
          .attr("class", "circle")
          .attr("r", 1)
          .attr("cx", function(d) { 
            
             
            var day = new Date(d.key);
            //console.log(time2(date_max));
            return time2(day); })  
          .attr("cy", function(d) { 
            //console.log(d.date); 
            return y_temp(d.value); })
          .attr("stroke", function(d){
            var day = new Date(d.key);
            if (day<date_min){
              return "none";
            }
            return color(0);
          })
          .attr("fill", "none");


        });

        

      }

      function layout_londres(){
        
      }

      
      


      d3.select("input[value=\"toutes\"]").on("click", layout_all);
      //d3.select("input[value=\"grenoble\"]").on("click", random_layout);
      d3.select("input[value=\"londres\"]").on("click", layout_londres);
      //d3.select("input[value=\"lyon\"]").on("click", line_cat_layout);
      //d3.select("input[value=\"rennes\"]").on("click", radial_layout);*/

    });

  



  });