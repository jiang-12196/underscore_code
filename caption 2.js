var log = function () {
    console.log("---->",arguments);
};
var obj = {
    a: 1,
    getA: function () {
        log( this === obj);
        log( this.a );
    }
};

obj.getA();

window = {};

window.name = 'globalName';
var getName = function () {
    return this.name;
};

log(getName.apply(window));

document = {
    getElementById: function () {
        
    }
};

document.getElementById = (function (func) {
    return func.apply(document, arguments);
})(document.getElementById);

var getId = document.getElementById;

var div = getId('div1');

log(div.id);