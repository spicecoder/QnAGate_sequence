const { execFile } = require('child_process');

execFile('echo', ['Hello, world!'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
