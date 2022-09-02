const { writeFileSync } = require('fs');
var util = require('util'),
  graphviz = require('graphviz'),
  fs= require('fs');


// Create digraph G
var g = graphviz.digraph("G");

// Add node (ID: Hello)
var n1 = g.addNode( "Hello", {"color" : "blue"} );
n1.set( "style", "filled" );

// Add node (ID: World)
g.addNode( "World" );

// Add edge between the two nodes
var e = g.addEdge( n1, "World" );
e.set( "color", "red" );

// Print the dot script
fs.writeFileSync("a.dot",g.to_dot());
console.log( g.to_dot() );

// Set GraphViz path (if not in your path)
//g.setGraphVizPath( "/usr/local/bin" );
g.setGraphVizPath("opt/homebrew/bin/")
// Generate a PNG output
 g.output( "png", "process01.png" );