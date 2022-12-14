import { digraph, toDot } from 'ts-graphviz';

const g = digraph('G');

const subgraphA = g.createSubgraph('A');
const nodeA1 = subgraphA.createNode('A_node1');
const nodeA2 = subgraphA.createNode('A_node2');
subgraphA.createEdge([nodeA1, nodeA2]);

const subgraphB = g.createSubgraph('B');
const nodeB1 = subgraphB.createNode('B_node1');
const nodeB2 = subgraphB.createNode('B_node2');
subgraphA.createEdge([nodeB1, nodeB2]);

const node1 = g.createNode('node1');
const node2 = g.createNode('node2');
g.createEdge([node1, node2]);
const dot = toDot(g);

console.log(dot);

// digraph "G" {
//   "node1";
//   "node2";
//   subgraph "A" {
//     "A_node1";
//     "A_node2";
//     "A_node1" -> "A_node2";
//     "B_node1" -> "B_node2";
//   }
//   subgraph "B" {
//     "B_node1";
//     "B_node2";
//   }
//   "node1" -> "node2";
// }
