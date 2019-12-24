var obj = require('./a.js')

obj.b = 333
console.log(obj.c())


var obj1 = require('./a.js')
console.log(obj1.c())