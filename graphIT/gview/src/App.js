import React, { useState, useEffect } from 'react';
import { ForceGraph2D } from 'react-force-graph';

const App = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    fetch('http://localhost:8080/api/graph-data')
      .then(response => response.json())
      .then(data => {
        setGraphData({
          nodes: data.nodes.map(node => ({
            id: node.id,
            name: node.name,
            type: node.type
          })),
          links: data.edges.map(edge => ({
            source: edge.source,
            target: edge.target,
            label: edge.label
          }))
        });
      });
  }, []);

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="name"
      nodeColor={node => {
        switch(node.type) {
          case 'design_chunk': return 'red';
          case 'intention': return 'blue';
          case 'object': return 'green';
          default: return 'gray';
        }
      }}
      linkLabel="label"
      linkDirectionalArrowLength={3.5}
      linkDirectionalArrowRelPos={1}
    />
  );
};

export default App;