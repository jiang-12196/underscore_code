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

var even = _.find([0,2,3,4,5], function (num) {
    return num % 2 === 1;
});

log(even);

var enens = _.filter([0,1,2,3,4,5], function (num) {
    return num % 2 ===1;
});
log(enens);

var reject = _.reject([0,1,2,3,4,5], function (num) {
    return num % 2 ===1;
});
log(reject);

var contain = _.contains([1,2,3,4], 4);
log(contain);

var containObj = _.contains({1: "jiang", 2: "zuo", 3: "han"}, "han");
log(containObj);

// var sort = _.invoke([[5,1,2,3,4],[1,53,4,23,4]], 'sort');
// log(sort);
var sort1 = _.invoke([[5,1,2,3,4],[1,53,4,23,4]], 'concat', 'jiang');
log(sort1);

var where = _.where([{title: "Cymbeline", author: "Shakespeare", year: 1611}, {author: "Shakespeare", year: 1611}], {author: "Shakespeare", year: 1611});
log(where);

var findWhere = _.findWhere([{title: "Cymbeline", author: "Shakespeare", year: 1611}, {author: "Shakespeare", year: 1611}], {author: "Shakespeare", year: 1611});
log(findWhere);

var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
var max = _.max(stooges, function(stooge){ return stooge.age; });
log(max);

// var stooges = [{name: 'moe', age: 40}, {name: 'larry', age: 50}, {name: 'curly', age: 60}];
var min = _.min(stooges, function(stooge){ return stooge.name; });
log(min);

var shuffle = _.shuffle([1, 2, 3, 4, 5, 6]);
log(shuffle);

var sortBy = _.sortBy([1, 2, 3, 4, 5, 6], function(num){ return Math.sin(num); });
log(sortBy);
