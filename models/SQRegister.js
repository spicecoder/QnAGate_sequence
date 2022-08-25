const mongoose = require('mongoose');







//SQRegister Schema




const SQRegisterSchema = mongoose.Schema({
    user: String,
    name: String,
    units:[{name:String,sh:String}],
    currentunit:String //the index to last stage activated,0 after finish ,-1 at start
  })


  SQRegisterSchema.post('save', function (doc, next) {
    console.log(`Post -> save -WF...`)
       console.log("the new doc:"+ JSON.stringify(this))
       var bindd ={};
       bindd["record"] = this;
       myEmitter.emit("WF_Starter", bindd);
  
  
        console.log(`Post ->WF save - end`)
        next()
    }
  )



module.exports = mongoose.model('SQregisterr', SQRegisterSchema);