
// Create variables to store chart
var linechart;

d3.csv("data/NewUpdatedData/DrugsByHalfYear.csv", function(data) {

    // Data processing
    data.forEach(function(d) {
        d.first_or_second_half_of_year = +d.first_or_second_half_of_year;
        d.HeroinCrimes = +d.HeroinCrimes;
        d.WeedCrimes = +d.WeedCrimes;
        d.NumbNeedleReports = +d.NumbNeedleReports;
    });

    // Sanity check
    console.log(data)

    // Instantiate line chart object
    linechart = new Linechart("line-chart", data);

    // Reach to new user input and update line chart
    d3.select("#var").on("change", updateVisualization);
});

function updateVisualization() {

    // Grab user input and save it to measure attribute
    linechart.measure = d3.select("#var").property("value");

    // update visual
    linechart.wrangleData();

};