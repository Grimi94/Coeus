var express = require('express');
var server = express();

server.use(express.static(__dirname));


server.listen(5001);

require('child_process').exec('open http://localhost:5001');

var fs = require('fs'),
    path = require('path')

function dirTree(filename) {
    var stats = fs.lstatSync(filename),
        info = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        // Assuming it's a file. In real life it could be a symlink or
        // something else!
        info.type = "file";
    }

    return info;
}

// node dirTree.js ~/foo/bar
var util = require('util');
var directory = util.inspect(dirTree(process.argv[2]), false, null);

server.get('/data.json', function(request,response){
  response.json(directory);
});
