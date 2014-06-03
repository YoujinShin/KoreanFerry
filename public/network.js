var width = 1400,
    height = 600;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-890)
    .linkDistance(125)
    // .charge(-120)
    // .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("miserables.json", function(error, graph) {
  force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

  var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link");
      // .style("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.selectAll(".node")
      .data(graph.nodes)
    .enter().append("g")
      .attr("class", "node")
      .call(force.drag);

  node.append("circle")
      .attr("r", function(d) { return 8/(d.value); })
      //.attr("r", 6)
      // .attr("x", -8)
      // .attr("y", -8)
      .attr("width", 16)
      .attr("height", 16)
      .style("fill", function(d) { return color(d.group); });

  node.append("text")
      .attr("dx", 10)
      .attr("dy", ".35em")
      .style("fill", function(d) { 
          if(d.value == 1) { 
            return "black";
          } else {
            return "grey";
          }
       })
      .text(function(d) { return d.name });

  force.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    // node.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});