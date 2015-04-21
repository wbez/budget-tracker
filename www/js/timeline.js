var $graphic = $('#timeline');
var graphic_data_url = '/data.csv';
var graphic_data;
var graphic_aspect_width = 16;
var graphic_aspect_height = 9;
var mobile_threshold = 500;

var BAR_HEIGHT = 50;
var BAR_GAP = 5;
var LABEL_WIDTH = 100;
var money = d3.format('$');



function drawGraphic() {
  var margin = { top: 20, right: 15, bottom: 25, left: 125 };
  var width = $graphic.width() - margin.left - margin.right;
  var height = (BAR_HEIGHT+BAR_GAP)*graphic_data.length;
  
  var num_ticks = 13;
  if (width < mobile_threshold) {
      num_ticks = 5;
  }

  // clear out existing graphics
  $graphic.empty();

  var x = d3.scale.linear()
      .range([0, width])

  var y = d3.scale.ordinal()
      .rangeRoundBands([0, height], .2);

  var xAxis = d3.svg.axis()
      .scale(x)
      .tickFormat(function(d) { return money(d)})
      .orient("top");

  var xAxisGrid = function() {
        return xAxis;
    }

  var svg = d3.select("#timeline").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var absmax = d3.max(graphic_data, function(d) { return Math.abs(+d.value);} );
  x.domain([-absmax,absmax]);
  y.domain(graphic_data.map(function(d) { return d.name; }));

  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
    .append("line")
      .attr("x1", x(0))
      .attr("x2", x(0))
      .attr("y2", height);

  // x-axis gridlines
  svg.append('g')
      .attr('class', 'x grid')
      .call(xAxisGrid()
          .tickSize(-height, 0, 0)
          .tickFormat('')
      );

  svg.selectAll(".bar")
    .data(graphic_data)
  .enter().append("rect")
    .attr("class", function(d) { return d.value < 0 ? "bar negative" : "bar positive"; })
    .attr("x", function(d) { return x(Math.min(0, d.value)); })
    .attr("y", function(d,i) { return i*(BAR_HEIGHT+BAR_GAP); })
    .attr("width", function(d) { return Math.abs(x(d.value) - x(0)); })
    .attr("height", BAR_HEIGHT);

  var labels = d3.select('#timeline').append('ul')
    .attr('class', 'labels')
    .attr('style', 'width: ' + (LABEL_WIDTH) + 'px; top: 0; left: 0;')
    .selectAll('li')
        .data(graphic_data)
    .enter().append('li')
        .attr('style', function(d,i) {
            var s = '';
            s += 'width: ' + LABEL_WIDTH + 'px; ';
            s += 'height: ' + BAR_HEIGHT + 'px; ';
            s += 'left: ' + 0 + 'px; ';
            s += 'top: ' + (i * (BAR_HEIGHT + BAR_GAP)+21) + 'px; ';
            return s;
        })
        .attr('class', function(d) {
            return d.name;
        })
        .append('span')
            .text(function(d) {
                return d.name;
            });
}

if (Modernizr.svg) {
  d3.csv(graphic_data_url, function(error, data) {
    graphic_data = data;
    drawGraphic();
    window.onresize = drawGraphic;
  });
}

function type(d) {
  d.value = +d.value;
  return d;
}