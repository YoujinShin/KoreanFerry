var test_l = $(window).width()*0.15;
var test_r = $(window).width()*0.15;

var margin = {top: 120, right: test_r, bottom: 30, left: test_l},
	width = $(window).width() - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

// parse dates
var parseDate = d3.time.format("%Y%m%d").parse; 

var x = d3.time.scale()   // x pos encoding
	.range([0, width]);

var y = d3.scale.linear() // y pos encoding
	.range([height, 0]);

// a range of ten categorical colors
var color = d3.scale.category20();

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left");

var line = d3.svg.line()
	.interpolate("basis")
	.x(function(d) { return x(d.date); })
	.y(function(d) { return y(d.temperature); })

var svg = d3.select("body").append("svg")
	.attr("width", width+margin.left+margin.right)
	.attr("height", height+margin.top+margin.bottom)
  .append("g")
    // .attr("transform", "translate(100,40)");
	.attr("transform", "translate("+margin.left+","+margin.top+")");

d3.tsv("data.tsv", function(error, data) {
	// d3.keys : compute column names, data[0]: first row
	color.domain(d3.keys(data[0]).filter(function(key) { return key !== "date"; }));

	data.forEach(function(d) {
		d.date = parseDate(d.date);
	});

    //console.log(color.domain());
	var cities = color.domain().map(function(name) {
		return {
			name: name,
			values: data.map(function(d) {
				//console.log(+d[name]);
				return {date: d.date, temperature: +d[name]};
			})
		};
	});

	x.domain(d3.extent(data, function(d) { return d.date; }));

	y.domain([
		d3.min(cities, function(c) {
			return d3.min(c.values, function(v) { 
				return v.temperature; 
			});
		}), // minimum

		d3.max(cities, function(c) {
			return d3.max(c.values, function(v) {
				return v.temperature;
			});
		}) // maximum
	]);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height +")")
		// .attr("transform", "translate(200," + height +")")
		.call(xAxis);

	svg.append("g")
		 .attr("class", "y axis")
		 .call(yAxis)
		.append("text")
		 .attr("transform", "rotate(-90)")
		 .attr("y", 6)
		 .attr("dy", ".71em")
		 .style("text-anchor", "end")
		 .text("Temperature (ºF)");

	var city = svg.selectAll(".city") // element fr document (class)
		 .data(cities)
		.enter().append("g")
		 .attr("class", "city"); 

	city.append("path")
		.attr("class", "line")
		.attr("d", function(d) { return line(d.values); })
		.style("stroke", function(d) { return color(d.name); });

	city.append("text")
		.datum(function(d) {
			return {name: d.name, value: d.values[d.values.length - 1]};
		})
		.attr("transform", function(d) { 
			return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")";
		})
		.attr("x", 3)
		.attr("dy", ".35em")
		.text(function(d) { return d.name; });

});
