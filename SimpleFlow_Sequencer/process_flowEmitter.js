
var EventEmitter = require('events').EventEmitter;
class FlowEmitter extends EventEmitter {};
const flowEmitter = new FlowEmitter();
const QATrigger = require('./QATrigger.js');
const QAOverride = require('./QAOverride.js');
const updateLockedSequence =require('./updateLockedUnit.js');
const subExec = require('./subExec.js');

fs = require('fs');
path = require('path');
const { execFile } = require('child_process');
var chmod = require('chmod');
const process = require('process');

const cf = require('./config.json');
const { Console } = require('console');


function emit(ev,d){flowEmitter.emit(ev,d)};
//function onevent(e,edata) {flowEmitter.on(e,)}
  //
flowEmitter.on('SQ_UnitStarter', (data) => {
  console.log('a start of Unit event occurred!'+ JSON.stringify(data));
  
  var aseq = data; 
  aseq.flow.loopcount = parseInt(data.loopcount ) + 1 ;
  if (aseq.flow.loopcount > aseq.flow.looplimit) {
    console.log("finishing ,loop limit reached");
    return ;
  
  }
  if(data){
   
    if (aseq.flow.loopcount === 1){    //start of process
      //loop through the units and compare qnA subset match
      console.log("start of loop :" + aseq.flow.loopcount )
      var cindex = -1;

     // QAOverride(data[postamble],data.flow);

       for (var unit of aseq.units)
       {
        cindex = cindex + 1; 
        eqar = {}
        // if (unit.preamble)
          {var eqar =unit.preamble.QnA};
        // console.log("flow qna:" + JSON.stringify(aseq.flow));
       if ( QATrigger(eqar,aseq.flow) === 1) {//
        const process_sq ={};
        console.log("process index in loop now:" + cindex);
        process_sq["user"] = aseq.user;
        process_sq["name"] = aseq.name;
        process_sq["unitName"]=aseq.units[cindex].name;
        process_sq["unitIndex"]= cindex;
        aseq.flow.execindex =cindex;
        process_sq["unitsh"]= unit.sh; 
        aseq.flow["execindex"] = cindex;
        if (aseq.units[cindex].postamble == "") {aseq.flow["nextUnit"]= -1 } //safe
    
         console.log("New proc to exec " +JSON.stringify(process_sq));
         //processSQ(process_sq);
  
  
         updateLockedUnit(aseq);
        //flowEmitter.emit("SQ_Process", process_sq);
        // unit_trigger();
      
      subExec(process_sq)
        
       break ;
       } 
      console.log("increment:"+cindex);
      
      }// for units
      console.log("finished Execution");
     }

     
    else 
    {
      
        // if (aseq.flow.loopcount > 0){
      //loop through the units and compare qnA subset match
     
      console.log("continue with loop :" + aseq.flow.loopcount )
      QAOverride(aseq.units[aseq.flow.execindex].postamble,aseq.flow.QnA);
      QAOverride(aseq.units[aseq.flow.execindex].assert,aseq.units[aseq.flow.execindex].preamble)
      
      var cindex = -1;
       for (var unit of aseq.units)
       {
        cindex = cindex + 1; 
        eqar = {}
        // if (unit.preamble)
          {var eqar =unit.preamble.QnA};
        console.log("flow qna:" + JSON.stringify(aseq.flow));
        unit.preamble
       if ( QATrigger(eqar,aseq.flow) === 1) {//
        const process_sq ={};
        console.log("process index now:" + cindex);
        process_sq["user"] = aseq.user;
        process_sq["name"] = aseq.name;
        process_sq["unitName"]=aseq.units[cindex].name;
        process_sq["unitIndex"]= cindex;
        process_sq["unitsh"]= unit.sh; 
        aseq.flow["execindex"] = cindex;
        if (aseq.units[cindex]["postamble"] == null) {aseq.flow["nextUnit"]= -1 } //safe
        //process_sq["nextUnit"] = -1;
       // process_sq["postamble"]=unit.postamble.QnA;
       // process_sq["flow"] = data.flow;
        //
         console.log("New proc reg:" +JSON.stringify(process_sq));
         //processSQ(process_sq);
  
  
         updateLockedSequence(aseq);
        //flowEmitter.emit("SQ_Process", process_sq);
        // unit_trigger();
      
      subExec(process_sq)
        
       break ;
       } 
      console.log("increment:"+cindex);
      
      }// for units
      console.log("finished Execution");
     }

      }



    }
     
    
    )
 
  
    module.exports = { emit };