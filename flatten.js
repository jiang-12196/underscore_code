var _ = require('./underscore');

var diff = _.difference([1, 2, 3, 7, 4, 5], [5, 2, 10]);
console.log(diff);

var union = _.union([1,2,3], [101, 2, 1, 10], [2,4]);
console.log(union);

var unzip = _.unzip([["moe", false, true], ["larry", 40, false], ["curly", 50, false]]);
console.log(unzip);