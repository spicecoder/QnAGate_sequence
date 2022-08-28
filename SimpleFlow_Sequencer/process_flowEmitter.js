
var EventEmitter = require('events').EventEmitter;
class FlowEmitter extends EventEmitter {};
const flowEmitter = new FlowEmitter();
const QT = require('./QATrigger.js');
const QO = require('./QAOverride.js');
const uL =require('./updateLockedUnit.js');
const sX = require('./subExec.js');

fs = require('fs');
path = require('path');

var chmod = require('chmod');
const process = require('process');

const cf = require('./config.json');
const { Console } = require('console');
const { exit } = require('process');


function emit(ev,d){flowEmitter.emit(ev,d)};
//function onevent(e,edata) {flowEmitter.on(e,)}
  //
flowEmitter.on('SQ_UnitStarter', (data) => {
  console.log('a start of loop event occurred!,loop count'+ JSON.stringify(data.name)+JSON.stringify(data.flow.loopcount)+" past indx:"+JSON.stringify(data.flow.execindex));
  
  var aseq = data; 
  aseq.flow.loopcount = parseInt(data.flow.loopcount ) + 1 ;
  if (aseq.flow.loopcount > parseInt(aseq.flow.looplimit)) {
    console.log("finishing ,loop limit reached");
    exit(0);
    return ;
  
   }
   if (aseq.flow["nextUnit"] == -1) {
    console.log("finishing ,next index -1");
    exit(0);
    return ;
  
   }
  if(data){
   
    if (aseq.flow.loopcount === 1){    //start of process
      //loop through the units and compare qnA subset match
      console.log("First loop :" + aseq.flow.loopcount )
      var cindex = -1;

     // QAOverride(data[postamble],data.flow);

       for (var unit of aseq.units)
       {
        cindex = cindex + 1; 
        eqar = {}
        // if (unit.preamble)
          {var eqar =unit.preamble.QnA};
        // console.log("flow qna:" + JSON.stringify(aseq.flow));
       if ( QT.QATrigger(eqar,aseq.flow.QnA) === 1) {//
        console.log("gate open:" + JSON.stringify(unit.preamble.QnA));
        const process_sq ={};
        console.log("unit index  now:" + cindex);
        process_sq["user"] = aseq.user;
        process_sq["name"] = aseq.name;
        process_sq["unitName"]=aseq.units[cindex].name;
        process_sq["unitIndex"]= cindex;
        aseq.flow.execindex =[]
        aseq.flow.execindex.push(cindex);
        process_sq["unitsh"]= unit.sh; 
        //aseq.flow["execindex"] = cindex;
        if (aseq.units[cindex].postamble.QnA == "") {aseq.flow["nextUnit"]= -1 } //safe
    
         console.log("New proc to exec " +JSON.stringify(process_sq.unitsh));
         //processSQ(process_sq);
  
  
         uL.updateLockedUnit(aseq);
        
      sX.subExec(process_sq)
        
       break ;
       } 
      console.log("increment:"+cindex);
      
      }// for units
      console.log("finishing this loop:"+ aseq.flow.loopcount +":"+JSON.stringify(aseq.flow.execindex));
      //process.exit(0);
     }

     
    else 
    {
      
        // if (aseq.flow.loopcount > 0){
      //loop through the units and compare qnA subset match
     
      console.log(" seq loop count> 1 :" + aseq.flow.loopcount )
      //push postamble to flow
      //var windex = locker.flow.execindex.length -1 ;
      var windex = aseq.flow.execindex[aseq.flow.execindex.length -1];
      console.log("pushed postamble after exec:" + JSON.stringify(aseq.units[windex].postamble.QnA) )
      QO.QAOverride(aseq.units[windex].postamble.QnA,aseq.flow.QnA);
      //push assert to preamble
      QO.QAOverride(aseq.units[windex].assert,aseq.units[windex].preamble.QnA)
      console.log("pushed assert:" + JSON.stringify(aseq.units[windex].assert) )
     
      var cindex = -1;
       for (var unit of aseq.units)
       {
        cindex = cindex + 1; 
        eqar = {}
       
          {var eqar =unit.preamble.QnA};
        console.log("flow qna for:"+cindex + JSON.stringify(aseq.flow.QnA));
        //unit.preamble match test
       if ( QT.QATrigger(eqar,aseq.flow.QnA) === 1) {//
        console.log("gate2 open:" + JSON.stringify(unit.preamble.QnA));
      
        const process_sq ={};
        console.log("process index now:" + cindex);
        process_sq["user"] = aseq.user;
        process_sq["name"] = aseq.name;
        process_sq["unitName"]=aseq.units[cindex].name;
        process_sq["unitIndex"]= cindex;
        process_sq["unitsh"]= unit.sh; 
        //aseq.flow["execindex"] = cindex;
        //aseq.flow.execindex =cindex;
        aseq.flow.execindex.push(cindex);
        console.log("pushed index"+JSON.stringify(aseq.flow.excecindex) )
        if (aseq.units[cindex]["postamble"].QnA == undefined) {aseq.flow["nextUnit"]= -1 } //safe
       
         console.log("about to sub:" +JSON.stringify(process_sq["unitName"]));
       
  
  
         uL.updateLockedUnit(aseq);
     
      sX.subExec(process_sq)
        
       break ;
       } 
     // console.log("increment:"+cindex);
      
      }// for units
      console.log("finishing this loop:"+ aseq.flow.loopcount +":with x index:"+cindex);
    
     }

      }
    }
    )
 
    module.exports = { emit };