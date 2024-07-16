var static = require('node-static');
var http = require('http');
const util = require('util');
var file = new(static.Server)(__dirname,{ cache: 0});
// app.use((req, res, next) => {
//   res.set('Cache-Control', 'no-store')
//   next()
// })
//https://openbase.com/js/node-static
//// Create a node-static server to serve the current directory
//
//const file = new statik.Server('.', { cache: 7200, headers: {'X-Hello':'World!'} });



http.createServer(function (req, res) {
  // console.log(
  //   util.inspect(req.url, {
  //     depth: 5,
  //     colors: true,
  //   }),
  // );
  if ((req.url).indexOf( "sample.html") > 0){ console.log("Hello action");

  var fs = require('fs');

  fs.open('OUT/STOP', 'w', function (err, file) {
    if (err) throw err;
    console.log('STOP created!');
  }); 

};
  file.serve(req, res);
}, caching=0).listen(8080);