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
