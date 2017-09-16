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

    function isArray(a) {
        Array.isArray ? Array.isArray(a) : Object.prototype.toString.call(a) === '[object Array]';
    }
    
    _.find = _.detect = function (obj, predicate, context) {
        var key;
        if (isArrayLike(obj)) {
            key = _.findIndex(obj, predicate, context);
        } else {
            key = _.findKey(obj, predicate, context);
        }
        if (key !== void 0 && key !== -1) return obj[key];
    };

    _.filter = _.select = function (obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function (value, index, list) {
            if (predicate(value, index, list)) results.push(value);
        });
        return results;
    };
    
    _.reject = function (obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
    };
    
    _.negate = function (predicate) {
        return function () {
            return !predicate.apply(this, arguments);
        }
    };

    _.every = _.all = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
    };

    _.some = _.any = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
            var currentKey = keys ? keys[index] : index;
            if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
    };


    _.contains = _.includes = _.include = function (obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
    };

    _.values = function (obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };

    _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);

    _.sortedIndex = function (array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
            var mid = Math.floor((low + high) / 2);
            if (iteratee(array[mid] < value))
                low = mid + 1;
            else
                high = mid;
        }
        return low;
    };

    function createIndexFinder(dir, predicateFind, sortedIndex) {
        return function (array, item, idx) {
            var i = 0, length = getLength(array);
            if (typeof idx == 'number') {
                if (dir > 0) {
                    i = idx >= 0? idx : Math.max(idx + length, i);
                } else {
                    length = idx >= 0 ? Math.min(idx + 1, length) : idx + length +1;
                }
            } else  if (sortedIndex && idx && length) {
                idx = sortedIndex(array, item);

                return array[indx] === item ? idx : -1;
            }

            if (item !== item) {
                idx = predicateFind(slice.call(array, i, length), _.isNaN);
                return idx >= 0 ? idx + 1 : -1;
            }

            for (idx = dir > 0 ? i :length - 1; idx >= 0 && idx < length; idx += dir) {
                if (array[idx] === item) return idx;
            }
            return -1;
        }
    }

    function createPredicateIndexFinder(dir) {
        return function (array, predicate, context) {
            predicate = cb(predicate, context);
            var length = getLength(array);

            var index = dir > 0 ? 0 : length - 1;
            for (; index >= 0 && index < length; index += dir) {
                if (predicate(array[index], index, array))
                    return index
            }
            return -1;
        }
    }

    _.findIndex = createPredicateIndexFinder(1);

    _.findKey = function (obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
            key = keys[i];
            if (predicate(obj[key], key, obj)) return key;
        }
    };

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

    _.invoke = function (obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        console.log(arguments,"---->invoke-->",args, isFunc);
        //[]['sort'] sort function
        return _.map(obj, function (value) {
            var func = isFunc ? method : value[method];
            return func == null ? func : func.apply(value, args);
        })
    };

    _.prototype =  property;

    //pluck也许是map最常使用的用例模型的简化版本，即萃取对象数组中某属性值，返回一个数组。
    _.pluck = function (obj, key) {
        return _.map(obj, _.prototype(key));
    };

    _.where = function (obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
    };

    // find the first index
    _.findWhere = function (obj, attrs) {
        return _.find(obj, _.matcher(attrs));
    };

    _.max = function (obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value > result) {
                    result = value
                }
            }
        } else {
            iteratee = cb(iteratee, context);

            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            })
        }
        return result;
    };

    _.min = function (obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
            obj = isArrayLike(obj) ? obj : _.values(obj);
            for (var i = 0, length = obj.length; i < length; i++) {
                value = obj[i];
                if (value < result) {
                    result = value
                }
            }
        } else {
            iteratee = cb(iteratee, context);

            _.each(obj, function (value, index, list) {
                computed = iteratee(value, index, list);
                if (computed < lastComputed || computed === Infinity && result === Infinity) {
                    result = value;
                    lastComputed = computed;
                }
            })
        }
        return result;
    };

    _.shuffle = function (obj) {
        var set = isArrayLike(obj) ? obj : _.values(obj);
        var length = set.length;
        var shuffled = Array(length);
        for (var index = 0, rand; index < length; index++) {
            rand  = _.random(0, index);
            // if do not equal, take rand to index (last one)
            if (rand !== index) shuffled[index] = shuffled[rand];
            // rand get new number
            shuffled[rand] = set[index];
        }
        return shuffled;
    };

    _.sample = function (obj, n, guard) {
          if ( n == null || guard) {
              if (!isArrayLike(obj)) obj = _.values(obj);
              return obj[_.random(obj.length - 1)];
          }

          return _.shuffle(obj).slice(0, Math.max(0, n));
    };

    _.sortBy = function (obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        return _.pluck(
            _.map(obj, function (value, index, list) {
                return {
                    value: value,
                    index: index,
                    criteria: iteratee(value, index, list)
                }
            }).sort(function (left, right) {
                var a = left.criteria;
                var b = right.criteria;
                if (a !== b) {
                    if (a > b || a === void 0) return 1;
                    if (a < b || b === void 0) return -1;
                }
                return left.index - right.index;
            }), 'value');
    };
    
    var group = function (behavior) {
        return function (obj, iteratee, context) {
            var result = {};
            iteratee = cb(iteratee, context);
            _.each(obj, function (value, index) {
                var key = iteratee(value, index, obj);
                behavior(result, )
            })
        }  
    };
    
    _.groupBy = group(function () {
        
    });

    _.random = function (min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };

    _.matcher = _.matches = function (attrs) {
        attrs = _.extendOwn({}, attrs);
        return function (obj) {
            return _.isMatch(obj, attrs);
        }
    };

    _.extendOwn = _.assign = createAssigner(_.keys);

    _.isMatch = function (object, attrs) {
        var keys = _.keys(attrs);
        var length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
            var key = keys[i];
            if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
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