
const fs = require('fs');

const cf = require('./config.json');
const locker = require(cf.sequencelocker);


//const flowEmitter = require('./flowEmitter');
const flowEmitter = require ('./process_flowEmitter.js')
   
function statusSequence(aproc) {
  //break it up in status update and locker update
  //followed by Unit_starter event
  var storeinfopath = path.join(__dirname, cf.processlog);
  //console.log("read status:" +fs.readFileSync(storeinfopath));
  var proc = fs.readFileSync(storeinfopath)
  var jproc =JSON.parse(proc);
  //forwardsequence(aproc.user,aproc.name)
  jproc.push(aproc);
  
          fs.writeFileSync(storeinfopath,JSON.stringify(jproc));
  
          //console.log("status updated:" +fs.readFileSync(storeinfopath));
        
        }
  
//
   



function logSequence () { 

   var  st ={};
   st.user =locker.user
   st.name =locker.name
   st.unitName=locker.units[locker.flow.execindex].unitName
   st.unitIndex=locker.flow.execindex
   st.loopcount=locker.flow.loopcount
   //console.log("unit post status pushed:"+ JSON.stringify(st))
   
   statusSequence(st);
    }
  
  
 logSequence();
 console.log("e-SQ2: unit starter from:"+process.pid );
 flowEmitter.emit("SQ_UnitStarter", locker);


 