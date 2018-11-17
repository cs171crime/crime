/*
 * Linechart - Object constructor function
 * @param _parentElement 	-- the HTML element in which to draw the line chart
 * @param _data	-- the data set
 */

Linechart = function(_parentElement, _data) {
	this.parentElement = _parentElement;
	this.data = _data;
	this.measure = "HeroinCrimes";

	this.initVis();
};


Linechart.prototype.initVis = function() {
	var vis = this;

	// Set up SVG drawing area 
	var colWidth = $("#line-chart").width();

	vis.margin = {top: 40, right: 40, bottom: 40, left: 40};

    vis.width = colWidth - vis.margin.left - vis.margin.right,
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

    // SVG drawing area
    vis.svg = d3.select("#" + vis.parentElement).append("svg")
        .attr("width", vis.width + vis.margin.left + vis.margin.right)
        .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

    // Axes
	// Temporary until we fix date time thing
    // vis.x = d3.scaleTime()
    //     .range([0, vis.width]);
	vis.x = d3.scaleLinear()
		.range([0, vis.width]);
    vis.y = d3.scaleLinear()
        .range([vis.height, 0]);

    vis.xAxis = d3.axisBottom();
    vis.yAxis = d3.axisLeft();

    vis.xAxisGroup = vis.svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + vis.height + ")");
    vis.yAxisGroup = vis.svg.append("g")
        .attr("class", "axis y-axis")

    // Line
    vis.linePath = vis.svg.append("path");

    // call wrangleData
    vis.wrangleData();
};


Linechart.prototype.wrangleData = function() {
	var vis = this;

	// Update domains
	vis.x.domain([
		d3.min(vis.data, function(d) { return d.first_or_second_half_of_year; }),
		d3.max(vis.data, function(d) { return d.first_or_second_half_of_year; })
	]);
    vis.y.domain([
        d3.min(vis.data, function(d) { return d[vis.measure]; }),
        d3.max(vis.data, function(d) { return d[vis.measure]; })
    ]);

    // Update axes
	vis.xAxis.scale(vis.x);
	vis.yAxis.scale(vis.y);

	// Create path generator
    vis.line = d3.line()
        .curve(d3.curveMonotoneX)
        .x(function(d) { return vis.x(d.first_or_second_half_of_year); })
        .y(function(d) { return vis.y(d[vis.measure]); });

	// call updateVis
	vis.updateVis();
};


Linechart.prototype.updateVis = function() {
	var vis = this;

	// Draw axes
	vis.xAxisGroup.call(vis.xAxis);
	vis.yAxisGroup.transition().duration(3000).call(vis.yAxis);

    // Draw path
    vis.linePath.datum(vis.data)
        .attr("class", "line")
		.transition()
		.duration(2000)
        .attr("d", vis.line(vis.data));

    // Circles
    vis.circles = vis.svg.selectAll("circle")
        .data(vis.data);
    vis.circles.exit().remove();
    vis.circles.enter()
        .append("circle")
        .attr("class", "circle")
        .merge(vis.circles)
        .transition()
        .duration(3500)
        .attr("cx", function(d) { return vis.x(d.first_or_second_half_of_year); })
        .attr("cy", function(d) { return vis.y(d[vis.measure]); });

    // Tooltips
};

