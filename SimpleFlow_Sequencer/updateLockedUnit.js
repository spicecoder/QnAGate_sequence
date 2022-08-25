function updateLockedUnit(jlocker){var storeinfopath = path.join(__dirname, "/processUnitlocker.json");
console.log("read:" +fs.readFileSync(storeinfopath));
//var locker = fs.readFileSync(storeinfopath)
//var jlocker =JSON.parse(locker);
//set up the rec with execindex -1 
fs.writeFileSync(storeinfopath,JSON.stringify(jlocker));
}