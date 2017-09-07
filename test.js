var _ = require('./underscore');

var log = function (index) {
    console.log(index);
};

_.each([1,2,3], function (index) {
    log(index)
});

_.each({1: 'jiang', 2: 'zuo', 3: 'han'}, function (index) {
    log(index)
});

const mapResult = _.map([1,2,3], function (num) {
    return num * 4;
});
log(mapResult);


var sum = _.reduce([1,2,3], function(memo, num) {
    return memo + num;
    }, 0);
log(sum);

var list = [[1,2], [3,4], [5,6]];
var flat = _.reduceRight(list, function (a,b) {
    return a.concat(b);
}, []);
log(flat);
var ff = _.reduceRight([1,2,3], function (arr,a) {
    console.log("--->", a);
}, []);
log(ff);