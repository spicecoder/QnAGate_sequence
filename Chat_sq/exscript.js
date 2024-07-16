const { execFile } = require('child_process');

execFile('./scripttest.sh', (error, stdout, stderr) => {
    if (error) {
        console.error(`Exec error: ${error}`);
        return;
    }
    console.log(`Stdout: ${stdout}`);
});
