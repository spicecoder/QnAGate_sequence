console.log('interviewing the interval');
  const { execFile } = require('child_process');
  const child = execFile('./pushunit.sh', (error,stdout,stderror) => {
    if (error) {
      throw error;
    }
    // ev_binder ={};
    // function announceasync() {console.log("It had finished at: "+Date())};
    // ev_binder.name = announceasync;
    // myEmitter.emit("event_end", ev_binder);
    console.log(stdout);
  });
