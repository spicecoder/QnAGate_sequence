//sequencelocker
const cf = require('./config.json');
function updateLockedUnit(jlocker){var storeinfopath = path.join(__dirname, cf.sequencelocker);
//console.log("read:" +fs.readFileSync(storeinfopath));
//var locker = fs.readFileSync(storeinfopath)
//var jlocker =JSON.parse(locker);
//set up the rec with execindex -1 
fs.writeFileSync(storeinfopath,JSON.stringify(jlocker));
}
module.exports = {updateLockedUnit}