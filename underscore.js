// Underscore copy code
// Author by jiang

(function () {
    var root = this;
    var previousUnderscore = root._;
    var
        ArrayProto = Array.prototype,
        ObjProto = Object.prototype,
        FuncProto = Function.prototype;
    var
        push = ArrayProto.push,
        slice = ArrayProto.slice,
        toString = ObjProto.toString,
        hasOwnProperty = ObjProto.hasOwnProperty;

    var
        nativeIsArray = Array.isArray,
        nativeKeys = Object.keys,
        nativeBind = FuncProto.bind,
        nativeCreate = Object.create;

    var Ctor = function () {};

    var _ = function (obj) {
        if(obj instanceof _)
            return obj;
        if(!(this instanceof _)) {
            return new _(obj);
        }

        this._wrapped = obj;
    };

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }

    _.VERSION = '1.0.0';

    var optimizeCb = function (func, context, argCount) {
        if (context === void 0) {
            return func;
        }
        switch (argCount == null ? 3 : argCount) {
            case 1: return function (value) {
                return func.call(context, value)
            };
            case 2: return function (value, other) {
                return func.call(context, value, other)
            };

            case 3: return function (value, index, collection) {
                return func.call(context, value, index, collection);
            }
        }

        return function () {
            return func.apply(context, arguments);
        }
    };

    var cb = function (value, context, argCount) {
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value)) return _.matcher(value);
        return _.property(value);
    };

    _.iteratee = function (value, context) {
        return cb(value, context, Infinity)
    };

    var createAssigner = function (keysFunc, undefinedOnly) {
        return function (obj) {
            var length = arguments.length;
            if (length < 2 || obj == null) return obj;
            for (var index = 1; index < length; index ++) {
                var source = arguments[index],
                    keys = keysFunc(source),
                    l = keys.length;
                for (var i = 0; i <l; i++) {
                    var key = keys[i];
                    if (!undefinedOnly || obj[key] === void 0) {
                        obj[key] = source[key];
                    }
                }
            }
            return obj;
        }
    };

    var baseCreate = function (prototype) {
        if (!_.isObject(prototype)) return {};

        if(nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
    };

    var property = function (key) {
        return function (obj) {
            return obj == null ? void 0 : obj[key];
        }
    };

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    
    var getLength = property('length');
    
    var isArrayLike = function (collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
    };

    //collections
    _.each = _.forEach = function (obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);

        var i, length;

        if(isArrayLike(obj)) {
            for (i = 0, length = obj.length; i < length; i++) {
                iteratee(obj[i], i, obj);
            }
        } else {
            var keys = _.keys(obj);
            for (i = 0, length = keys.length; i < length; i++) {
                iteratee(obj[keys[i]], keys[i], obj);
            }
        }

        return obj;
    };

    _.map = _.collect = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);

        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0;index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            results[index] = iteratee(obj[currentKey], currentKey, obj);
        }

        return results;
    };

    function createReduce(dir) {
        function iterator(obj, iteratee, memo, keys, index, length) {
            for (; index >= 0 && index < length; index += dir) {
                var currentKey = keys ? keys[index] : index;
                memo = iteratee(memo, obj[currentKey], currentKey, obj);
            }
            return memo;
        }

        return function (obj, iteratee, memo, context) {
            iteratee = optimizeCb(iteratee, context, 4);
            var keys = !isArrayLike(obj) && _.keys(obj),
                length = (keys || obj).length,
                index = dir > 0 ? 0 : length - 1;
            if (arguments.length < 3) {
                memo = obj[keys ? keys[index] : index];
                index += dir;
            }
            return iterator(obj, iteratee, memo, keys, index, length);
        }
    }

    _.reduce = _.foldl = _.inject = createReduce(1);
    _.reduceRight = _.foldr = createReduce(-1);

    _.keys = function (obj) {
        if(!_.isObject(obj)) return [];

        if(nativeKeys) return nativeKeys(obj);

        var keys = [];
        for (var key in obj) {
            if( _.has(obj, key)) keys.push(key);
        }
        if (hasEnumBug) collectNonEnumProps(obj, keys);

        return keys;
    };

    var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                                'propertyIsEnumerable', 'hasOwnProperty','toLocalString'];

    function collectNonEnumProps(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;

        var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;
        var prop = 'constructor';

        if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
            prop = nonEnumerableProps[nonEnumIdx];
            if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
                keys.push(prop)
            }
        }
    }

    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
          if (!isArrayLike(obj)) obj = _.values(obj);

          if (typeof fromIndex != 'number' || guard) fromIndex = 0;

          return _.indexOf(obj, item, fromIndex) >= 0;
    };

    _.isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    _.has = function (obj, key) {
        return obj != null && hasOwnProperty.call(obj, key)
    };

    _.functions = _.methods = function (obj) {
        var names = [];
        for (var key in obj) {
            if(_.isFunction(obj[key])) names.push(key)
        }
        return names.sort();
    };

    if (typeof /./ != 'function' && typeof Int8Array != 'object') {
        _.isFunction = function (obj) {
            return typeof obj == 'function' || false;
        }
    }

    _.chain = function (obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
    };

    var result = function (instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
    };

    _.mixin = function (obj) {
      _.each(_.functions(obj), function (name) {
          var func = _[name] = obj[name];
          _.prototype[name] = function () {
              var args = [this._wrapped];
              push.apply(args, arguments);

              return result(this, func.apply(_. args));
          }
      })
    };

    _.mixin(_);

    _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            var obj = this._wrapped;
            method.apply(obj, arguments);

            if ((name === 'shift' || name === 'splice') && obj.length === 0)
                delete obj[0];
            return result(this, obj);
        }
    });

    _.each(['concat', 'join', 'slice'], function (name) {
        var method = ArrayProto[name];
        _.prototype[name] = function () {
            return result(this, method.apply(this._wrapped, arguments));
        }
    });

    _.prototype.value = function () {
        return this._wrapped;
    };

    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

    _.prototype.toString = function () {
        return '' + this._wrapped;
    };

    if (typeof define === 'function' && define.amd) {
        define('underscore', [], function () {
            return _;
        })
    }
}.call(this));