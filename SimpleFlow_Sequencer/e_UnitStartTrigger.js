//a nodejs library to run long running jobs in sequence,in independent processes for the jobs
//sequencetrigger uses nodejs Events simple json storee to keep track of the progress of long running jobs
//that are supposed to run in sequence

/* code -what they do */
/*
1. get the sequence of units to run from json file
2. each unit is a sh file that is run as an execfile
3. A sequnece is strted by SQ_Start event ;
4. Each unit is adpated to put a finishing sh  command which gerates a  unit_Finish event for the current unit while also 
check if there is any more unit in the sequence and if so ,it starts the next unit. (this is e_unittrigger.js)

*/
const cf = require('./config.json');
const currentseq = require(cf.sequence);
//const register =require(cf.processregister);
const flowEmitter = require ('./process_flowEmitter.js')

fs = require('fs');

        function registerSequence(aflow) {
          //var seqdefpath = path.join(__dirname, "/sequencer.json");
          var storeinfopath = path.join(__dirname, cf.processregister);
          //console.log("read:" +fs.readFileSync(seqdefpath));
          
          var proflow =aflow;
        
//check if it is registered ,not finished- this not allowed
                  fs.writeFileSync(storeinfopath,JSON.stringify(aflow));
          
                  
                  proflow.flow["loopcount"]= 0;
                 // console.log("flow STARTER DATA :" +fs.readFileSync(storeinfopath));
           flowEmitter.emit("SQ_UnitStarter", proflow)   
          }
          
           
           var aflow = currentseq.Sequence;

          registerSequence(aflow);
