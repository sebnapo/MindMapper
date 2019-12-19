var CodeFlower = function (selector, w, h) {
  this.w = w;
  this.h = h;

  d3.select(selector).selectAll("svg").remove();

  this.svg = d3.select(selector).append("svg:svg")
    .attr('width', w)
    .attr('height', h);

  this.svg.append("svg:rect")
    .style("fill", "#fff")
    .attr('width', w)
    .attr('height', h);

  this.force = d3.layout.force()
    .on("tick", this.tick.bind(this))
    .charge(function (d) { return (d._children ? -d.size / 100 : -40) * 10; })
    .linkDistance(function (d) { return (d.target._children ? 80 : 25) * 4.5; })
    .size([h, w]);
};

CodeFlower.prototype.update = async function (json) {
  if (json) this.json = json;

  this.json.fixed = true;
  this.json.x = this.w / 2;
  this.json.y = this.h / 2;

  var nodes = this.flatten(this.json);
  var links = d3.layout.tree().links(nodes);
  var total = nodes.length || 1;

  // remove existing text (will readd it afterwards to be sure it's on top)
  this.svg.selectAll("text").remove();

  // Restart the force layout
  this.force
    .gravity(0)
    .nodes(nodes)
    .links(links)
    .start();

  // Update the links
  this.link = this.svg.selectAll("line.link")
    .data(links, function (d) { return d.target.name; });

  // Enter any new links
  this.link.enter().insert("svg:line", ".node")
    .attr("class", "link")
    .attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });

  // Exit any old links.
  this.link.exit().remove();

  // Update the nodes
  this.node = this.svg.selectAll("circle.node")
    .data(nodes, function (d) { return d.name; })
    .classed("collapsed", function (d) { return d._children ? 1 : 0; });

  this.node.transition()
    .attr("r", function (d) { return (d.children ? 5 : Math.pow(d.size, 2 / 5) || 3) * 6; });

  var lastClick = null;
  // Enter any new nodes
  this.node.enter().append('svg:circle')
    .attr("class", "node")
    .classed('directory', function (d) { return (d._children || d.children) ? 1 : 0; })
    .attr("r", function (d) { return (d.children ? 5 : Math.pow(d.size, 2 / 5) || 3) * 6; })
    .style("fill", function color(d) {
      return "hsl(" + parseInt(360 / total * d.id, 10) + ",90%,70%)";
    })
    .on("click", (d) => {
      if (d.children){
        console.log(d)
        if(window.ctrlKey){
          console.log("test")
        }
        if(lastClick !=  null){
          console.log("bjjjj")
          lastClick = null;
        }
        lastClick = d.name
      }
      $("#myModal .modal-body").empty()
      $("#myModal .modal-title").empty()
      $("#myModal .modal-title").append(d.name)
      $("#myModal .modal-body").append(d.note)
      $("#myModal").modal()
      console.log("aggregation")
    })



  await sleep(2000);
  nodes = this.svg.selectAll("circle.node")[0];
  for (var i = 0; i < nodes.length; i++) {
    n = nodes[i];
    this.svg.append('svg:text')
      .attr('class', 'nodetext')
      .attr('dy', nodes[i].__data__.y)
      .attr('dx', nodes[i].__data__.x)
      .attr('text-anchor', 'middle')
      .style('display', null)
      .text(nodes[i].__data__.name.substr(0,20));

  }


  // Exit any old nodes
  this.node.exit().remove();

  return this;
};
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


CodeFlower.prototype.flatten = function (root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) {
      node.size = node.children.reduce(function (p, v) {
        return p + recurse(v);
      }, 0);
    }
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
};

CodeFlower.prototype.click = function (d) {
  // Toggle children on click.
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  this.update();
};


CodeFlower.prototype.tick = function () {
  var h = this.h;
  var w = this.w;
  this.link.attr("x1", function (d) { return d.source.x; })
    .attr("y1", function (d) { return d.source.y; })
    .attr("x2", function (d) { return d.target.x; })
    .attr("y2", function (d) { return d.target.y; });

  this.node.attr("transform", function (d) {
    return "translate(" + Math.max(5, Math.min(w - 5, d.x)) + "," + Math.max(5, Math.min(h - 5, d.y)) + ")";
  });
};

CodeFlower.prototype.cleanup = function () {
  this.update([]);
  this.force.stop();
};