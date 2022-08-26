
     function QAOverride (eqa,fqa){

        //console.log("trigger:" + JSON.stringify(fqa))  ; 
        //console.log("compare one:" + JSON.stringify(eqa));
        for (const aq of Object.keys(eqa) ) {  
          fqa[aq]= eqa[aq] 
  
            
           
        
        }
       // console.log("overridden:"+ JSON.stringify(fqa))
         }

         module.exports = {QAOverride}    