// var csv = [];	
// d3.csv("data.csv")
// 	.row(function(d){
// 		return d;
// 	})
// 	.get(function(error, rows){
// 		for (var i = 0; i < rows.length ; i++){
// 			csv.push(rows[i]);
// 			console.log(rows[i].Country1);
// 		}
// 	});
// console.log(csv);

			// var csv_rows;

			// d3.csv("data.csv", function(loadedRows) {
			//   csv_rows = loadedRows;
			// });

			// console.log(csv_rows);

(function(){
	var margin = {top: 50, left: 50, right: 50, bottom: 50},
	height = 720 - margin.top - margin.bottom,
	width =  1280 - margin.left - margin.right;

	var svg = d3.select("#container")
		.append("svg")
		//.attr("height", "100vh")//height + margin.top + margin.bottom)
		//.attr("width", "100vw")//width + margin.left + margin.right)
		.append("g");
		//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	d3.queue()
		.defer(d3.json, "world.topojson")
		.await(ready);



	var projection = d3.geoMercator()
		//.translate([width/2 ,  height/2])
		.scale(150);
	var path = d3.geoPath()
		.projection(projection);

	var selectedCountries = [];
	var countryRelations = [];
	var csv = [];	
	var data = [];
	/*function appendToSelected(){
			selectedCountries.push({x:1 , y:1});
			if (selectedCountries.length==2)
			{
				console.log("click!");
				console.log("2 entries (" + selectedCountries[0].x +", " + selectedCountries[0].y + ") ("+ selectedCountries[1].x + "," + selectedCountries[1].y + ")");
				console.log()
				drawLine(selectedCountries);
			}
			else if(selectedCountries.length > 2)
			{
				svg.selectAll("line").remove();
				selectedCountries = [];
				//selectedCountries.push({x:d.lon, y:d.lat});

			}
		}*/

	d3.csv("data.csv") //store csv into csv[]
	.row(function(d) { return {
				 	Country1:d.Country1,
				 	Country2:d.Country2,
				 	Time:d.Time,
				 	SentimentScore:d.SentimentScore,
				 	Link:d.Link,
				 	Images:d.Images,
				 }})
	.get(function(error, rows) {
  		csv.push(rows);
  	});



	// var country1_list = [];
	// d3.csv("data.csv")
	// .row(function(d){
	// 	return d.Country1;
	// })
	// .get(function(error, rows){
	// 	for (var i = 0; i < rows.length ; i++){
	// 		country1_list.push(rows[i]);
	// 	}
	// });


	// var country2_list = [];
	// d3.csv("data.csv")
	// .row(function(d){
	// 	return d.Country2;
	// })
	// .get(function(error, rows){
	// 	for (var i = 0; i < rows.length ; i++){
	// 		country2_list.push(rows[i]);

	// 	}
	// });


	function GreenYellowRed(score) {
	  score *= 100;
	  score--; // working with 0-99 will be easier

	  if (score < 50) {
	    // green to yellow
	    r = Math.floor(255 * (score / 50));
	    g = 255;

	  } else {
	    // yellow to red
	    r = 255;
	    g = Math.floor(255 * ((50-score%50) / 50));
	  }
	  b = 0;

	  return "rgb(" + r + "," + g + "," + b + ")";
	}


	function retrieveRelation(from, to){
		console.log(csv);
		for (var i = 0 ; i < csv[0].length; i++) {
			if(csv[0][i].Country1 == from && csv[0][i].Country2 == to){
				data.push(csv[0][i]);
			}
		}
		console.log(data);
		return data;
		
	}


	// var x = retrieveRelation("AUS", "GBR");
	// console.log(data);

	function drawLine(arr){ //add color to line
		if(arr.length > 2 ){
			//console.log("more than 3");
			var x = arr[2];
			selectedCountries = [];
			data = [];
			selectedCountries.push(x);
			d3.selectAll("line").remove();
			d3.selectAll("p").remove();
			d3.selectAll("input").remove();
			d3.selectAll("circle").remove();
			d3.selectAll("img").remove();
			d3.selectAll("a").remove();

		}
		else if(arr.length == 2){
			retrieveRelation(arr[0].name, arr[1].name);
			console.log(data[0].Images);
			var index;
			//console.log(arr[0].x+" "+arr[1].x);
			var val = Math.random();
			var hexString = val.toString(16);
			var infodiv = d3.select(".information").append("div");
				infodiv.append("input").attr("type", "range").attr("min", 1).attr("max", data.length).attr("id", "slider").attr("class", "slider");
				//infodiv.append("p").text(arr[0].fullname + " relationship status with " + arr[1].fullname);
				infodiv.append("p").text("During " + data[data.length-1].Time + ", " + arr[0].fullname + " relation to " + arr[1].fullname + " has a score of " + data[data.length-1].SentimentScore)
				//infodiv.append("p").text(arr[1].name);
				infodiv.append("p").text(data[data.length-1].SentimentScore).attr("class", "time_score"); // show the sentiment score
				infodiv.append("p").text(data[data.length-1].Time).attr("class", "time_score");
				
				infodiv.append("span").attr("id", "output");
				infodiv.append("img").attr("src", data[data.length-1].Images);
				infodiv.append("a").attr("href", data[data.length-1].Link).text("Link to wiki article").attr("target", "_blank");
			var col = GreenYellowRed(data[data.length-1].SentimentScore);
			
			var slope = -(arr[1].y - arr[0].y)/(arr[1].x - arr[0].x);
			var slopeinverse = 1/slope;
			var xinverse = arr[0].y + (arr[0].y - arr[1].y);//(arr[0].x - arr[1].x);
			var yinverse = arr[0].x + (arr[0].x - arr[1].x);//(arr[0].y - arr[1].y);
			var intersecty = arr[0].y + .95 * (arr[1].y - arr[0].y);
			var intersectx = arr[0].x + .95 * (arr[1].x - arr[0].x);

			d3.select("g").append("line")
				.style("stroke", col)
				.attr("stroke-width", "3")
				.attr("class", "relationLine")
				.attr("x1", arr[0].x)
				.attr("y1", arr[0].y)
				.attr("x2", arr[1].x)
				.attr("y2", arr[1].y);

//arrow head lines here FIX SLOPE!!
			// d3.select("g").append("line")
			// 	.style("stroke", col)
			// 	.attr("stroke-width", "3")
			// 	.attr("class", "relationLine")
			// 	.attr("x1", intersectx + xinverse)
			// 	.attr("y1", intersecty + yinverse)
			// 	.attr("x2", arr[1].x)
			// 	.attr("y2", arr[1].y);

			// d3.select("g").append("line")
			// 	.style("stroke", col)
			// 	.attr("stroke-width", "3")
			// 	.attr("class", "relationLine")
			// 	.attr("x1", intersectx - xinverse)
			// 	.attr("y1", intersecty - yinverse)
			// 	.attr("x2", arr[1].x)
			// 	.attr("y2", arr[1].y);



			d3.select("g").append("circle")
				.attr("cx", intersectx )
				.attr("cy", intersecty)
				.attr("r", 5)
				.style("fill", "black");
			d3.select("g").append("circle") //left side
				.attr("cx", intersectx + .1 * xinverse)
				.attr("cy", intersecty + .1 * yinverse)
				.attr("r", 1)
				.style("fill", "black"); //right side
			d3.select("g").append("circle")
				.attr("cx", intersectx - .1 * xinverse)
				.attr("cy", intersecty - .1 * yinverse)
				.attr("r", 1)
				.style("fill", "black");






			var slider = document.getElementById('slider');
			var output = document.getElementById('output');
			//output.innerHTML = slider.value;
			slider.oninput = function() {
				d3.selectAll(".time_score").remove();
				d3.selectAll("line").remove();
				d3.selectAll("a").remove();
				d3.selectAll("p").remove();
				d3.selectAll("img").remove();

				infodiv.append("p").text("During " + data[this.value - 1].Time + ", " + arr[0].fullname + " relation with " + arr[1].fullname + " has a score of " +data[this.value - 1].SentimentScore)
				//infodiv.append("p").text(arr[1].name);
				infodiv.append("p").text(data[this.value - 1].SentimentScore).attr("class", "time_score"); // show the sentiment score
				infodiv.append("p").text(data[this.value - 1].Time).attr("class", "time_score");
				
				infodiv.append("span").attr("id", "output");
				infodiv.append("img").attr("src", data[this.value-1].Images);
				infodiv.append("a").attr("href", data[this.value - 1].Link).text("Link to wiki article").attr("target", "_blank");

				d3.select("g").append("line")
					.style("stroke", GreenYellowRed(data[this.value - 1].SentimentScore))
					.attr("stroke-width", "3")
					.attr("class", "relationLine")
					.attr("x1", arr[0].x)
					.attr("y1", arr[0].y)
					.attr("x2", arr[1].x)
					.attr("y2", arr[1].y);

				// d3.select("g").append("line")
				// 	.style("stroke", GreenYellowRed(data[this.value - 1].SentimentScore))
				// 	.attr("stroke-width", "3")
				// 	.attr("class", "relationLine")
				// 	.attr("x1", intersectx + .1 * xinverse)
				// 	.attr("y1", intersecty + .1 * yinverse)
				// 	.attr("x2", arr[1].x)
				// 	.attr("y2", arr[1].y);

				// d3.select("g").append("line")
				// 	.style("stroke", GreenYellowRed(data[this.value - 1].SentimentScore))
				// 	.attr("stroke-width", "3")
				// 	.attr("class", "relationLine")
				// 	.attr("x1", intersectx - .1 * xinverse)
				// 	.attr("y1", intersecty - .1 * yinverse)
				// 	.attr("x2", arr[1].x)
				// 	.attr("y2", arr[1].y);

		    	//output.innerHTML = this.value;
		    	// index = this.value -1;
			}
			//console.log(canvas_arrow(d3.select("svg"), arr[0].x, arr[0].y, arr[1].x,arr[1].y));

		}
	}

	//loads map
	function ready(error, data) {

		console.log(data);
		var countries = topojson.feature(data, data.objects.countries1).features;
		console.log(countries);


		var paths = svg.selectAll(".country")
			.data(countries)
			.enter().append("path");

		var titles =  paths
			.attr("class", "country")
			.attr("d", path)
			.on("click", function(d){ //push coordinates onto the selected countries
				var pos = d3.mouse(this);
				console.log(pos[0]+" "+pos[1]);
				selectedCountries.push({name:d.id, x:pos[0], y:pos[1], fullname:d.properties.name});
				drawLine(selectedCountries);
			})
			.on("mouseover", function(d){d3.select(this).classed("hovering", true);})
			.on("mouseout", function(d){d3.select(this).classed("hovering",false);})

		titles.append("title").text(function(d){return d.properties.name;})

	}


})();
