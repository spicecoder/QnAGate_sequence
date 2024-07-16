const fs = require("fs").promises;
const path = require("path");
const { execFile } = require('child_process');

async function subExec(process_sq) {
  const filesh = `push_execs/pushsh${process_sq.name}${process_sq.unitIndex}.sh`;
  const shpath = path.join(__dirname, filesh);

  try {
    const exists = await fs.access(shpath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    const nstring = `echo "Starting unitrigger!"; node e_UnitEndTrigger.js > unitEndLog/${process_sq.unitIndex}.txt`;
    const content = `${process_sq.unitsh}\n${nstring}`;

    await fs.writeFile(shpath, content);
    await fs.chmod(shpath, 0o755);

    console.log("exec content:", content);

    execFile(shpath,{ shell: true }, (error, stdout, stderr) => {
      if (error) {
        console.error("State error:", error, stderr);
        return;
      }
      console.log("State after unit:", stdout);
    });
  } catch (err) {
    console.error("Error during script execution:", err);
  }
}

module.exports = { subExec };
