var Buffer = require('buffer').Buffer;
var base64 = require('base-64');

var value = "623IQQ=="
var valueAscii = new Buffer(value, "base64").toString('utf8')
var v = new Buffer(value, "base64").toString('hex')

console.log("ascii", valueAscii, "hex", v, parseFloat(v, 16), base64.decode(value));
