
    const QATrigger  =function (eqa,fqa){

        console.log("trigger:" + JSON.stringify(fqa))  ; 
        console.log("compare one:" + JSON.stringify(eqa));
        for (const aq of Object.keys(eqa) ) {  
          if (fqa[aq]=== undefined ){return -1}
          if (fqa[aq]  != eqa[aq]){ return -1;}
  
            
           
        
        }
        console.log("compareequality found:"+ JSON.stringify(Object.keys(eqa)))
        return 1; }