
import path from "path";
import { digraph, attribute } from "ts-graphviz";
import { exportToFile } from "@ts-graphviz/node";
//import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
/*
The fileURLToPath method returns the fully-resolved, platform-specific Node.js file path.

The only parameter the method takes is the file URL string, which should be converted to a path.

The import.meta object contains context-specific metadata for the module - e.g. the module's URL.
*/
// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);
console.log('directory-name 👉️', __dirname);



const dot = 'digraph g { POF -> entities [label = "flow"] }';

// path =require('path')
await exportToFile(dot, {
  format: "png",
  output:  "./example.png",
});