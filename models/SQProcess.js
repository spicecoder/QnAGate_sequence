const mongoose = require('mongoose');



//SQRegister Schema




const SQProcesssSchema = mongoose.Schema({
    user: String,
    name: String,
    unitName:String,
    unitsh:String
    unitIndex:Number
   // unitStatus:Number //the index to last stage activated,0 after finish ,-1 at start
  })


  SQProcessSchema.post('save', function (doc, next) {
    console.log(`Post -> save -pr...`)
       console.log("the new doc:"+ JSON.stringify(this))
       var bindd ={};
       bindd["record"] = this;
       myEmitter.emit("SQ_Process", bindd);
  
  
        console.log(`Post ->process save - end`)
        next()
    }
  )



module.exports = mongoose.model('SQstatus', SQProcessSchema);