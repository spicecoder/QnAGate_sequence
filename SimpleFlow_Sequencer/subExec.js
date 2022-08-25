
function subExec(process_sq){{
    //we are going to make the pushunit.sh
    //and issue exec filer
    //extract index 
  const filesh = "pushsh"+process_sq.name + process_sq.unitIndex + ".sh" ;
  var shpath = path.join(__dirname, filesh);
  
   fs.exists(shpath, function(exists) {
  
          if(exists) {
  
    console.log(shpath + 'File exists. not Deleting now ...');
  
   // fs.unlinkSync(shpath);
  
  } }) 
  
  var content = process_sq.unitsh + "\n"  + './processnext.sh  >  ' + 'tempend'+process_sq.name +process_sq.unitIndex +'.txt';
  
  fs.writeFileSync(shpath, content, err => {
  if (err) {
    console.error(err);
  }
  
  });
  // now we can execfile shpath
   // file written successfully
   //console.log("file name submitted for exec:" + shpath);
   //console.log("xxxxchmodc:" + shpath);
   fs.chmodSync(shpath,0o777);
   const child = execFile(shpath, (error,stdout,stderror) => {
     if (error) {
       console.log("state errorr:" +error+  stderror)
       //throw error;
     }
  console.log("state after unit:" +  stdout);
  
  }  )
  
  }}