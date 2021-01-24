function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text("id: " + result.id);
      PANEL.append("h6").text("ethnicity: " + result.ethnicity);
      PANEL.append("h6").text("gender: " + result.gender);
      PANEL.append("h6").text("age: " + result.age);
      PANEL.append("h6").text("location: " + result.location);
      PANEL.append("h6").text("bbtype: " + result.bbtype);
      PANEL.append("h6").text("wfreq: " + result.wfreq);

    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray= samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray [0];

    var sample_values = result.sample_values.slice(0,10);
    var otu_ids = result.otu_ids.slice(0,10);
    var otu_labels = result.otu_labels.slice (0,10);

    var horizontalBar = [{
      x: sample_values.reverse(),
      y: otu_ids.map(id => 'OTU:' + id). reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        colour: otu_ids,
      }
    }];
    Plotly.newPlot("bar", horizontalBar);

  });

  // Buble Chart
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];

    var x_axis = result.otu_ids;
    var y_axis = result.sample_values;
    var size = result.sample_values;
    var color = result.otu_ids;
    var texts = result.otu_labels;

    var bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: `markers`,
      marker: {
        size: size,
        color: color,
        colorscale: "Earth"
      }
    };
    var data = [bubble];
    var layout = {
      title: "Bacteria Cultures Per Sample ",
      xaxis: {title: "OTU ID"},
      hovermode: "closests",
      autosize: true
    };
    Plotly.newPlot("bubble", data, layout);
  });  

//Guage Chart
d3.json("samples.json").then((data) => {
  var samples = data.metadata;
  var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  var wfreq = resultArray[0].wfreq;
  var level = parseFloat(wfreq) * 20;

  var degrees = 180 - level;
  var radius = 0.5;
  var radians = (degrees * Math.PI) / 180;
  var aX = 0.025 * Math.cos((degrees-90) * Math.PI / 180);
  var aY = 0.025 * Math.sin((degrees-90) * Math.PI / 180);
  var bX = -0.025 * Math.cos((degrees-90) * Math.PI / 180);
  var bY = -0.025 * Math.sin((degrees-90) * Math.PI / 180);
  var cX = radius * Math.cos(radians);
  var cY = radius * Math.sin(radians);

  var mainPath = 'M ' + aX + ' ' + aY + ' L ' + bX + ' ' + bY + ' L ' + cX + ' ' + cY + ' Z';
  var pathX = String(cX);
  var space = " ";
  var pathY = String(cY);
  var pathEnd = " Z";
  var path = mainPath.concat(pathX, space, pathY, pathEnd);

  var data = [{
    type: "scatter",
    x: [0],
    y: [0],
    marker: {size: 14, color: "850000"},
    showlegend: false,
    text: level,
    hoverinfo: "text+name"},
    {
      values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {
        colors: [
          "rgba(0,105,11,.5)",
          "rgba(10,120,22,.5)",
          "rgba(14,127,0,.5)",
          "rgba(110,154,22,.5)",
          "rgba(170,202,42,.5)",
          "rgba(202,209,95,.5)",
          "rgba(210,206,145,.5)",
          "rgba(232,226,202,.5)",
          "rgba(240, 230,215,.5)",
          "rgba(255,255,255,0)"
        ]},
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
  }];
  var layout = {
    shapes: [
      {
      type: "path",
      path: path,
      fillcolor: "850000",
      line: {
        color: "850000"
        }
    }],
    title: "Belly Button Washing Frequency <br> Scrubs per Week",
    height: 500,
    width: 500,
    xaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
    },
    yaxis: {
      zeroline: false,
      showticklabels: false,
      showgrid: false,
      range: [-1,1]
    }
  }; 
Plotly.newPlot('gauge', data, layout);
});
};

function init() {
var selector = d3.select("#selDataset");

d3.json("samples.json").then((data) => {
  console.log(data);
  var sampleNames = data.names;
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
});

});
optionChanged(940);
};

function optionChanged(newSample) {
buildMetadata(newSample);
buildCharts(newSample);
};

init();
