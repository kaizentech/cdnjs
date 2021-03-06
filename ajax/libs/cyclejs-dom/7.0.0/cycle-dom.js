(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CycleDOM = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Map : require('./polyfill');

},{"./is-implemented":3,"./polyfill":56}],3:[function(require,module,exports){
'use strict';

module.exports = function () {
	var map, iterator, result;
	if (typeof Map !== 'function') return false;
	try {
		// WebKit doesn't support arguments and crashes
		map = new Map([['raz', 'one'], ['dwa', 'two'], ['trzy', 'three']]);
	} catch (e) {
		return false;
	}
	if (map.size !== 3) return false;
	if (typeof map.clear !== 'function') return false;
	if (typeof map.delete !== 'function') return false;
	if (typeof map.entries !== 'function') return false;
	if (typeof map.forEach !== 'function') return false;
	if (typeof map.get !== 'function') return false;
	if (typeof map.has !== 'function') return false;
	if (typeof map.keys !== 'function') return false;
	if (typeof map.set !== 'function') return false;
	if (typeof map.values !== 'function') return false;

	iterator = map.entries();
	result = iterator.next();
	if (result.done !== false) return false;
	if (!result.value) return false;
	if (result.value[0] !== 'raz') return false;
	if (result.value[1] !== 'one') return false;
	return true;
};

},{}],4:[function(require,module,exports){
// Exports true if environment provides native `Map` implementation,
// whatever that is.

'use strict';

module.exports = (function () {
	if (typeof Map === 'undefined') return false;
	return (Object.prototype.toString.call(Map.prototype) === '[object Map]');
}());

},{}],5:[function(require,module,exports){
'use strict';

module.exports = require('es5-ext/object/primitive-set')('key',
	'value', 'key+value');

},{"es5-ext/object/primitive-set":30}],6:[function(require,module,exports){
'use strict';

var setPrototypeOf    = require('es5-ext/object/set-prototype-of')
  , d                 = require('d')
  , Iterator          = require('es6-iterator')
  , toStringTagSymbol = require('es6-symbol').toStringTag
  , kinds             = require('./iterator-kinds')

  , defineProperties = Object.defineProperties
  , unBind = Iterator.prototype._unBind
  , MapIterator;

MapIterator = module.exports = function (map, kind) {
	if (!(this instanceof MapIterator)) return new MapIterator(map, kind);
	Iterator.call(this, map.__mapKeysData__, map);
	if (!kind || !kinds[kind]) kind = 'key+value';
	defineProperties(this, {
		__kind__: d('', kind),
		__values__: d('w', map.__mapValuesData__)
	});
};
if (setPrototypeOf) setPrototypeOf(MapIterator, Iterator);

MapIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(MapIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__values__[i];
		if (this.__kind__ === 'key') return this.__list__[i];
		return [this.__list__[i], this.__values__[i]];
	}),
	_unBind: d(function () {
		this.__values__ = null;
		unBind.call(this);
	}),
	toString: d(function () { return '[object Map Iterator]'; })
});
Object.defineProperty(MapIterator.prototype, toStringTagSymbol,
	d('c', 'Map Iterator'));

},{"./iterator-kinds":5,"d":8,"es5-ext/object/set-prototype-of":31,"es6-iterator":43,"es6-symbol":52}],7:[function(require,module,exports){
'use strict';

var copy       = require('es5-ext/object/copy')
  , map        = require('es5-ext/object/map')
  , callable   = require('es5-ext/object/valid-callable')
  , validValue = require('es5-ext/object/valid-value')

  , bind = Function.prototype.bind, defineProperty = Object.defineProperty
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , define;

define = function (name, desc, bindTo) {
	var value = validValue(desc) && callable(desc.value), dgs;
	dgs = copy(desc);
	delete dgs.writable;
	delete dgs.value;
	dgs.get = function () {
		if (hasOwnProperty.call(this, name)) return value;
		desc.value = bind.call(value, (bindTo == null) ? this : this[bindTo]);
		defineProperty(this, name, desc);
		return this[name];
	};
	return dgs;
};

module.exports = function (props/*, bindTo*/) {
	var bindTo = arguments[1];
	return map(props, function (desc, name) {
		return define(name, desc, bindTo);
	});
};

},{"es5-ext/object/copy":20,"es5-ext/object/map":28,"es5-ext/object/valid-callable":34,"es5-ext/object/valid-value":35}],8:[function(require,module,exports){
'use strict';

var assign        = require('es5-ext/object/assign')
  , normalizeOpts = require('es5-ext/object/normalize-options')
  , isCallable    = require('es5-ext/object/is-callable')
  , contains      = require('es5-ext/string/#/contains')

  , d;

d = module.exports = function (dscr, value/*, options*/) {
	var c, e, w, options, desc;
	if ((arguments.length < 2) || (typeof dscr !== 'string')) {
		options = value;
		value = dscr;
		dscr = null;
	} else {
		options = arguments[2];
	}
	if (dscr == null) {
		c = w = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
		w = contains.call(dscr, 'w');
	}

	desc = { value: value, configurable: c, enumerable: e, writable: w };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

d.gs = function (dscr, get, set/*, options*/) {
	var c, e, options, desc;
	if (typeof dscr !== 'string') {
		options = set;
		set = get;
		get = dscr;
		dscr = null;
	} else {
		options = arguments[3];
	}
	if (get == null) {
		get = undefined;
	} else if (!isCallable(get)) {
		options = get;
		get = set = undefined;
	} else if (set == null) {
		set = undefined;
	} else if (!isCallable(set)) {
		options = set;
		set = undefined;
	}
	if (dscr == null) {
		c = true;
		e = false;
	} else {
		c = contains.call(dscr, 'c');
		e = contains.call(dscr, 'e');
	}

	desc = { get: get, set: set, configurable: c, enumerable: e };
	return !options ? desc : assign(normalizeOpts(options), desc);
};

},{"es5-ext/object/assign":17,"es5-ext/object/is-callable":23,"es5-ext/object/normalize-options":29,"es5-ext/string/#/contains":36}],9:[function(require,module,exports){
// Inspired by Google Closure:
// http://closure-library.googlecode.com/svn/docs/
// closure_goog_array_array.js.html#goog.array.clear

'use strict';

var value = require('../../object/valid-value');

module.exports = function () {
	value(this).length = 0;
	return this;
};

},{"../../object/valid-value":35}],10:[function(require,module,exports){
'use strict';

var toPosInt = require('../../number/to-pos-integer')
  , value    = require('../../object/valid-value')

  , indexOf = Array.prototype.indexOf
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , abs = Math.abs, floor = Math.floor;

module.exports = function (searchElement/*, fromIndex*/) {
	var i, l, fromIndex, val;
	if (searchElement === searchElement) { //jslint: ignore
		return indexOf.apply(this, arguments);
	}

	l = toPosInt(value(this).length);
	fromIndex = arguments[1];
	if (isNaN(fromIndex)) fromIndex = 0;
	else if (fromIndex >= 0) fromIndex = floor(fromIndex);
	else fromIndex = toPosInt(this.length) - floor(abs(fromIndex));

	for (i = fromIndex; i < l; ++i) {
		if (hasOwnProperty.call(this, i)) {
			val = this[i];
			if (val !== val) return i; //jslint: ignore
		}
	}
	return -1;
};

},{"../../number/to-pos-integer":15,"../../object/valid-value":35}],11:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Math.sign
	: require('./shim');

},{"./is-implemented":12,"./shim":13}],12:[function(require,module,exports){
'use strict';

module.exports = function () {
	var sign = Math.sign;
	if (typeof sign !== 'function') return false;
	return ((sign(10) === 1) && (sign(-20) === -1));
};

},{}],13:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	value = Number(value);
	if (isNaN(value) || (value === 0)) return value;
	return (value > 0) ? 1 : -1;
};

},{}],14:[function(require,module,exports){
'use strict';

var sign = require('../math/sign')

  , abs = Math.abs, floor = Math.floor;

module.exports = function (value) {
	if (isNaN(value)) return 0;
	value = Number(value);
	if ((value === 0) || !isFinite(value)) return value;
	return sign(value) * floor(abs(value));
};

},{"../math/sign":11}],15:[function(require,module,exports){
'use strict';

var toInteger = require('./to-integer')

  , max = Math.max;

module.exports = function (value) { return max(0, toInteger(value)); };

},{"./to-integer":14}],16:[function(require,module,exports){
// Internal method, used by iteration functions.
// Calls a function for each key-value pair found in object
// Optionally takes compareFn to iterate object in specific order

'use strict';

var callable = require('./valid-callable')
  , value    = require('./valid-value')

  , bind = Function.prototype.bind, call = Function.prototype.call, keys = Object.keys
  , propertyIsEnumerable = Object.prototype.propertyIsEnumerable;

module.exports = function (method, defVal) {
	return function (obj, cb/*, thisArg, compareFn*/) {
		var list, thisArg = arguments[2], compareFn = arguments[3];
		obj = Object(value(obj));
		callable(cb);

		list = keys(obj);
		if (compareFn) {
			list.sort((typeof compareFn === 'function') ? bind.call(compareFn, obj) : undefined);
		}
		if (typeof method !== 'function') method = list[method];
		return call.call(method, list, function (key, index) {
			if (!propertyIsEnumerable.call(obj, key)) return defVal;
			return call.call(cb, thisArg, obj[key], key, obj, index);
		});
	};
};

},{"./valid-callable":34,"./valid-value":35}],17:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.assign
	: require('./shim');

},{"./is-implemented":18,"./shim":19}],18:[function(require,module,exports){
'use strict';

module.exports = function () {
	var assign = Object.assign, obj;
	if (typeof assign !== 'function') return false;
	obj = { foo: 'raz' };
	assign(obj, { bar: 'dwa' }, { trzy: 'trzy' });
	return (obj.foo + obj.bar + obj.trzy) === 'razdwatrzy';
};

},{}],19:[function(require,module,exports){
'use strict';

var keys  = require('../keys')
  , value = require('../valid-value')

  , max = Math.max;

module.exports = function (dest, src/*, …srcn*/) {
	var error, i, l = max(arguments.length, 2), assign;
	dest = Object(value(dest));
	assign = function (key) {
		try { dest[key] = src[key]; } catch (e) {
			if (!error) error = e;
		}
	};
	for (i = 1; i < l; ++i) {
		src = arguments[i];
		keys(src).forEach(assign);
	}
	if (error !== undefined) throw error;
	return dest;
};

},{"../keys":25,"../valid-value":35}],20:[function(require,module,exports){
'use strict';

var assign = require('./assign')
  , value  = require('./valid-value');

module.exports = function (obj) {
	var copy = Object(value(obj));
	if (copy !== obj) return copy;
	return assign({}, obj);
};

},{"./assign":17,"./valid-value":35}],21:[function(require,module,exports){
// Workaround for http://code.google.com/p/v8/issues/detail?id=2804

'use strict';

var create = Object.create, shim;

if (!require('./set-prototype-of/is-implemented')()) {
	shim = require('./set-prototype-of/shim');
}

module.exports = (function () {
	var nullObject, props, desc;
	if (!shim) return create;
	if (shim.level !== 1) return create;

	nullObject = {};
	props = {};
	desc = { configurable: false, enumerable: false, writable: true,
		value: undefined };
	Object.getOwnPropertyNames(Object.prototype).forEach(function (name) {
		if (name === '__proto__') {
			props[name] = { configurable: true, enumerable: false, writable: true,
				value: undefined };
			return;
		}
		props[name] = desc;
	});
	Object.defineProperties(nullObject, props);

	Object.defineProperty(shim, 'nullPolyfill', { configurable: false,
		enumerable: false, writable: false, value: nullObject });

	return function (prototype, props) {
		return create((prototype === null) ? nullObject : prototype, props);
	};
}());

},{"./set-prototype-of/is-implemented":32,"./set-prototype-of/shim":33}],22:[function(require,module,exports){
'use strict';

module.exports = require('./_iterate')('forEach');

},{"./_iterate":16}],23:[function(require,module,exports){
// Deprecated

'use strict';

module.exports = function (obj) { return typeof obj === 'function'; };

},{}],24:[function(require,module,exports){
'use strict';

var map = { function: true, object: true };

module.exports = function (x) {
	return ((x != null) && map[typeof x]) || false;
};

},{}],25:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.keys
	: require('./shim');

},{"./is-implemented":26,"./shim":27}],26:[function(require,module,exports){
'use strict';

module.exports = function () {
	try {
		Object.keys('primitive');
		return true;
	} catch (e) { return false; }
};

},{}],27:[function(require,module,exports){
'use strict';

var keys = Object.keys;

module.exports = function (object) {
	return keys(object == null ? object : Object(object));
};

},{}],28:[function(require,module,exports){
'use strict';

var callable = require('./valid-callable')
  , forEach  = require('./for-each')

  , call = Function.prototype.call;

module.exports = function (obj, cb/*, thisArg*/) {
	var o = {}, thisArg = arguments[2];
	callable(cb);
	forEach(obj, function (value, key, obj, index) {
		o[key] = call.call(cb, thisArg, value, key, obj, index);
	});
	return o;
};

},{"./for-each":22,"./valid-callable":34}],29:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

var process = function (src, obj) {
	var key;
	for (key in src) obj[key] = src[key];
};

module.exports = function (options/*, …options*/) {
	var result = create(null);
	forEach.call(arguments, function (options) {
		if (options == null) return;
		process(Object(options), result);
	});
	return result;
};

},{}],30:[function(require,module,exports){
'use strict';

var forEach = Array.prototype.forEach, create = Object.create;

module.exports = function (arg/*, …args*/) {
	var set = create(null);
	forEach.call(arguments, function (name) { set[name] = true; });
	return set;
};

},{}],31:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? Object.setPrototypeOf
	: require('./shim');

},{"./is-implemented":32,"./shim":33}],32:[function(require,module,exports){
'use strict';

var create = Object.create, getPrototypeOf = Object.getPrototypeOf
  , x = {};

module.exports = function (/*customCreate*/) {
	var setPrototypeOf = Object.setPrototypeOf
	  , customCreate = arguments[0] || create;
	if (typeof setPrototypeOf !== 'function') return false;
	return getPrototypeOf(setPrototypeOf(customCreate(null), x)) === x;
};

},{}],33:[function(require,module,exports){
// Big thanks to @WebReflection for sorting this out
// https://gist.github.com/WebReflection/5593554

'use strict';

var isObject      = require('../is-object')
  , value         = require('../valid-value')

  , isPrototypeOf = Object.prototype.isPrototypeOf
  , defineProperty = Object.defineProperty
  , nullDesc = { configurable: true, enumerable: false, writable: true,
		value: undefined }
  , validate;

validate = function (obj, prototype) {
	value(obj);
	if ((prototype === null) || isObject(prototype)) return obj;
	throw new TypeError('Prototype must be null or an object');
};

module.exports = (function (status) {
	var fn, set;
	if (!status) return null;
	if (status.level === 2) {
		if (status.set) {
			set = status.set;
			fn = function (obj, prototype) {
				set.call(validate(obj, prototype), prototype);
				return obj;
			};
		} else {
			fn = function (obj, prototype) {
				validate(obj, prototype).__proto__ = prototype;
				return obj;
			};
		}
	} else {
		fn = function self(obj, prototype) {
			var isNullBase;
			validate(obj, prototype);
			isNullBase = isPrototypeOf.call(self.nullPolyfill, obj);
			if (isNullBase) delete self.nullPolyfill.__proto__;
			if (prototype === null) prototype = self.nullPolyfill;
			obj.__proto__ = prototype;
			if (isNullBase) defineProperty(self.nullPolyfill, '__proto__', nullDesc);
			return obj;
		};
	}
	return Object.defineProperty(fn, 'level', { configurable: false,
		enumerable: false, writable: false, value: status.level });
}((function () {
	var x = Object.create(null), y = {}, set
	  , desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

	if (desc) {
		try {
			set = desc.set; // Opera crashes at this point
			set.call(x, y);
		} catch (ignore) { }
		if (Object.getPrototypeOf(x) === y) return { set: set, level: 2 };
	}

	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 2 };

	x = {};
	x.__proto__ = y;
	if (Object.getPrototypeOf(x) === y) return { level: 1 };

	return false;
}())));

require('../create');

},{"../create":21,"../is-object":24,"../valid-value":35}],34:[function(require,module,exports){
'use strict';

module.exports = function (fn) {
	if (typeof fn !== 'function') throw new TypeError(fn + " is not a function");
	return fn;
};

},{}],35:[function(require,module,exports){
'use strict';

module.exports = function (value) {
	if (value == null) throw new TypeError("Cannot use null or undefined");
	return value;
};

},{}],36:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')()
	? String.prototype.contains
	: require('./shim');

},{"./is-implemented":37,"./shim":38}],37:[function(require,module,exports){
'use strict';

var str = 'razdwatrzy';

module.exports = function () {
	if (typeof str.contains !== 'function') return false;
	return ((str.contains('dwa') === true) && (str.contains('foo') === false));
};

},{}],38:[function(require,module,exports){
'use strict';

var indexOf = String.prototype.indexOf;

module.exports = function (searchString/*, position*/) {
	return indexOf.call(this, searchString, arguments[1]) > -1;
};

},{}],39:[function(require,module,exports){
'use strict';

var toString = Object.prototype.toString

  , id = toString.call('');

module.exports = function (x) {
	return (typeof x === 'string') || (x && (typeof x === 'object') &&
		((x instanceof String) || (toString.call(x) === id))) || false;
};

},{}],40:[function(require,module,exports){
'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , contains       = require('es5-ext/string/#/contains')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , ArrayIterator;

ArrayIterator = module.exports = function (arr, kind) {
	if (!(this instanceof ArrayIterator)) return new ArrayIterator(arr, kind);
	Iterator.call(this, arr);
	if (!kind) kind = 'value';
	else if (contains.call(kind, 'key+value')) kind = 'key+value';
	else if (contains.call(kind, 'key')) kind = 'key';
	else kind = 'value';
	defineProperty(this, '__kind__', d('', kind));
};
if (setPrototypeOf) setPrototypeOf(ArrayIterator, Iterator);

ArrayIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(ArrayIterator),
	_resolve: d(function (i) {
		if (this.__kind__ === 'value') return this.__list__[i];
		if (this.__kind__ === 'key+value') return [i, this.__list__[i]];
		return i;
	}),
	toString: d(function () { return '[object Array Iterator]'; })
});

},{"./":43,"d":8,"es5-ext/object/set-prototype-of":31,"es5-ext/string/#/contains":36}],41:[function(require,module,exports){
'use strict';

var callable = require('es5-ext/object/valid-callable')
  , isString = require('es5-ext/string/is-string')
  , get      = require('./get')

  , isArray = Array.isArray, call = Function.prototype.call;

module.exports = function (iterable, cb/*, thisArg*/) {
	var mode, thisArg = arguments[2], result, doBreak, broken, i, l, char, code;
	if (isArray(iterable)) mode = 'array';
	else if (isString(iterable)) mode = 'string';
	else iterable = get(iterable);

	callable(cb);
	doBreak = function () { broken = true; };
	if (mode === 'array') {
		iterable.some(function (value) {
			call.call(cb, thisArg, value, doBreak);
			if (broken) return true;
		});
		return;
	}
	if (mode === 'string') {
		l = iterable.length;
		for (i = 0; i < l; ++i) {
			char = iterable[i];
			if ((i + 1) < l) {
				code = char.charCodeAt(0);
				if ((code >= 0xD800) && (code <= 0xDBFF)) char += iterable[++i];
			}
			call.call(cb, thisArg, char, doBreak);
			if (broken) break;
		}
		return;
	}
	result = iterable.next();

	while (!result.done) {
		call.call(cb, thisArg, result.value, doBreak);
		if (broken) return;
		result = iterable.next();
	}
};

},{"./get":42,"es5-ext/object/valid-callable":34,"es5-ext/string/is-string":39}],42:[function(require,module,exports){
'use strict';

var isString = require('es5-ext/string/is-string')
  , ArrayIterator  = require('./array')
  , StringIterator = require('./string')
  , iterable       = require('./valid-iterable')
  , iteratorSymbol = require('es6-symbol').iterator;

module.exports = function (obj) {
	if (typeof iterable(obj)[iteratorSymbol] === 'function') return obj[iteratorSymbol]();
	if (isString(obj)) return new StringIterator(obj);
	return new ArrayIterator(obj);
};

},{"./array":40,"./string":50,"./valid-iterable":51,"es5-ext/string/is-string":39,"es6-symbol":45}],43:[function(require,module,exports){
'use strict';

var clear    = require('es5-ext/array/#/clear')
  , assign   = require('es5-ext/object/assign')
  , callable = require('es5-ext/object/valid-callable')
  , value    = require('es5-ext/object/valid-value')
  , d        = require('d')
  , autoBind = require('d/auto-bind')
  , Symbol   = require('es6-symbol')

  , defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , Iterator;

module.exports = Iterator = function (list, context) {
	if (!(this instanceof Iterator)) return new Iterator(list, context);
	defineProperties(this, {
		__list__: d('w', value(list)),
		__context__: d('w', context),
		__nextIndex__: d('w', 0)
	});
	if (!context) return;
	callable(context.on);
	context.on('_add', this._onAdd);
	context.on('_delete', this._onDelete);
	context.on('_clear', this._onClear);
};

defineProperties(Iterator.prototype, assign({
	constructor: d(Iterator),
	_next: d(function () {
		var i;
		if (!this.__list__) return;
		if (this.__redo__) {
			i = this.__redo__.shift();
			if (i !== undefined) return i;
		}
		if (this.__nextIndex__ < this.__list__.length) return this.__nextIndex__++;
		this._unBind();
	}),
	next: d(function () { return this._createResult(this._next()); }),
	_createResult: d(function (i) {
		if (i === undefined) return { done: true, value: undefined };
		return { done: false, value: this._resolve(i) };
	}),
	_resolve: d(function (i) { return this.__list__[i]; }),
	_unBind: d(function () {
		this.__list__ = null;
		delete this.__redo__;
		if (!this.__context__) return;
		this.__context__.off('_add', this._onAdd);
		this.__context__.off('_delete', this._onDelete);
		this.__context__.off('_clear', this._onClear);
		this.__context__ = null;
	}),
	toString: d(function () { return '[object Iterator]'; })
}, autoBind({
	_onAdd: d(function (index) {
		if (index >= this.__nextIndex__) return;
		++this.__nextIndex__;
		if (!this.__redo__) {
			defineProperty(this, '__redo__', d('c', [index]));
			return;
		}
		this.__redo__.forEach(function (redo, i) {
			if (redo >= index) this.__redo__[i] = ++redo;
		}, this);
		this.__redo__.push(index);
	}),
	_onDelete: d(function (index) {
		var i;
		if (index >= this.__nextIndex__) return;
		--this.__nextIndex__;
		if (!this.__redo__) return;
		i = this.__redo__.indexOf(index);
		if (i !== -1) this.__redo__.splice(i, 1);
		this.__redo__.forEach(function (redo, i) {
			if (redo > index) this.__redo__[i] = --redo;
		}, this);
	}),
	_onClear: d(function () {
		if (this.__redo__) clear.call(this.__redo__);
		this.__nextIndex__ = 0;
	})
})));

defineProperty(Iterator.prototype, Symbol.iterator, d(function () {
	return this;
}));
defineProperty(Iterator.prototype, Symbol.toStringTag, d('', 'Iterator'));

},{"d":8,"d/auto-bind":7,"es5-ext/array/#/clear":9,"es5-ext/object/assign":17,"es5-ext/object/valid-callable":34,"es5-ext/object/valid-value":35,"es6-symbol":45}],44:[function(require,module,exports){
'use strict';

var isString       = require('es5-ext/string/is-string')
  , iteratorSymbol = require('es6-symbol').iterator

  , isArray = Array.isArray;

module.exports = function (value) {
	if (value == null) return false;
	if (isArray(value)) return true;
	if (isString(value)) return true;
	return (typeof value[iteratorSymbol] === 'function');
};

},{"es5-ext/string/is-string":39,"es6-symbol":45}],45:[function(require,module,exports){
'use strict';

module.exports = require('./is-implemented')() ? Symbol : require('./polyfill');

},{"./is-implemented":46,"./polyfill":48}],46:[function(require,module,exports){
'use strict';

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }
	if (typeof Symbol.iterator === 'symbol') return true;

	// Return 'true' for polyfills
	if (typeof Symbol.isConcatSpreadable !== 'object') return false;
	if (typeof Symbol.iterator !== 'object') return false;
	if (typeof Symbol.toPrimitive !== 'object') return false;
	if (typeof Symbol.toStringTag !== 'object') return false;
	if (typeof Symbol.unscopables !== 'object') return false;

	return true;
};

},{}],47:[function(require,module,exports){
'use strict';

module.exports = function (x) {
	return (x && ((typeof x === 'symbol') || (x['@@toStringTag'] === 'Symbol'))) || false;
};

},{}],48:[function(require,module,exports){
'use strict';

var d              = require('d')
  , validateSymbol = require('./validate-symbol')

  , create = Object.create, defineProperties = Object.defineProperties
  , defineProperty = Object.defineProperty, objPrototype = Object.prototype
  , Symbol, HiddenSymbol, globalSymbols = create(null);

var generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0, name;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		name = '@@' + desc;
		defineProperty(objPrototype, name, d.gs(null, function (value) {
			defineProperty(this, name, d(value));
		}));
		return name;
	};
}());

HiddenSymbol = function Symbol(description) {
	if (this instanceof HiddenSymbol) throw new TypeError('TypeError: Symbol is not a constructor');
	return Symbol(description);
};
module.exports = Symbol = function Symbol(description) {
	var symbol;
	if (this instanceof Symbol) throw new TypeError('TypeError: Symbol is not a constructor');
	symbol = create(HiddenSymbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};
defineProperties(Symbol, {
	for: d(function (key) {
		if (globalSymbols[key]) return globalSymbols[key];
		return (globalSymbols[key] = Symbol(String(key)));
	}),
	keyFor: d(function (s) {
		var key;
		validateSymbol(s);
		for (key in globalSymbols) if (globalSymbols[key] === s) return key;
	}),
	hasInstance: d('', Symbol('hasInstance')),
	isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
	iterator: d('', Symbol('iterator')),
	match: d('', Symbol('match')),
	replace: d('', Symbol('replace')),
	search: d('', Symbol('search')),
	species: d('', Symbol('species')),
	split: d('', Symbol('split')),
	toPrimitive: d('', Symbol('toPrimitive')),
	toStringTag: d('', Symbol('toStringTag')),
	unscopables: d('', Symbol('unscopables'))
});
defineProperties(HiddenSymbol.prototype, {
	constructor: d(Symbol),
	toString: d('', function () { return this.__name__; })
});

defineProperties(Symbol.prototype, {
	toString: d(function () { return 'Symbol (' + validateSymbol(this).__description__ + ')'; }),
	valueOf: d(function () { return validateSymbol(this); })
});
defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
	function () { return validateSymbol(this); }));
defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));

defineProperty(HiddenSymbol.prototype, Symbol.toPrimitive,
	d('c', Symbol.prototype[Symbol.toPrimitive]));
defineProperty(HiddenSymbol.prototype, Symbol.toStringTag,
	d('c', Symbol.prototype[Symbol.toStringTag]));

},{"./validate-symbol":49,"d":8}],49:[function(require,module,exports){
'use strict';

var isSymbol = require('./is-symbol');

module.exports = function (value) {
	if (!isSymbol(value)) throw new TypeError(value + " is not a symbol");
	return value;
};

},{"./is-symbol":47}],50:[function(require,module,exports){
// Thanks @mathiasbynens
// http://mathiasbynens.be/notes/javascript-unicode#iterating-over-symbols

'use strict';

var setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , d              = require('d')
  , Iterator       = require('./')

  , defineProperty = Object.defineProperty
  , StringIterator;

StringIterator = module.exports = function (str) {
	if (!(this instanceof StringIterator)) return new StringIterator(str);
	str = String(str);
	Iterator.call(this, str);
	defineProperty(this, '__length__', d('', str.length));

};
if (setPrototypeOf) setPrototypeOf(StringIterator, Iterator);

StringIterator.prototype = Object.create(Iterator.prototype, {
	constructor: d(StringIterator),
	_next: d(function () {
		if (!this.__list__) return;
		if (this.__nextIndex__ < this.__length__) return this.__nextIndex__++;
		this._unBind();
	}),
	_resolve: d(function (i) {
		var char = this.__list__[i], code;
		if (this.__nextIndex__ === this.__length__) return char;
		code = char.charCodeAt(0);
		if ((code >= 0xD800) && (code <= 0xDBFF)) return char + this.__list__[this.__nextIndex__++];
		return char;
	}),
	toString: d(function () { return '[object String Iterator]'; })
});

},{"./":43,"d":8,"es5-ext/object/set-prototype-of":31}],51:[function(require,module,exports){
'use strict';

var isIterable = require('./is-iterable');

module.exports = function (value) {
	if (!isIterable(value)) throw new TypeError(value + " is not iterable");
	return value;
};

},{"./is-iterable":44}],52:[function(require,module,exports){
arguments[4][45][0].apply(exports,arguments)
},{"./is-implemented":53,"./polyfill":54,"dup":45}],53:[function(require,module,exports){
'use strict';

module.exports = function () {
	var symbol;
	if (typeof Symbol !== 'function') return false;
	symbol = Symbol('test symbol');
	try { String(symbol); } catch (e) { return false; }
	if (typeof Symbol.iterator === 'symbol') return true;

	// Return 'true' for polyfills
	if (typeof Symbol.isConcatSpreadable !== 'object') return false;
	if (typeof Symbol.isRegExp !== 'object') return false;
	if (typeof Symbol.iterator !== 'object') return false;
	if (typeof Symbol.toPrimitive !== 'object') return false;
	if (typeof Symbol.toStringTag !== 'object') return false;
	if (typeof Symbol.unscopables !== 'object') return false;

	return true;
};

},{}],54:[function(require,module,exports){
'use strict';

var d = require('d')

  , create = Object.create, defineProperties = Object.defineProperties
  , generateName, Symbol;

generateName = (function () {
	var created = create(null);
	return function (desc) {
		var postfix = 0;
		while (created[desc + (postfix || '')]) ++postfix;
		desc += (postfix || '');
		created[desc] = true;
		return '@@' + desc;
	};
}());

module.exports = Symbol = function (description) {
	var symbol;
	if (this instanceof Symbol) {
		throw new TypeError('TypeError: Symbol is not a constructor');
	}
	symbol = create(Symbol.prototype);
	description = (description === undefined ? '' : String(description));
	return defineProperties(symbol, {
		__description__: d('', description),
		__name__: d('', generateName(description))
	});
};

Object.defineProperties(Symbol, {
	create: d('', Symbol('create')),
	hasInstance: d('', Symbol('hasInstance')),
	isConcatSpreadable: d('', Symbol('isConcatSpreadable')),
	isRegExp: d('', Symbol('isRegExp')),
	iterator: d('', Symbol('iterator')),
	toPrimitive: d('', Symbol('toPrimitive')),
	toStringTag: d('', Symbol('toStringTag')),
	unscopables: d('', Symbol('unscopables'))
});

defineProperties(Symbol.prototype, {
	properToString: d(function () {
		return 'Symbol (' + this.__description__ + ')';
	}),
	toString: d('', function () { return this.__name__; })
});
Object.defineProperty(Symbol.prototype, Symbol.toPrimitive, d('',
	function (hint) {
		throw new TypeError("Conversion of symbol objects is not allowed");
	}));
Object.defineProperty(Symbol.prototype, Symbol.toStringTag, d('c', 'Symbol'));

},{"d":8}],55:[function(require,module,exports){
'use strict';

var d        = require('d')
  , callable = require('es5-ext/object/valid-callable')

  , apply = Function.prototype.apply, call = Function.prototype.call
  , create = Object.create, defineProperty = Object.defineProperty
  , defineProperties = Object.defineProperties
  , hasOwnProperty = Object.prototype.hasOwnProperty
  , descriptor = { configurable: true, enumerable: false, writable: true }

  , on, once, off, emit, methods, descriptors, base;

on = function (type, listener) {
	var data;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) {
		data = descriptor.value = create(null);
		defineProperty(this, '__ee__', descriptor);
		descriptor.value = null;
	} else {
		data = this.__ee__;
	}
	if (!data[type]) data[type] = listener;
	else if (typeof data[type] === 'object') data[type].push(listener);
	else data[type] = [data[type], listener];

	return this;
};

once = function (type, listener) {
	var once, self;

	callable(listener);
	self = this;
	on.call(this, type, once = function () {
		off.call(self, type, once);
		apply.call(listener, this, arguments);
	});

	once.__eeOnceListener__ = listener;
	return this;
};

off = function (type, listener) {
	var data, listeners, candidate, i;

	callable(listener);

	if (!hasOwnProperty.call(this, '__ee__')) return this;
	data = this.__ee__;
	if (!data[type]) return this;
	listeners = data[type];

	if (typeof listeners === 'object') {
		for (i = 0; (candidate = listeners[i]); ++i) {
			if ((candidate === listener) ||
					(candidate.__eeOnceListener__ === listener)) {
				if (listeners.length === 2) data[type] = listeners[i ? 0 : 1];
				else listeners.splice(i, 1);
			}
		}
	} else {
		if ((listeners === listener) ||
				(listeners.__eeOnceListener__ === listener)) {
			delete data[type];
		}
	}

	return this;
};

emit = function (type) {
	var i, l, listener, listeners, args;

	if (!hasOwnProperty.call(this, '__ee__')) return;
	listeners = this.__ee__[type];
	if (!listeners) return;

	if (typeof listeners === 'object') {
		l = arguments.length;
		args = new Array(l - 1);
		for (i = 1; i < l; ++i) args[i - 1] = arguments[i];

		listeners = listeners.slice();
		for (i = 0; (listener = listeners[i]); ++i) {
			apply.call(listener, this, args);
		}
	} else {
		switch (arguments.length) {
		case 1:
			call.call(listeners, this);
			break;
		case 2:
			call.call(listeners, this, arguments[1]);
			break;
		case 3:
			call.call(listeners, this, arguments[1], arguments[2]);
			break;
		default:
			l = arguments.length;
			args = new Array(l - 1);
			for (i = 1; i < l; ++i) {
				args[i - 1] = arguments[i];
			}
			apply.call(listeners, this, args);
		}
	}
};

methods = {
	on: on,
	once: once,
	off: off,
	emit: emit
};

descriptors = {
	on: d(on),
	once: d(once),
	off: d(off),
	emit: d(emit)
};

base = defineProperties({}, descriptors);

module.exports = exports = function (o) {
	return (o == null) ? create(base) : defineProperties(Object(o), descriptors);
};
exports.methods = methods;

},{"d":8,"es5-ext/object/valid-callable":34}],56:[function(require,module,exports){
'use strict';

var clear          = require('es5-ext/array/#/clear')
  , eIndexOf       = require('es5-ext/array/#/e-index-of')
  , setPrototypeOf = require('es5-ext/object/set-prototype-of')
  , callable       = require('es5-ext/object/valid-callable')
  , validValue     = require('es5-ext/object/valid-value')
  , d              = require('d')
  , ee             = require('event-emitter')
  , Symbol         = require('es6-symbol')
  , iterator       = require('es6-iterator/valid-iterable')
  , forOf          = require('es6-iterator/for-of')
  , Iterator       = require('./lib/iterator')
  , isNative       = require('./is-native-implemented')

  , call = Function.prototype.call, defineProperties = Object.defineProperties
  , MapPoly;

module.exports = MapPoly = function (/*iterable*/) {
	var iterable = arguments[0], keys, values;
	if (!(this instanceof MapPoly)) return new MapPoly(iterable);
	if (this.__mapKeysData__ !== undefined) {
		throw new TypeError(this + " cannot be reinitialized");
	}
	if (iterable != null) iterator(iterable);
	defineProperties(this, {
		__mapKeysData__: d('c', keys = []),
		__mapValuesData__: d('c', values = [])
	});
	if (!iterable) return;
	forOf(iterable, function (value) {
		var key = validValue(value)[0];
		value = value[1];
		if (eIndexOf.call(keys, key) !== -1) return;
		keys.push(key);
		values.push(value);
	}, this);
};

if (isNative) {
	if (setPrototypeOf) setPrototypeOf(MapPoly, Map);
	MapPoly.prototype = Object.create(Map.prototype, {
		constructor: d(MapPoly)
	});
}

ee(defineProperties(MapPoly.prototype, {
	clear: d(function () {
		if (!this.__mapKeysData__.length) return;
		clear.call(this.__mapKeysData__);
		clear.call(this.__mapValuesData__);
		this.emit('_clear');
	}),
	delete: d(function (key) {
		var index = eIndexOf.call(this.__mapKeysData__, key);
		if (index === -1) return false;
		this.__mapKeysData__.splice(index, 1);
		this.__mapValuesData__.splice(index, 1);
		this.emit('_delete', index, key);
		return true;
	}),
	entries: d(function () { return new Iterator(this, 'key+value'); }),
	forEach: d(function (cb/*, thisArg*/) {
		var thisArg = arguments[1], iterator, result;
		callable(cb);
		iterator = this.entries();
		result = iterator._next();
		while (result !== undefined) {
			call.call(cb, thisArg, this.__mapValuesData__[result],
				this.__mapKeysData__[result], this);
			result = iterator._next();
		}
	}),
	get: d(function (key) {
		var index = eIndexOf.call(this.__mapKeysData__, key);
		if (index === -1) return;
		return this.__mapValuesData__[index];
	}),
	has: d(function (key) {
		return (eIndexOf.call(this.__mapKeysData__, key) !== -1);
	}),
	keys: d(function () { return new Iterator(this, 'key'); }),
	set: d(function (key, value) {
		var index = eIndexOf.call(this.__mapKeysData__, key), emit;
		if (index === -1) {
			index = this.__mapKeysData__.push(key) - 1;
			emit = true;
		}
		this.__mapValuesData__[index] = value;
		if (emit) this.emit('_add', index, key);
		return this;
	}),
	size: d.gs(function () { return this.__mapKeysData__.length; }),
	values: d(function () { return new Iterator(this, 'value'); }),
	toString: d(function () { return '[object Map]'; })
}));
Object.defineProperty(MapPoly.prototype, Symbol.iterator, d(function () {
	return this.entries();
}));
Object.defineProperty(MapPoly.prototype, Symbol.toStringTag, d('c', 'Map'));

},{"./is-native-implemented":4,"./lib/iterator":6,"d":8,"es5-ext/array/#/clear":9,"es5-ext/array/#/e-index-of":10,"es5-ext/object/set-prototype-of":31,"es5-ext/object/valid-callable":34,"es5-ext/object/valid-value":35,"es6-iterator/for-of":41,"es6-iterator/valid-iterable":51,"es6-symbol":52,"event-emitter":55}],57:[function(require,module,exports){
'use strict';

var proto = Element.prototype;
var vendor = proto.matches
  || proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; i++) {
    if (nodes[i] == el) return true;
  }
  return false;
}
},{}],58:[function(require,module,exports){

/**
 * index.js
 *
 * A client-side DOM to vdom parser based on DOMParser API
 */

'use strict';

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var domParser = new DOMParser();

var propertyMap = require('./property-map');
var namespaceMap = require('./namespace-map');

var HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';

module.exports = parser;

/**
 * DOM/html string to vdom parser
 *
 * @param   Mixed   el    DOM element or html string
 * @param   String  attr  Attribute name that contains vdom key
 * @return  Object        VNode or VText
 */
function parser(el, attr) {
	// empty input fallback to empty text node
	if (!el) {
		return createNode(document.createTextNode(''));
	}

	if (typeof el === 'string') {
		var doc = domParser.parseFromString(el, 'text/html');

		// most tags default to body
		if (doc.body.firstChild) {
			el = doc.body.firstChild;

		// some tags, like script and style, default to head
		} else if (doc.head.firstChild && (doc.head.firstChild.tagName !== 'TITLE' || doc.title)) {
			el = doc.head.firstChild;

		// special case for html comment, cdata, doctype
		} else if (doc.firstChild && doc.firstChild.tagName !== 'HTML') {
			el = doc.firstChild;

		// other element, such as whitespace, or html/body/head tag, fallback to empty text node
		} else {
			el = document.createTextNode('');
		}
	}

	if (typeof el !== 'object' || !el || !el.nodeType) { 
		throw new Error('invalid dom node', el);
	}

	return createNode(el, attr);
}

/**
 * Create vdom from dom node
 *
 * @param   Object  el    DOM element
 * @param   String  attr  Attribute name that contains vdom key
 * @return  Object        VNode or VText
 */
function createNode(el, attr) {
	// html comment is not currently supported by virtual-dom
	if (el.nodeType === 3) {
		return createVirtualTextNode(el);

	// cdata or doctype is not currently supported by virtual-dom
	} else if (el.nodeType === 1 || el.nodeType === 9) {
		return createVirtualDomNode(el, attr);
	}

	// default to empty text node
	return new VText('');
}

/**
 * Create vtext from dom node
 *
 * @param   Object  el  Text node
 * @return  Object      VText
 */
function createVirtualTextNode(el) {
	return new VText(el.nodeValue);
}

/**
 * Create vnode from dom node
 *
 * @param   Object  el    DOM element
 * @param   String  attr  Attribute name that contains vdom key
 * @return  Object        VNode
 */
function createVirtualDomNode(el, attr) {
	var ns = el.namespaceURI !== HTML_NAMESPACE ? el.namespaceURI : null;
	var key = attr && el.getAttribute(attr) ? el.getAttribute(attr) : null;

	return new VNode(
		el.tagName
		, createProperties(el)
		, createChildren(el, attr)
		, key
		, ns
	);
}

/**
 * Recursively create vdom
 *
 * @param   Object  el    Parent element
 * @param   String  attr  Attribute name that contains vdom key
 * @return  Array         Child vnode or vtext
 */
function createChildren(el, attr) {
	var children = [];
	for (var i = 0; i < el.childNodes.length; i++) {
		children.push(createNode(el.childNodes[i], attr));
	};

	return children;
}

/**
 * Create properties from dom node
 *
 * @param   Object  el  DOM element
 * @return  Object      Node properties and attributes
 */
function createProperties(el) {
	var properties = {};

	if (!el.hasAttributes()) {
		return properties;
	}

	var ns;
	if (el.namespaceURI && el.namespaceURI !== HTML_NAMESPACE) {
		ns = el.namespaceURI;
	}

	var attr;
	for (var i = 0; i < el.attributes.length; i++) {
		if (ns) {
			attr = createPropertyNS(el.attributes[i]);
		} else {
			attr = createProperty(el.attributes[i]);
		}

		// special case, namespaced attribute, use properties.foobar
		if (attr.ns) {
			properties[attr.name] = {
				namespace: attr.ns
				, value: attr.value
			};

		// special case, use properties.attributes.foobar
		} else if (attr.isAttr) {
			// init attributes object only when necessary
			if (!properties.attributes) {
				properties.attributes = {}
			}
			properties.attributes[attr.name] = attr.value;

		// default case, use properties.foobar
		} else {
			properties[attr.name] = attr.value;
		}
	};

	return properties;
}

/**
 * Create property from dom attribute 
 *
 * @param   Object  attr  DOM attribute
 * @return  Object        Normalized attribute
 */
function createProperty(attr) {
	var name, value, isAttr;

	// using a map to find the correct case of property name
	if (propertyMap[attr.name]) {
		name = propertyMap[attr.name];
	} else {
		name = attr.name;
	}

	// special cases for style attribute, we default to properties.style
	if (name === 'style') {
		var style = {};
		attr.value.split(';').forEach(function (s) {
			var pos = s.indexOf(':');
			if (pos < 0) {
				return;
			}
			style[s.substr(0, pos).trim()] = s.substr(pos + 1).trim();
		});
		value = style;
	// special cases for data attribute, we default to properties.attributes.data
	} else if (name.indexOf('data-') === 0) {
		value = attr.value;
		isAttr = true;
	} else {
		value = attr.value;
	}

	return {
		name: name
		, value: value
		, isAttr: isAttr || false
	};
}

/**
 * Create namespaced property from dom attribute 
 *
 * @param   Object  attr  DOM attribute
 * @return  Object        Normalized attribute
 */
function createPropertyNS(attr) {
	var name, value;

	return {
		name: attr.name
		, value: attr.value
		, ns: namespaceMap[attr.name] || ''
	};
}

},{"./namespace-map":59,"./property-map":60,"virtual-dom/vnode/vnode":101,"virtual-dom/vnode/vtext":103}],59:[function(require,module,exports){

/**
 * namespace-map.js
 *
 * Necessary to map svg attributes back to their namespace
 */

'use strict';

// extracted from https://github.com/Matt-Esch/virtual-dom/blob/master/virtual-hyperscript/svg-attribute-namespace.js
var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

var namespaces = {
	'about': DEFAULT_NAMESPACE
	, 'accent-height': DEFAULT_NAMESPACE
	, 'accumulate': DEFAULT_NAMESPACE
	, 'additive': DEFAULT_NAMESPACE
	, 'alignment-baseline': DEFAULT_NAMESPACE
	, 'alphabetic': DEFAULT_NAMESPACE
	, 'amplitude': DEFAULT_NAMESPACE
	, 'arabic-form': DEFAULT_NAMESPACE
	, 'ascent': DEFAULT_NAMESPACE
	, 'attributeName': DEFAULT_NAMESPACE
	, 'attributeType': DEFAULT_NAMESPACE
	, 'azimuth': DEFAULT_NAMESPACE
	, 'bandwidth': DEFAULT_NAMESPACE
	, 'baseFrequency': DEFAULT_NAMESPACE
	, 'baseProfile': DEFAULT_NAMESPACE
	, 'baseline-shift': DEFAULT_NAMESPACE
	, 'bbox': DEFAULT_NAMESPACE
	, 'begin': DEFAULT_NAMESPACE
	, 'bias': DEFAULT_NAMESPACE
	, 'by': DEFAULT_NAMESPACE
	, 'calcMode': DEFAULT_NAMESPACE
	, 'cap-height': DEFAULT_NAMESPACE
	, 'class': DEFAULT_NAMESPACE
	, 'clip': DEFAULT_NAMESPACE
	, 'clip-path': DEFAULT_NAMESPACE
	, 'clip-rule': DEFAULT_NAMESPACE
	, 'clipPathUnits': DEFAULT_NAMESPACE
	, 'color': DEFAULT_NAMESPACE
	, 'color-interpolation': DEFAULT_NAMESPACE
	, 'color-interpolation-filters': DEFAULT_NAMESPACE
	, 'color-profile': DEFAULT_NAMESPACE
	, 'color-rendering': DEFAULT_NAMESPACE
	, 'content': DEFAULT_NAMESPACE
	, 'contentScriptType': DEFAULT_NAMESPACE
	, 'contentStyleType': DEFAULT_NAMESPACE
	, 'cursor': DEFAULT_NAMESPACE
	, 'cx': DEFAULT_NAMESPACE
	, 'cy': DEFAULT_NAMESPACE
	, 'd': DEFAULT_NAMESPACE
	, 'datatype': DEFAULT_NAMESPACE
	, 'defaultAction': DEFAULT_NAMESPACE
	, 'descent': DEFAULT_NAMESPACE
	, 'diffuseConstant': DEFAULT_NAMESPACE
	, 'direction': DEFAULT_NAMESPACE
	, 'display': DEFAULT_NAMESPACE
	, 'divisor': DEFAULT_NAMESPACE
	, 'dominant-baseline': DEFAULT_NAMESPACE
	, 'dur': DEFAULT_NAMESPACE
	, 'dx': DEFAULT_NAMESPACE
	, 'dy': DEFAULT_NAMESPACE
	, 'edgeMode': DEFAULT_NAMESPACE
	, 'editable': DEFAULT_NAMESPACE
	, 'elevation': DEFAULT_NAMESPACE
	, 'enable-background': DEFAULT_NAMESPACE
	, 'end': DEFAULT_NAMESPACE
	, 'ev:event': EV_NAMESPACE
	, 'event': DEFAULT_NAMESPACE
	, 'exponent': DEFAULT_NAMESPACE
	, 'externalResourcesRequired': DEFAULT_NAMESPACE
	, 'fill': DEFAULT_NAMESPACE
	, 'fill-opacity': DEFAULT_NAMESPACE
	, 'fill-rule': DEFAULT_NAMESPACE
	, 'filter': DEFAULT_NAMESPACE
	, 'filterRes': DEFAULT_NAMESPACE
	, 'filterUnits': DEFAULT_NAMESPACE
	, 'flood-color': DEFAULT_NAMESPACE
	, 'flood-opacity': DEFAULT_NAMESPACE
	, 'focusHighlight': DEFAULT_NAMESPACE
	, 'focusable': DEFAULT_NAMESPACE
	, 'font-family': DEFAULT_NAMESPACE
	, 'font-size': DEFAULT_NAMESPACE
	, 'font-size-adjust': DEFAULT_NAMESPACE
	, 'font-stretch': DEFAULT_NAMESPACE
	, 'font-style': DEFAULT_NAMESPACE
	, 'font-variant': DEFAULT_NAMESPACE
	, 'font-weight': DEFAULT_NAMESPACE
	, 'format': DEFAULT_NAMESPACE
	, 'from': DEFAULT_NAMESPACE
	, 'fx': DEFAULT_NAMESPACE
	, 'fy': DEFAULT_NAMESPACE
	, 'g1': DEFAULT_NAMESPACE
	, 'g2': DEFAULT_NAMESPACE
	, 'glyph-name': DEFAULT_NAMESPACE
	, 'glyph-orientation-horizontal': DEFAULT_NAMESPACE
	, 'glyph-orientation-vertical': DEFAULT_NAMESPACE
	, 'glyphRef': DEFAULT_NAMESPACE
	, 'gradientTransform': DEFAULT_NAMESPACE
	, 'gradientUnits': DEFAULT_NAMESPACE
	, 'handler': DEFAULT_NAMESPACE
	, 'hanging': DEFAULT_NAMESPACE
	, 'height': DEFAULT_NAMESPACE
	, 'horiz-adv-x': DEFAULT_NAMESPACE
	, 'horiz-origin-x': DEFAULT_NAMESPACE
	, 'horiz-origin-y': DEFAULT_NAMESPACE
	, 'id': DEFAULT_NAMESPACE
	, 'ideographic': DEFAULT_NAMESPACE
	, 'image-rendering': DEFAULT_NAMESPACE
	, 'in': DEFAULT_NAMESPACE
	, 'in2': DEFAULT_NAMESPACE
	, 'initialVisibility': DEFAULT_NAMESPACE
	, 'intercept': DEFAULT_NAMESPACE
	, 'k': DEFAULT_NAMESPACE
	, 'k1': DEFAULT_NAMESPACE
	, 'k2': DEFAULT_NAMESPACE
	, 'k3': DEFAULT_NAMESPACE
	, 'k4': DEFAULT_NAMESPACE
	, 'kernelMatrix': DEFAULT_NAMESPACE
	, 'kernelUnitLength': DEFAULT_NAMESPACE
	, 'kerning': DEFAULT_NAMESPACE
	, 'keyPoints': DEFAULT_NAMESPACE
	, 'keySplines': DEFAULT_NAMESPACE
	, 'keyTimes': DEFAULT_NAMESPACE
	, 'lang': DEFAULT_NAMESPACE
	, 'lengthAdjust': DEFAULT_NAMESPACE
	, 'letter-spacing': DEFAULT_NAMESPACE
	, 'lighting-color': DEFAULT_NAMESPACE
	, 'limitingConeAngle': DEFAULT_NAMESPACE
	, 'local': DEFAULT_NAMESPACE
	, 'marker-end': DEFAULT_NAMESPACE
	, 'marker-mid': DEFAULT_NAMESPACE
	, 'marker-start': DEFAULT_NAMESPACE
	, 'markerHeight': DEFAULT_NAMESPACE
	, 'markerUnits': DEFAULT_NAMESPACE
	, 'markerWidth': DEFAULT_NAMESPACE
	, 'mask': DEFAULT_NAMESPACE
	, 'maskContentUnits': DEFAULT_NAMESPACE
	, 'maskUnits': DEFAULT_NAMESPACE
	, 'mathematical': DEFAULT_NAMESPACE
	, 'max': DEFAULT_NAMESPACE
	, 'media': DEFAULT_NAMESPACE
	, 'mediaCharacterEncoding': DEFAULT_NAMESPACE
	, 'mediaContentEncodings': DEFAULT_NAMESPACE
	, 'mediaSize': DEFAULT_NAMESPACE
	, 'mediaTime': DEFAULT_NAMESPACE
	, 'method': DEFAULT_NAMESPACE
	, 'min': DEFAULT_NAMESPACE
	, 'mode': DEFAULT_NAMESPACE
	, 'name': DEFAULT_NAMESPACE
	, 'nav-down': DEFAULT_NAMESPACE
	, 'nav-down-left': DEFAULT_NAMESPACE
	, 'nav-down-right': DEFAULT_NAMESPACE
	, 'nav-left': DEFAULT_NAMESPACE
	, 'nav-next': DEFAULT_NAMESPACE
	, 'nav-prev': DEFAULT_NAMESPACE
	, 'nav-right': DEFAULT_NAMESPACE
	, 'nav-up': DEFAULT_NAMESPACE
	, 'nav-up-left': DEFAULT_NAMESPACE
	, 'nav-up-right': DEFAULT_NAMESPACE
	, 'numOctaves': DEFAULT_NAMESPACE
	, 'observer': DEFAULT_NAMESPACE
	, 'offset': DEFAULT_NAMESPACE
	, 'opacity': DEFAULT_NAMESPACE
	, 'operator': DEFAULT_NAMESPACE
	, 'order': DEFAULT_NAMESPACE
	, 'orient': DEFAULT_NAMESPACE
	, 'orientation': DEFAULT_NAMESPACE
	, 'origin': DEFAULT_NAMESPACE
	, 'overflow': DEFAULT_NAMESPACE
	, 'overlay': DEFAULT_NAMESPACE
	, 'overline-position': DEFAULT_NAMESPACE
	, 'overline-thickness': DEFAULT_NAMESPACE
	, 'panose-1': DEFAULT_NAMESPACE
	, 'path': DEFAULT_NAMESPACE
	, 'pathLength': DEFAULT_NAMESPACE
	, 'patternContentUnits': DEFAULT_NAMESPACE
	, 'patternTransform': DEFAULT_NAMESPACE
	, 'patternUnits': DEFAULT_NAMESPACE
	, 'phase': DEFAULT_NAMESPACE
	, 'playbackOrder': DEFAULT_NAMESPACE
	, 'pointer-events': DEFAULT_NAMESPACE
	, 'points': DEFAULT_NAMESPACE
	, 'pointsAtX': DEFAULT_NAMESPACE
	, 'pointsAtY': DEFAULT_NAMESPACE
	, 'pointsAtZ': DEFAULT_NAMESPACE
	, 'preserveAlpha': DEFAULT_NAMESPACE
	, 'preserveAspectRatio': DEFAULT_NAMESPACE
	, 'primitiveUnits': DEFAULT_NAMESPACE
	, 'propagate': DEFAULT_NAMESPACE
	, 'property': DEFAULT_NAMESPACE
	, 'r': DEFAULT_NAMESPACE
	, 'radius': DEFAULT_NAMESPACE
	, 'refX': DEFAULT_NAMESPACE
	, 'refY': DEFAULT_NAMESPACE
	, 'rel': DEFAULT_NAMESPACE
	, 'rendering-intent': DEFAULT_NAMESPACE
	, 'repeatCount': DEFAULT_NAMESPACE
	, 'repeatDur': DEFAULT_NAMESPACE
	, 'requiredExtensions': DEFAULT_NAMESPACE
	, 'requiredFeatures': DEFAULT_NAMESPACE
	, 'requiredFonts': DEFAULT_NAMESPACE
	, 'requiredFormats': DEFAULT_NAMESPACE
	, 'resource': DEFAULT_NAMESPACE
	, 'restart': DEFAULT_NAMESPACE
	, 'result': DEFAULT_NAMESPACE
	, 'rev': DEFAULT_NAMESPACE
	, 'role': DEFAULT_NAMESPACE
	, 'rotate': DEFAULT_NAMESPACE
	, 'rx': DEFAULT_NAMESPACE
	, 'ry': DEFAULT_NAMESPACE
	, 'scale': DEFAULT_NAMESPACE
	, 'seed': DEFAULT_NAMESPACE
	, 'shape-rendering': DEFAULT_NAMESPACE
	, 'slope': DEFAULT_NAMESPACE
	, 'snapshotTime': DEFAULT_NAMESPACE
	, 'spacing': DEFAULT_NAMESPACE
	, 'specularConstant': DEFAULT_NAMESPACE
	, 'specularExponent': DEFAULT_NAMESPACE
	, 'spreadMethod': DEFAULT_NAMESPACE
	, 'startOffset': DEFAULT_NAMESPACE
	, 'stdDeviation': DEFAULT_NAMESPACE
	, 'stemh': DEFAULT_NAMESPACE
	, 'stemv': DEFAULT_NAMESPACE
	, 'stitchTiles': DEFAULT_NAMESPACE
	, 'stop-color': DEFAULT_NAMESPACE
	, 'stop-opacity': DEFAULT_NAMESPACE
	, 'strikethrough-position': DEFAULT_NAMESPACE
	, 'strikethrough-thickness': DEFAULT_NAMESPACE
	, 'string': DEFAULT_NAMESPACE
	, 'stroke': DEFAULT_NAMESPACE
	, 'stroke-dasharray': DEFAULT_NAMESPACE
	, 'stroke-dashoffset': DEFAULT_NAMESPACE
	, 'stroke-linecap': DEFAULT_NAMESPACE
	, 'stroke-linejoin': DEFAULT_NAMESPACE
	, 'stroke-miterlimit': DEFAULT_NAMESPACE
	, 'stroke-opacity': DEFAULT_NAMESPACE
	, 'stroke-width': DEFAULT_NAMESPACE
	, 'surfaceScale': DEFAULT_NAMESPACE
	, 'syncBehavior': DEFAULT_NAMESPACE
	, 'syncBehaviorDefault': DEFAULT_NAMESPACE
	, 'syncMaster': DEFAULT_NAMESPACE
	, 'syncTolerance': DEFAULT_NAMESPACE
	, 'syncToleranceDefault': DEFAULT_NAMESPACE
	, 'systemLanguage': DEFAULT_NAMESPACE
	, 'tableValues': DEFAULT_NAMESPACE
	, 'target': DEFAULT_NAMESPACE
	, 'targetX': DEFAULT_NAMESPACE
	, 'targetY': DEFAULT_NAMESPACE
	, 'text-anchor': DEFAULT_NAMESPACE
	, 'text-decoration': DEFAULT_NAMESPACE
	, 'text-rendering': DEFAULT_NAMESPACE
	, 'textLength': DEFAULT_NAMESPACE
	, 'timelineBegin': DEFAULT_NAMESPACE
	, 'title': DEFAULT_NAMESPACE
	, 'to': DEFAULT_NAMESPACE
	, 'transform': DEFAULT_NAMESPACE
	, 'transformBehavior': DEFAULT_NAMESPACE
	, 'type': DEFAULT_NAMESPACE
	, 'typeof': DEFAULT_NAMESPACE
	, 'u1': DEFAULT_NAMESPACE
	, 'u2': DEFAULT_NAMESPACE
	, 'underline-position': DEFAULT_NAMESPACE
	, 'underline-thickness': DEFAULT_NAMESPACE
	, 'unicode': DEFAULT_NAMESPACE
	, 'unicode-bidi': DEFAULT_NAMESPACE
	, 'unicode-range': DEFAULT_NAMESPACE
	, 'units-per-em': DEFAULT_NAMESPACE
	, 'v-alphabetic': DEFAULT_NAMESPACE
	, 'v-hanging': DEFAULT_NAMESPACE
	, 'v-ideographic': DEFAULT_NAMESPACE
	, 'v-mathematical': DEFAULT_NAMESPACE
	, 'values': DEFAULT_NAMESPACE
	, 'version': DEFAULT_NAMESPACE
	, 'vert-adv-y': DEFAULT_NAMESPACE
	, 'vert-origin-x': DEFAULT_NAMESPACE
	, 'vert-origin-y': DEFAULT_NAMESPACE
	, 'viewBox': DEFAULT_NAMESPACE
	, 'viewTarget': DEFAULT_NAMESPACE
	, 'visibility': DEFAULT_NAMESPACE
	, 'width': DEFAULT_NAMESPACE
	, 'widths': DEFAULT_NAMESPACE
	, 'word-spacing': DEFAULT_NAMESPACE
	, 'writing-mode': DEFAULT_NAMESPACE
	, 'x': DEFAULT_NAMESPACE
	, 'x-height': DEFAULT_NAMESPACE
	, 'x1': DEFAULT_NAMESPACE
	, 'x2': DEFAULT_NAMESPACE
	, 'xChannelSelector': DEFAULT_NAMESPACE
	, 'xlink:actuate': XLINK_NAMESPACE
	, 'xlink:arcrole': XLINK_NAMESPACE
	, 'xlink:href': XLINK_NAMESPACE
	, 'xlink:role': XLINK_NAMESPACE
	, 'xlink:show': XLINK_NAMESPACE
	, 'xlink:title': XLINK_NAMESPACE
	, 'xlink:type': XLINK_NAMESPACE
	, 'xml:base': XML_NAMESPACE
	, 'xml:id': XML_NAMESPACE
	, 'xml:lang': XML_NAMESPACE
	, 'xml:space': XML_NAMESPACE
	, 'y': DEFAULT_NAMESPACE
	, 'y1': DEFAULT_NAMESPACE
	, 'y2': DEFAULT_NAMESPACE
	, 'yChannelSelector': DEFAULT_NAMESPACE
	, 'z': DEFAULT_NAMESPACE
	, 'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = namespaces;

},{}],60:[function(require,module,exports){

/**
 * property-map.js
 *
 * Necessary to map dom attributes back to vdom properties
 */

'use strict';

// invert of https://www.npmjs.com/package/html-attributes
var properties = {
	'abbr': 'abbr'
	, 'accept': 'accept'
	, 'accept-charset': 'acceptCharset'
	, 'accesskey': 'accessKey'
	, 'action': 'action'
	, 'allowfullscreen': 'allowFullScreen'
	, 'allowtransparency': 'allowTransparency'
	, 'alt': 'alt'
	, 'async': 'async'
	, 'autocomplete': 'autoComplete'
	, 'autofocus': 'autoFocus'
	, 'autoplay': 'autoPlay'
	, 'cellpadding': 'cellPadding'
	, 'cellspacing': 'cellSpacing'
	, 'challenge': 'challenge'
	, 'charset': 'charset'
	, 'checked': 'checked'
	, 'cite': 'cite'
	, 'class': 'className'
	, 'cols': 'cols'
	, 'colspan': 'colSpan'
	, 'command': 'command'
	, 'content': 'content'
	, 'contenteditable': 'contentEditable'
	, 'contextmenu': 'contextMenu'
	, 'controls': 'controls'
	, 'coords': 'coords'
	, 'crossorigin': 'crossOrigin'
	, 'data': 'data'
	, 'datetime': 'dateTime'
	, 'default': 'default'
	, 'defer': 'defer'
	, 'dir': 'dir'
	, 'disabled': 'disabled'
	, 'download': 'download'
	, 'draggable': 'draggable'
	, 'dropzone': 'dropzone'
	, 'enctype': 'encType'
	, 'for': 'htmlFor'
	, 'form': 'form'
	, 'formaction': 'formAction'
	, 'formenctype': 'formEncType'
	, 'formmethod': 'formMethod'
	, 'formnovalidate': 'formNoValidate'
	, 'formtarget': 'formTarget'
	, 'frameBorder': 'frameBorder'
	, 'headers': 'headers'
	, 'height': 'height'
	, 'hidden': 'hidden'
	, 'high': 'high'
	, 'href': 'href'
	, 'hreflang': 'hrefLang'
	, 'http-equiv': 'httpEquiv'
	, 'icon': 'icon'
	, 'id': 'id'
	, 'inputmode': 'inputMode'
	, 'ismap': 'isMap'
	, 'itemid': 'itemId'
	, 'itemprop': 'itemProp'
	, 'itemref': 'itemRef'
	, 'itemscope': 'itemScope'
	, 'itemtype': 'itemType'
	, 'kind': 'kind'
	, 'label': 'label'
	, 'lang': 'lang'
	, 'list': 'list'
	, 'loop': 'loop'
	, 'manifest': 'manifest'
	, 'max': 'max'
	, 'maxlength': 'maxLength'
	, 'media': 'media'
	, 'mediagroup': 'mediaGroup'
	, 'method': 'method'
	, 'min': 'min'
	, 'minlength': 'minLength'
	, 'multiple': 'multiple'
	, 'muted': 'muted'
	, 'name': 'name'
	, 'novalidate': 'noValidate'
	, 'open': 'open'
	, 'optimum': 'optimum'
	, 'pattern': 'pattern'
	, 'ping': 'ping'
	, 'placeholder': 'placeholder'
	, 'poster': 'poster'
	, 'preload': 'preload'
	, 'radiogroup': 'radioGroup'
	, 'readonly': 'readOnly'
	, 'rel': 'rel'
	, 'required': 'required'
	, 'role': 'role'
	, 'rows': 'rows'
	, 'rowspan': 'rowSpan'
	, 'sandbox': 'sandbox'
	, 'scope': 'scope'
	, 'scoped': 'scoped'
	, 'scrolling': 'scrolling'
	, 'seamless': 'seamless'
	, 'selected': 'selected'
	, 'shape': 'shape'
	, 'size': 'size'
	, 'sizes': 'sizes'
	, 'sortable': 'sortable'
	, 'span': 'span'
	, 'spellcheck': 'spellCheck'
	, 'src': 'src'
	, 'srcdoc': 'srcDoc'
	, 'srcset': 'srcSet'
	, 'start': 'start'
	, 'step': 'step'
	, 'style': 'style'
	, 'tabindex': 'tabIndex'
	, 'target': 'target'
	, 'title': 'title'
	, 'translate': 'translate'
	, 'type': 'type'
	, 'typemustmatch': 'typeMustMatch'
	, 'usemap': 'useMap'
	, 'value': 'value'
	, 'width': 'width'
	, 'wmode': 'wmode'
	, 'wrap': 'wrap'
};

module.exports = properties;

},{}],61:[function(require,module,exports){
var escape = require('escape-html');
var propConfig = require('./property-config');
var types = propConfig.attributeTypes;
var properties = propConfig.properties;
var attributeNames = propConfig.attributeNames;

var prefixAttribute = memoizeString(function (name) {
  return escape(name) + '="';
});

module.exports = createAttribute;

/**
 * Create attribute string.
 *
 * @param {String} name The name of the property or attribute
 * @param {*} value The value
 * @param {Boolean} [isAttribute] Denotes whether `name` is an attribute.
 * @return {?String} Attribute string || null if not a valid property or custom attribute.
 */

function createAttribute(name, value, isAttribute) {
  if (properties.hasOwnProperty(name)) {
    if (shouldSkip(name, value)) return '';
    name = (attributeNames[name] || name).toLowerCase();
    var attrType = properties[name];
    // for BOOLEAN `value` only has to be truthy
    // for OVERLOADED_BOOLEAN `value` has to be === true
    if ((attrType === types.BOOLEAN) ||
        (attrType === types.OVERLOADED_BOOLEAN && value === true)) {
      return escape(name);
    }
    return prefixAttribute(name) + escape(value) + '"';
  } else if (isAttribute) {
    if (value == null) return '';
    return prefixAttribute(name) + escape(value) + '"';
  }
  // return null if `name` is neither a valid property nor an attribute
  return null;
}

/**
 * Should skip false boolean attributes.
 */

function shouldSkip(name, value) {
  var attrType = properties[name];
  return value == null ||
    (attrType === types.BOOLEAN && !value) ||
    (attrType === types.OVERLOADED_BOOLEAN && value === false);
}

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */

function memoizeString(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}
},{"./property-config":71,"escape-html":63}],62:[function(require,module,exports){
var escape = require('escape-html');
var extend = require('xtend');
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var isThunk = require('virtual-dom/vnode/is-thunk');
var isWidget = require('virtual-dom/vnode/is-widget');
var softHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook');
var attrHook = require('virtual-dom/virtual-hyperscript/hooks/attribute-hook');
var paramCase = require('param-case');
var createAttribute = require('./create-attribute');
var voidElements = require('./void-elements');

module.exports = toHTML;

function toHTML(node, parent) {
  if (!node) return '';

  if (isThunk(node)) {
    node = node.render();
  }

  if (isWidget(node) && node.render) {
    node = node.render();
  }

  if (isVNode(node)) {
    return openTag(node) + tagContent(node) + closeTag(node);
  } else if (isVText(node)) {
    if (parent && parent.tagName.toLowerCase() === 'script') return String(node.text);
    return escape(String(node.text));
  }

  return '';
}

function openTag(node) {
  var props = node.properties;
  var ret = '<' + node.tagName.toLowerCase();

  for (var name in props) {
    var value = props[name];
    if (value == null) continue;

    if (name == 'attributes') {
      value = extend({}, value);
      for (var attrProp in value) {
        ret += ' ' + createAttribute(attrProp, value[attrProp], true);
      }
      continue;
    }

    if (name == 'style') {
      var css = '';
      value = extend({}, value);
      for (var styleProp in value) {
        css += paramCase(styleProp) + ': ' + value[styleProp] + '; ';
      }
      value = css.trim();
    }

    if (value instanceof softHook || value instanceof attrHook) {
      ret += ' ' + createAttribute(name, value.value, true);
      continue;
    }

    var attr = createAttribute(name, value);
    if (attr) ret += ' ' + attr;
  }

  return ret + '>';
}

function tagContent(node) {
  var innerHTML = node.properties.innerHTML;
  if (innerHTML != null) return innerHTML;
  else {
    var ret = '';
    if (node.children && node.children.length) {
      for (var i = 0, l = node.children.length; i<l; i++) {
        var child = node.children[i];
        ret += toHTML(child, node);
      }
    }
    return ret;
  }
}

function closeTag(node) {
  var tag = node.tagName.toLowerCase();
  return voidElements[tag] ? '' : '</' + tag + '>';
}
},{"./create-attribute":61,"./void-elements":72,"escape-html":63,"param-case":69,"virtual-dom/virtual-hyperscript/hooks/attribute-hook":87,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook":89,"virtual-dom/vnode/is-thunk":95,"virtual-dom/vnode/is-vnode":97,"virtual-dom/vnode/is-vtext":98,"virtual-dom/vnode/is-widget":99,"xtend":70}],63:[function(require,module,exports){
/*!
 * escape-html
 * Copyright(c) 2012-2013 TJ Holowaychuk
 * Copyright(c) 2015 Andreas Lubbe
 * Copyright(c) 2015 Tiancheng "Timothy" Gu
 * MIT Licensed
 */

'use strict';

/**
 * Module variables.
 * @private
 */

var matchHtmlRegExp = /["'&<>]/;

/**
 * Module exports.
 * @public
 */

module.exports = escapeHtml;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string) {
  var str = '' + string;
  var match = matchHtmlRegExp.exec(str);

  if (!match) {
    return str;
  }

  var escape;
  var html = '';
  var index = 0;
  var lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

},{}],64:[function(require,module,exports){
/**
 * Special language-specific overrides.
 *
 * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
 *
 * @type {Object}
 */
var LANGUAGES = {
  tr: {
    regexp: /\u0130|\u0049|\u0049\u0307/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  az: {
    regexp: /[\u0130]/g,
    map: {
      '\u0130': '\u0069',
      '\u0049': '\u0131',
      '\u0049\u0307': '\u0069'
    }
  },
  lt: {
    regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
    map: {
      '\u0049': '\u0069\u0307',
      '\u004A': '\u006A\u0307',
      '\u012E': '\u012F\u0307',
      '\u00CC': '\u0069\u0307\u0300',
      '\u00CD': '\u0069\u0307\u0301',
      '\u0128': '\u0069\u0307\u0303'
    }
  }
}

/**
 * Lowercase a string.
 *
 * @param  {String} str
 * @return {String}
 */
module.exports = function (str, locale) {
  var lang = LANGUAGES[locale]

  str = str == null ? '' : String(str)

  if (lang) {
    str = str.replace(lang.regexp, function (m) { return lang.map[m] })
  }

  return str.toLowerCase()
}

},{}],65:[function(require,module,exports){
var lowerCase = require('lower-case')

var NON_WORD_REGEXP = require('./vendor/non-word-regexp')
var CAMEL_CASE_REGEXP = require('./vendor/camel-case-regexp')
var TRAILING_DIGIT_REGEXP = require('./vendor/trailing-digit-regexp')

/**
 * Sentence case a string.
 *
 * @param  {String} str
 * @param  {String} locale
 * @param  {String} replacement
 * @return {String}
 */
module.exports = function (str, locale, replacement) {
  if (str == null) {
    return ''
  }

  replacement = replacement || ' '

  function replace (match, index, string) {
    if (index === 0 || index === (string.length - match.length)) {
      return ''
    }

    return replacement
  }

  str = String(str)
    // Support camel case ("camelCase" -> "camel Case").
    .replace(CAMEL_CASE_REGEXP, '$1 $2')
    // Support digit groups ("test2012" -> "test 2012").
    .replace(TRAILING_DIGIT_REGEXP, '$1 $2')
    // Remove all non-word characters and replace with a single space.
    .replace(NON_WORD_REGEXP, replace)

  // Lower case the entire string.
  return lowerCase(str, locale)
}

},{"./vendor/camel-case-regexp":66,"./vendor/non-word-regexp":67,"./vendor/trailing-digit-regexp":68,"lower-case":64}],66:[function(require,module,exports){
module.exports = /([\u0061-\u007A\u00B5\u00DF-\u00F6\u00F8-\u00FF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])([\u0041-\u005A\u00C0-\u00D6\u00D8-\u00DE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],67:[function(require,module,exports){
module.exports = /[^\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g

},{}],68:[function(require,module,exports){
module.exports = /([\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([^\u0030-\u0039\u00B2\u00B3\u00B9\u00BC-\u00BE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])/g

},{}],69:[function(require,module,exports){
var sentenceCase = require('sentence-case');

/**
 * Param case a string.
 *
 * @param  {String} string
 * @param  {String} [locale]
 * @return {String}
 */
module.exports = function (string, locale) {
  return sentenceCase(string, locale, '-');
};

},{"sentence-case":65}],70:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],71:[function(require,module,exports){
/**
 * Attribute types.
 */

var types = {
  BOOLEAN: 1,
  OVERLOADED_BOOLEAN: 2
};

/**
 * Properties.
 *
 * Taken from https://github.com/facebook/react/blob/847357e42e5267b04dd6e297219eaa125ab2f9f4/src/browser/ui/dom/HTMLDOMPropertyConfig.js
 *
 */

var properties = {
  /**
   * Standard Properties
   */
  accept: true,
  acceptCharset: true,
  accessKey: true,
  action: true,
  allowFullScreen: types.BOOLEAN,
  allowTransparency: true,
  alt: true,
  async: types.BOOLEAN,
  autocomplete: true,
  autofocus: types.BOOLEAN,
  autoplay: types.BOOLEAN,
  cellPadding: true,
  cellSpacing: true,
  charset: true,
  checked: types.BOOLEAN,
  classID: true,
  className: true,
  cols: true,
  colSpan: true,
  content: true,
  contentEditable: true,
  contextMenu: true,
  controls: types.BOOLEAN,
  coords: true,
  crossOrigin: true,
  data: true, // For `<object />` acts as `src`.
  dateTime: true,
  defer: types.BOOLEAN,
  dir: true,
  disabled: types.BOOLEAN,
  download: types.OVERLOADED_BOOLEAN,
  draggable: true,
  enctype: true,
  form: true,
  formAction: true,
  formEncType: true,
  formMethod: true,
  formNoValidate: types.BOOLEAN,
  formTarget: true,
  frameBorder: true,
  headers: true,
  height: true,
  hidden: types.BOOLEAN,
  href: true,
  hreflang: true,
  htmlFor: true,
  httpEquiv: true,
  icon: true,
  id: true,
  label: true,
  lang: true,
  list: true,
  loop: types.BOOLEAN,
  manifest: true,
  marginHeight: true,
  marginWidth: true,
  max: true,
  maxLength: true,
  media: true,
  mediaGroup: true,
  method: true,
  min: true,
  multiple: types.BOOLEAN,
  muted: types.BOOLEAN,
  name: true,
  noValidate: types.BOOLEAN,
  open: true,
  pattern: true,
  placeholder: true,
  poster: true,
  preload: true,
  radiogroup: true,
  readOnly: types.BOOLEAN,
  rel: true,
  required: types.BOOLEAN,
  role: true,
  rows: true,
  rowSpan: true,
  sandbox: true,
  scope: true,
  scrolling: true,
  seamless: types.BOOLEAN,
  selected: types.BOOLEAN,
  shape: true,
  size: true,
  sizes: true,
  span: true,
  spellcheck: true,
  src: true,
  srcdoc: true,
  srcset: true,
  start: true,
  step: true,
  style: true,
  tabIndex: true,
  target: true,
  title: true,
  type: true,
  useMap: true,
  value: true,
  width: true,
  wmode: true,

  /**
   * Non-standard Properties
   */
  // autoCapitalize and autoCorrect are supported in Mobile Safari for
  // keyboard hints.
  autocapitalize: true,
  autocorrect: true,
  // itemProp, itemScope, itemType are for Microdata support. See
  // http://schema.org/docs/gs.html
  itemProp: true,
  itemScope: types.BOOLEAN,
  itemType: true,
  // property is supported for OpenGraph in meta tags.
  property: true
};

/**
 * Properties to attributes mapping.
 *
 * The ones not here are simply converted to lower case.
 */

var attributeNames = {
  acceptCharset: 'accept-charset',
  className: 'class',
  htmlFor: 'for',
  httpEquiv: 'http-equiv'
};

/**
 * Exports.
 */

module.exports = {
  attributeTypes: types,
  properties: properties,
  attributeNames: attributeNames
};
},{}],72:[function(require,module,exports){

/**
 * Void elements.
 *
 * https://github.com/facebook/react/blob/v0.12.0/src/browser/ui/ReactDOMComponent.js#L99
 */

module.exports = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
};
},{}],73:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":105}],74:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],75:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":77}],76:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],77:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":76}],78:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":1}],79:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],80:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":85}],81:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":96,"is-object":79}],82:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":94,"../vnode/is-vnode.js":97,"../vnode/is-vtext.js":98,"../vnode/is-widget.js":99,"./apply-properties":81,"global/document":78}],83:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],84:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":99,"../vnode/vpatch.js":102,"./apply-properties":81,"./update-widget":86}],85:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":82,"./dom-index":83,"./patch-op":84,"global/document":78,"x-is-array":106}],86:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":99}],87:[function(require,module,exports){
'use strict';

module.exports = AttributeHook;

function AttributeHook(namespace, value) {
    if (!(this instanceof AttributeHook)) {
        return new AttributeHook(namespace, value);
    }

    this.namespace = namespace;
    this.value = value;
}

AttributeHook.prototype.hook = function (node, prop, prev) {
    if (prev && prev.type === 'AttributeHook' &&
        prev.value === this.value &&
        prev.namespace === this.namespace) {
        return;
    }

    node.setAttributeNS(this.namespace, prop, this.value);
};

AttributeHook.prototype.unhook = function (node, prop, next) {
    if (next && next.type === 'AttributeHook' &&
        next.namespace === this.namespace) {
        return;
    }

    var colonPosition = prop.indexOf(':');
    var localName = colonPosition > -1 ? prop.substr(colonPosition + 1) : prop;
    node.removeAttributeNS(this.namespace, localName);
};

AttributeHook.prototype.type = 'AttributeHook';

},{}],88:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":75}],89:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],90:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":95,"../vnode/is-vhook":96,"../vnode/is-vnode":97,"../vnode/is-vtext":98,"../vnode/is-widget":99,"../vnode/vnode.js":101,"../vnode/vtext.js":103,"./hooks/ev-hook.js":88,"./hooks/soft-set-hook.js":89,"./parse-tag.js":91,"x-is-array":106}],91:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":74}],92:[function(require,module,exports){
'use strict';

var DEFAULT_NAMESPACE = null;
var EV_NAMESPACE = 'http://www.w3.org/2001/xml-events';
var XLINK_NAMESPACE = 'http://www.w3.org/1999/xlink';
var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace';

// http://www.w3.org/TR/SVGTiny12/attributeTable.html
// http://www.w3.org/TR/SVG/attindex.html
var SVG_PROPERTIES = {
    'about': DEFAULT_NAMESPACE,
    'accent-height': DEFAULT_NAMESPACE,
    'accumulate': DEFAULT_NAMESPACE,
    'additive': DEFAULT_NAMESPACE,
    'alignment-baseline': DEFAULT_NAMESPACE,
    'alphabetic': DEFAULT_NAMESPACE,
    'amplitude': DEFAULT_NAMESPACE,
    'arabic-form': DEFAULT_NAMESPACE,
    'ascent': DEFAULT_NAMESPACE,
    'attributeName': DEFAULT_NAMESPACE,
    'attributeType': DEFAULT_NAMESPACE,
    'azimuth': DEFAULT_NAMESPACE,
    'bandwidth': DEFAULT_NAMESPACE,
    'baseFrequency': DEFAULT_NAMESPACE,
    'baseProfile': DEFAULT_NAMESPACE,
    'baseline-shift': DEFAULT_NAMESPACE,
    'bbox': DEFAULT_NAMESPACE,
    'begin': DEFAULT_NAMESPACE,
    'bias': DEFAULT_NAMESPACE,
    'by': DEFAULT_NAMESPACE,
    'calcMode': DEFAULT_NAMESPACE,
    'cap-height': DEFAULT_NAMESPACE,
    'class': DEFAULT_NAMESPACE,
    'clip': DEFAULT_NAMESPACE,
    'clip-path': DEFAULT_NAMESPACE,
    'clip-rule': DEFAULT_NAMESPACE,
    'clipPathUnits': DEFAULT_NAMESPACE,
    'color': DEFAULT_NAMESPACE,
    'color-interpolation': DEFAULT_NAMESPACE,
    'color-interpolation-filters': DEFAULT_NAMESPACE,
    'color-profile': DEFAULT_NAMESPACE,
    'color-rendering': DEFAULT_NAMESPACE,
    'content': DEFAULT_NAMESPACE,
    'contentScriptType': DEFAULT_NAMESPACE,
    'contentStyleType': DEFAULT_NAMESPACE,
    'cursor': DEFAULT_NAMESPACE,
    'cx': DEFAULT_NAMESPACE,
    'cy': DEFAULT_NAMESPACE,
    'd': DEFAULT_NAMESPACE,
    'datatype': DEFAULT_NAMESPACE,
    'defaultAction': DEFAULT_NAMESPACE,
    'descent': DEFAULT_NAMESPACE,
    'diffuseConstant': DEFAULT_NAMESPACE,
    'direction': DEFAULT_NAMESPACE,
    'display': DEFAULT_NAMESPACE,
    'divisor': DEFAULT_NAMESPACE,
    'dominant-baseline': DEFAULT_NAMESPACE,
    'dur': DEFAULT_NAMESPACE,
    'dx': DEFAULT_NAMESPACE,
    'dy': DEFAULT_NAMESPACE,
    'edgeMode': DEFAULT_NAMESPACE,
    'editable': DEFAULT_NAMESPACE,
    'elevation': DEFAULT_NAMESPACE,
    'enable-background': DEFAULT_NAMESPACE,
    'end': DEFAULT_NAMESPACE,
    'ev:event': EV_NAMESPACE,
    'event': DEFAULT_NAMESPACE,
    'exponent': DEFAULT_NAMESPACE,
    'externalResourcesRequired': DEFAULT_NAMESPACE,
    'fill': DEFAULT_NAMESPACE,
    'fill-opacity': DEFAULT_NAMESPACE,
    'fill-rule': DEFAULT_NAMESPACE,
    'filter': DEFAULT_NAMESPACE,
    'filterRes': DEFAULT_NAMESPACE,
    'filterUnits': DEFAULT_NAMESPACE,
    'flood-color': DEFAULT_NAMESPACE,
    'flood-opacity': DEFAULT_NAMESPACE,
    'focusHighlight': DEFAULT_NAMESPACE,
    'focusable': DEFAULT_NAMESPACE,
    'font-family': DEFAULT_NAMESPACE,
    'font-size': DEFAULT_NAMESPACE,
    'font-size-adjust': DEFAULT_NAMESPACE,
    'font-stretch': DEFAULT_NAMESPACE,
    'font-style': DEFAULT_NAMESPACE,
    'font-variant': DEFAULT_NAMESPACE,
    'font-weight': DEFAULT_NAMESPACE,
    'format': DEFAULT_NAMESPACE,
    'from': DEFAULT_NAMESPACE,
    'fx': DEFAULT_NAMESPACE,
    'fy': DEFAULT_NAMESPACE,
    'g1': DEFAULT_NAMESPACE,
    'g2': DEFAULT_NAMESPACE,
    'glyph-name': DEFAULT_NAMESPACE,
    'glyph-orientation-horizontal': DEFAULT_NAMESPACE,
    'glyph-orientation-vertical': DEFAULT_NAMESPACE,
    'glyphRef': DEFAULT_NAMESPACE,
    'gradientTransform': DEFAULT_NAMESPACE,
    'gradientUnits': DEFAULT_NAMESPACE,
    'handler': DEFAULT_NAMESPACE,
    'hanging': DEFAULT_NAMESPACE,
    'height': DEFAULT_NAMESPACE,
    'horiz-adv-x': DEFAULT_NAMESPACE,
    'horiz-origin-x': DEFAULT_NAMESPACE,
    'horiz-origin-y': DEFAULT_NAMESPACE,
    'id': DEFAULT_NAMESPACE,
    'ideographic': DEFAULT_NAMESPACE,
    'image-rendering': DEFAULT_NAMESPACE,
    'in': DEFAULT_NAMESPACE,
    'in2': DEFAULT_NAMESPACE,
    'initialVisibility': DEFAULT_NAMESPACE,
    'intercept': DEFAULT_NAMESPACE,
    'k': DEFAULT_NAMESPACE,
    'k1': DEFAULT_NAMESPACE,
    'k2': DEFAULT_NAMESPACE,
    'k3': DEFAULT_NAMESPACE,
    'k4': DEFAULT_NAMESPACE,
    'kernelMatrix': DEFAULT_NAMESPACE,
    'kernelUnitLength': DEFAULT_NAMESPACE,
    'kerning': DEFAULT_NAMESPACE,
    'keyPoints': DEFAULT_NAMESPACE,
    'keySplines': DEFAULT_NAMESPACE,
    'keyTimes': DEFAULT_NAMESPACE,
    'lang': DEFAULT_NAMESPACE,
    'lengthAdjust': DEFAULT_NAMESPACE,
    'letter-spacing': DEFAULT_NAMESPACE,
    'lighting-color': DEFAULT_NAMESPACE,
    'limitingConeAngle': DEFAULT_NAMESPACE,
    'local': DEFAULT_NAMESPACE,
    'marker-end': DEFAULT_NAMESPACE,
    'marker-mid': DEFAULT_NAMESPACE,
    'marker-start': DEFAULT_NAMESPACE,
    'markerHeight': DEFAULT_NAMESPACE,
    'markerUnits': DEFAULT_NAMESPACE,
    'markerWidth': DEFAULT_NAMESPACE,
    'mask': DEFAULT_NAMESPACE,
    'maskContentUnits': DEFAULT_NAMESPACE,
    'maskUnits': DEFAULT_NAMESPACE,
    'mathematical': DEFAULT_NAMESPACE,
    'max': DEFAULT_NAMESPACE,
    'media': DEFAULT_NAMESPACE,
    'mediaCharacterEncoding': DEFAULT_NAMESPACE,
    'mediaContentEncodings': DEFAULT_NAMESPACE,
    'mediaSize': DEFAULT_NAMESPACE,
    'mediaTime': DEFAULT_NAMESPACE,
    'method': DEFAULT_NAMESPACE,
    'min': DEFAULT_NAMESPACE,
    'mode': DEFAULT_NAMESPACE,
    'name': DEFAULT_NAMESPACE,
    'nav-down': DEFAULT_NAMESPACE,
    'nav-down-left': DEFAULT_NAMESPACE,
    'nav-down-right': DEFAULT_NAMESPACE,
    'nav-left': DEFAULT_NAMESPACE,
    'nav-next': DEFAULT_NAMESPACE,
    'nav-prev': DEFAULT_NAMESPACE,
    'nav-right': DEFAULT_NAMESPACE,
    'nav-up': DEFAULT_NAMESPACE,
    'nav-up-left': DEFAULT_NAMESPACE,
    'nav-up-right': DEFAULT_NAMESPACE,
    'numOctaves': DEFAULT_NAMESPACE,
    'observer': DEFAULT_NAMESPACE,
    'offset': DEFAULT_NAMESPACE,
    'opacity': DEFAULT_NAMESPACE,
    'operator': DEFAULT_NAMESPACE,
    'order': DEFAULT_NAMESPACE,
    'orient': DEFAULT_NAMESPACE,
    'orientation': DEFAULT_NAMESPACE,
    'origin': DEFAULT_NAMESPACE,
    'overflow': DEFAULT_NAMESPACE,
    'overlay': DEFAULT_NAMESPACE,
    'overline-position': DEFAULT_NAMESPACE,
    'overline-thickness': DEFAULT_NAMESPACE,
    'panose-1': DEFAULT_NAMESPACE,
    'path': DEFAULT_NAMESPACE,
    'pathLength': DEFAULT_NAMESPACE,
    'patternContentUnits': DEFAULT_NAMESPACE,
    'patternTransform': DEFAULT_NAMESPACE,
    'patternUnits': DEFAULT_NAMESPACE,
    'phase': DEFAULT_NAMESPACE,
    'playbackOrder': DEFAULT_NAMESPACE,
    'pointer-events': DEFAULT_NAMESPACE,
    'points': DEFAULT_NAMESPACE,
    'pointsAtX': DEFAULT_NAMESPACE,
    'pointsAtY': DEFAULT_NAMESPACE,
    'pointsAtZ': DEFAULT_NAMESPACE,
    'preserveAlpha': DEFAULT_NAMESPACE,
    'preserveAspectRatio': DEFAULT_NAMESPACE,
    'primitiveUnits': DEFAULT_NAMESPACE,
    'propagate': DEFAULT_NAMESPACE,
    'property': DEFAULT_NAMESPACE,
    'r': DEFAULT_NAMESPACE,
    'radius': DEFAULT_NAMESPACE,
    'refX': DEFAULT_NAMESPACE,
    'refY': DEFAULT_NAMESPACE,
    'rel': DEFAULT_NAMESPACE,
    'rendering-intent': DEFAULT_NAMESPACE,
    'repeatCount': DEFAULT_NAMESPACE,
    'repeatDur': DEFAULT_NAMESPACE,
    'requiredExtensions': DEFAULT_NAMESPACE,
    'requiredFeatures': DEFAULT_NAMESPACE,
    'requiredFonts': DEFAULT_NAMESPACE,
    'requiredFormats': DEFAULT_NAMESPACE,
    'resource': DEFAULT_NAMESPACE,
    'restart': DEFAULT_NAMESPACE,
    'result': DEFAULT_NAMESPACE,
    'rev': DEFAULT_NAMESPACE,
    'role': DEFAULT_NAMESPACE,
    'rotate': DEFAULT_NAMESPACE,
    'rx': DEFAULT_NAMESPACE,
    'ry': DEFAULT_NAMESPACE,
    'scale': DEFAULT_NAMESPACE,
    'seed': DEFAULT_NAMESPACE,
    'shape-rendering': DEFAULT_NAMESPACE,
    'slope': DEFAULT_NAMESPACE,
    'snapshotTime': DEFAULT_NAMESPACE,
    'spacing': DEFAULT_NAMESPACE,
    'specularConstant': DEFAULT_NAMESPACE,
    'specularExponent': DEFAULT_NAMESPACE,
    'spreadMethod': DEFAULT_NAMESPACE,
    'startOffset': DEFAULT_NAMESPACE,
    'stdDeviation': DEFAULT_NAMESPACE,
    'stemh': DEFAULT_NAMESPACE,
    'stemv': DEFAULT_NAMESPACE,
    'stitchTiles': DEFAULT_NAMESPACE,
    'stop-color': DEFAULT_NAMESPACE,
    'stop-opacity': DEFAULT_NAMESPACE,
    'strikethrough-position': DEFAULT_NAMESPACE,
    'strikethrough-thickness': DEFAULT_NAMESPACE,
    'string': DEFAULT_NAMESPACE,
    'stroke': DEFAULT_NAMESPACE,
    'stroke-dasharray': DEFAULT_NAMESPACE,
    'stroke-dashoffset': DEFAULT_NAMESPACE,
    'stroke-linecap': DEFAULT_NAMESPACE,
    'stroke-linejoin': DEFAULT_NAMESPACE,
    'stroke-miterlimit': DEFAULT_NAMESPACE,
    'stroke-opacity': DEFAULT_NAMESPACE,
    'stroke-width': DEFAULT_NAMESPACE,
    'surfaceScale': DEFAULT_NAMESPACE,
    'syncBehavior': DEFAULT_NAMESPACE,
    'syncBehaviorDefault': DEFAULT_NAMESPACE,
    'syncMaster': DEFAULT_NAMESPACE,
    'syncTolerance': DEFAULT_NAMESPACE,
    'syncToleranceDefault': DEFAULT_NAMESPACE,
    'systemLanguage': DEFAULT_NAMESPACE,
    'tableValues': DEFAULT_NAMESPACE,
    'target': DEFAULT_NAMESPACE,
    'targetX': DEFAULT_NAMESPACE,
    'targetY': DEFAULT_NAMESPACE,
    'text-anchor': DEFAULT_NAMESPACE,
    'text-decoration': DEFAULT_NAMESPACE,
    'text-rendering': DEFAULT_NAMESPACE,
    'textLength': DEFAULT_NAMESPACE,
    'timelineBegin': DEFAULT_NAMESPACE,
    'title': DEFAULT_NAMESPACE,
    'to': DEFAULT_NAMESPACE,
    'transform': DEFAULT_NAMESPACE,
    'transformBehavior': DEFAULT_NAMESPACE,
    'type': DEFAULT_NAMESPACE,
    'typeof': DEFAULT_NAMESPACE,
    'u1': DEFAULT_NAMESPACE,
    'u2': DEFAULT_NAMESPACE,
    'underline-position': DEFAULT_NAMESPACE,
    'underline-thickness': DEFAULT_NAMESPACE,
    'unicode': DEFAULT_NAMESPACE,
    'unicode-bidi': DEFAULT_NAMESPACE,
    'unicode-range': DEFAULT_NAMESPACE,
    'units-per-em': DEFAULT_NAMESPACE,
    'v-alphabetic': DEFAULT_NAMESPACE,
    'v-hanging': DEFAULT_NAMESPACE,
    'v-ideographic': DEFAULT_NAMESPACE,
    'v-mathematical': DEFAULT_NAMESPACE,
    'values': DEFAULT_NAMESPACE,
    'version': DEFAULT_NAMESPACE,
    'vert-adv-y': DEFAULT_NAMESPACE,
    'vert-origin-x': DEFAULT_NAMESPACE,
    'vert-origin-y': DEFAULT_NAMESPACE,
    'viewBox': DEFAULT_NAMESPACE,
    'viewTarget': DEFAULT_NAMESPACE,
    'visibility': DEFAULT_NAMESPACE,
    'width': DEFAULT_NAMESPACE,
    'widths': DEFAULT_NAMESPACE,
    'word-spacing': DEFAULT_NAMESPACE,
    'writing-mode': DEFAULT_NAMESPACE,
    'x': DEFAULT_NAMESPACE,
    'x-height': DEFAULT_NAMESPACE,
    'x1': DEFAULT_NAMESPACE,
    'x2': DEFAULT_NAMESPACE,
    'xChannelSelector': DEFAULT_NAMESPACE,
    'xlink:actuate': XLINK_NAMESPACE,
    'xlink:arcrole': XLINK_NAMESPACE,
    'xlink:href': XLINK_NAMESPACE,
    'xlink:role': XLINK_NAMESPACE,
    'xlink:show': XLINK_NAMESPACE,
    'xlink:title': XLINK_NAMESPACE,
    'xlink:type': XLINK_NAMESPACE,
    'xml:base': XML_NAMESPACE,
    'xml:id': XML_NAMESPACE,
    'xml:lang': XML_NAMESPACE,
    'xml:space': XML_NAMESPACE,
    'y': DEFAULT_NAMESPACE,
    'y1': DEFAULT_NAMESPACE,
    'y2': DEFAULT_NAMESPACE,
    'yChannelSelector': DEFAULT_NAMESPACE,
    'z': DEFAULT_NAMESPACE,
    'zoomAndPan': DEFAULT_NAMESPACE
};

module.exports = SVGAttributeNamespace;

function SVGAttributeNamespace(value) {
  if (SVG_PROPERTIES.hasOwnProperty(value)) {
    return SVG_PROPERTIES[value];
  }
}

},{}],93:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var h = require('./index.js');


var SVGAttributeNamespace = require('./svg-attribute-namespace');
var attributeHook = require('./hooks/attribute-hook');

var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

module.exports = svg;

function svg(tagName, properties, children) {
    if (!children && isChildren(properties)) {
        children = properties;
        properties = {};
    }

    properties = properties || {};

    // set namespace for svg
    properties.namespace = SVG_NAMESPACE;

    var attributes = properties.attributes || (properties.attributes = {});

    for (var key in properties) {
        if (!properties.hasOwnProperty(key)) {
            continue;
        }

        var namespace = SVGAttributeNamespace(key);

        if (namespace === undefined) { // not a svg attribute
            continue;
        }

        var value = properties[key];

        if (typeof value !== 'string' &&
            typeof value !== 'number' &&
            typeof value !== 'boolean'
        ) {
            continue;
        }

        if (namespace !== null) { // namespaced attribute
            properties[key] = attributeHook(namespace, value);
            continue;
        }

        attributes[key] = value
        properties[key] = undefined
    }

    return h(tagName, properties, children);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x);
}

},{"./hooks/attribute-hook":87,"./index.js":90,"./svg-attribute-namespace":92,"x-is-array":106}],94:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":95,"./is-vnode":97,"./is-vtext":98,"./is-widget":99}],95:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],96:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],97:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":100}],98:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":100}],99:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],100:[function(require,module,exports){
module.exports = "2"

},{}],101:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":95,"./is-vhook":96,"./is-vnode":97,"./is-widget":99,"./version":100}],102:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":100}],103:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":100}],104:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":96,"is-object":79}],105:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":94,"../vnode/is-thunk":95,"../vnode/is-vnode":97,"../vnode/is-vtext":98,"../vnode/is-widget":99,"../vnode/vpatch":102,"./diff-props":104,"x-is-array":106}],106:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],107:[function(require,module,exports){
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Rx = require("rx");
var ALL_PROPS = "*";
var PROPS_DRIVER_NAME = "props";
var EVENTS_SINK_NAME = "events";

function makeDispatchFunction(element, eventName) {
  return function dispatchCustomEvent(evData) {
    //console.log(`%cdispatchCustomEvent ` + eventName,
    //  `background-color: #CCCCFF; color: black`);
    var event = undefined;
    try {
      event = new Event(eventName);
    } catch (err) {
      event = document.createEvent("Event");
      event.initEvent(eventName, true, true);
    }
    event.detail = evData;
    element.dispatchEvent(event);
  };
}

function subscribeDispatchers(element) {
  var customEvents = element.cycleCustomElementMetadata.customEvents;

  var disposables = new Rx.CompositeDisposable();
  for (var _name in customEvents) {
    if (customEvents.hasOwnProperty(_name) && typeof customEvents[_name].subscribe === "function") {
      var disposable = customEvents[_name].subscribe(makeDispatchFunction(element, _name));
      disposables.add(disposable);
    }
  }
  return disposables;
}

function subscribeDispatchersWhenRootChanges(metadata) {
  return metadata.rootElem$.distinctUntilChanged(Rx.helpers.identity, function (x, y) {
    return x && y && x.isEqualNode && x.isEqualNode(y);
  }).subscribe(function resubscribeDispatchers(rootElem) {
    if (metadata.eventDispatchingSubscription) {
      metadata.eventDispatchingSubscription.dispose();
    }
    metadata.eventDispatchingSubscription = subscribeDispatchers(rootElem);
  });
}

function subscribeEventDispatchingSink(element, widget) {
  element.cycleCustomElementMetadata.eventDispatchingSubscription = subscribeDispatchers(element);
  widget.disposables.add(element.cycleCustomElementMetadata.eventDispatchingSubscription);
  widget.disposables.add(subscribeDispatchersWhenRootChanges(element.cycleCustomElementMetadata));
}

function makePropertiesDriver() {
  var propertiesDriver = {};
  var defaultComparer = Rx.helpers.defaultComparer;
  Object.defineProperty(propertiesDriver, "type", {
    enumerable: false,
    value: "PropertiesDriver"
  });
  Object.defineProperty(propertiesDriver, "get", {
    enumerable: false,
    value: function get(streamKey) {
      var comparer = arguments.length <= 1 || arguments[1] === undefined ? defaultComparer : arguments[1];

      if (typeof streamKey === "undefined") {
        throw new Error("Custom element driver `props.get()` expects an " + "argument in the getter.");
      }
      if (typeof this[streamKey] === "undefined") {
        this[streamKey] = new Rx.ReplaySubject(1);
      }
      return this[streamKey].distinctUntilChanged(Rx.helpers.identity, comparer);
    }
  });
  Object.defineProperty(propertiesDriver, "getAll", {
    enumerable: false,
    value: function getAll() {
      return this.get(ALL_PROPS);
    }
  });
  return propertiesDriver;
}

function createContainerElement(tagName, vtreeProperties) {
  var element = document.createElement("div");
  element.id = vtreeProperties.id || "";
  element.className = vtreeProperties.className || "";
  element.className += " cycleCustomElement-" + tagName.toUpperCase();
  element.className = element.className.trim();
  element.cycleCustomElementMetadata = {
    propertiesDriver: null,
    rootElem$: null,
    customEvents: null,
    eventDispatchingSubscription: false
  };
  return element;
}

function throwIfVTreeHasPropertyChildren(vtree) {
  if (typeof vtree.properties.children !== "undefined") {
    throw new Error("Custom element should not have property `children`. " + "It is reserved for children elements nested into this custom element.");
  }
}

function makeCustomElementInput(domOutput, propertiesDriver, domDriverName) {
  var _ref;

  return (_ref = {}, _defineProperty(_ref, domDriverName, domOutput), _defineProperty(_ref, PROPS_DRIVER_NAME, propertiesDriver), _ref);
}

function makeConstructor() {
  return function customElementConstructor(vtree, CERegistry, driverName) {
    //console.log(`%cnew (constructor) custom element ` + vtree.tagName,
    //  `color: #880088`)
    throwIfVTreeHasPropertyChildren(vtree);
    this.type = "Widget";
    this.properties = vtree.properties;
    this.properties.children = vtree.children;
    this.key = vtree.key;
    this.isCustomElementWidget = true;
    this.customElementsRegistry = CERegistry;
    this.driverName = driverName;
    this.firstRootElem$ = new Rx.ReplaySubject(1);
    this.disposables = new Rx.CompositeDisposable();
  };
}

function validateDefFnOutput(defFnOutput, domDriverName, tagName) {
  if (typeof defFnOutput !== "object") {
    throw new Error("Custom element definition function for `" + tagName + "` " + " should output an object.");
  }
  if (typeof defFnOutput[domDriverName] === "undefined") {
    throw new Error("Custom element definition function for '" + tagName + "' " + ("should output an object containing `" + domDriverName + "`."));
  }
  if (typeof defFnOutput[domDriverName].subscribe !== "function") {
    throw new Error("Custom element definition function for `" + tagName + "` " + "should output an object containing an Observable of VTree, named " + ("`" + domDriverName + "`."));
  }
  for (var _name2 in defFnOutput) {
    if (defFnOutput.hasOwnProperty(_name2) && _name2 !== domDriverName && _name2 !== EVENTS_SINK_NAME) {
      throw new Error("Unknown `" + _name2 + "` found on custom element " + ("`" + tagName + "`s definition function's output."));
    }
  }
}

function makeInit(tagName, definitionFn) {
  var _require = require("./render-dom");

  var makeDOMDriverWithRegistry = _require.makeDOMDriverWithRegistry;

  return function initCustomElement() {
    //console.log(`%cInit() custom element ` + tagName, `color: #880088`)
    var widget = this;
    var driverName = widget.driverName;
    var registry = widget.customElementsRegistry;
    var element = createContainerElement(tagName, widget.properties);
    var proxyVTree$ = new Rx.ReplaySubject(1);
    var domDriver = makeDOMDriverWithRegistry(element, registry);
    var propertiesDriver = makePropertiesDriver();
    var domResponse = domDriver(proxyVTree$, driverName);
    var rootElem$ = domResponse.select(":root").observable;
    rootElem$.subscribe(function (rootElem) {
      // This is expected to happen before initCustomElement() returns `element`
      element = rootElem;
    });
    var defFnInput = makeCustomElementInput(domResponse, propertiesDriver, driverName);
    var requests = definitionFn(defFnInput);
    validateDefFnOutput(requests, driverName, tagName);
    widget.disposables.add(requests[driverName].subscribe(proxyVTree$.asObserver()));
    widget.disposables.add(rootElem$.subscribe(widget.firstRootElem$.asObserver()));
    element.cycleCustomElementMetadata = {
      propertiesDriver: propertiesDriver,
      rootElem$: rootElem$,
      customEvents: requests.events,
      eventDispatchingSubscription: false
    };
    subscribeEventDispatchingSink(element, widget);
    widget.disposables.add(widget.firstRootElem$);
    widget.disposables.add(proxyVTree$);
    widget.disposables.add(domResponse);
    widget.update(null, element);
    return element;
  };
}

function validatePropertiesDriverInMetadata(element, fnName) {
  if (!element) {
    throw new Error("Missing DOM element when calling `" + fnName + "` on " + "custom element Widget.");
  }
  if (!element.cycleCustomElementMetadata) {
    throw new Error("Missing custom element metadata on DOM element when " + ("calling `" + fnName + "` on custom element Widget."));
  }
  var metadata = element.cycleCustomElementMetadata;
  if (metadata.propertiesDriver.type !== "PropertiesDriver") {
    throw new Error("Custom element metadata's propertiesDriver type is " + ("invalid: `" + metadata.propertiesDriver.type + "`."));
  }
}

function updateCustomElement(previous, element) {
  if (previous) {
    this.disposables = previous.disposables;
    this.firstRootElem$.onNext(0);
    this.firstRootElem$.onCompleted();
  }
  validatePropertiesDriverInMetadata(element, "update()");

  //console.log(`%cupdate() ${element.className}`, `color: #880088`)
  var propsDriver = element.cycleCustomElementMetadata.propertiesDriver;
  if (propsDriver.hasOwnProperty(ALL_PROPS)) {
    propsDriver[ALL_PROPS].onNext(this.properties);
  }
  for (var prop in propsDriver) {
    if (propsDriver.hasOwnProperty(prop) && this.properties.hasOwnProperty(prop)) {
      propsDriver[prop].onNext(this.properties[prop]);
    }
  }
}

function destroyCustomElement(element) {
  //console.log(`%cdestroy() custom el ${element.className}`, `color: #808`)
  // Dispose propertiesDriver
  var propsDriver = element.cycleCustomElementMetadata.propertiesDriver;
  for (var prop in propsDriver) {
    if (propsDriver.hasOwnProperty(prop)) {
      this.disposables.add(propsDriver[prop]);
    }
  }
  if (element.cycleCustomElementMetadata.eventDispatchingSubscription) {
    // This subscription has to be disposed.
    // Because disposing subscribeDispatchersWhenRootChanges only
    // is not enough.
    this.disposables.add(element.cycleCustomElementMetadata.eventDispatchingSubscription);
  }
  this.disposables.dispose();
}

function makeWidgetClass(tagName, definitionFn) {
  if (typeof definitionFn !== "function") {
    throw new Error("A custom element definition given to the DOM driver " + "should be a function.");
  }

  var WidgetClass = makeConstructor();
  WidgetClass.definitionFn = definitionFn; // needed by renderAsHTML
  WidgetClass.prototype.init = makeInit(tagName, definitionFn);
  WidgetClass.prototype.update = updateCustomElement;
  WidgetClass.prototype.destroy = destroyCustomElement;
  return WidgetClass;
}

module.exports = {
  makeDispatchFunction: makeDispatchFunction,
  subscribeDispatchers: subscribeDispatchers,
  subscribeDispatchersWhenRootChanges: subscribeDispatchersWhenRootChanges,
  makePropertiesDriver: makePropertiesDriver,
  createContainerElement: createContainerElement,
  throwIfVTreeHasPropertyChildren: throwIfVTreeHasPropertyChildren,
  makeConstructor: makeConstructor,
  makeInit: makeInit,
  updateCustomElement: updateCustomElement,
  destroyCustomElement: destroyCustomElement,

  ALL_PROPS: ALL_PROPS,
  makeCustomElementInput: makeCustomElementInput,
  makeWidgetClass: makeWidgetClass
};

},{"./render-dom":112,"rx":undefined}],108:[function(require,module,exports){
"use strict";

var _require = require("./custom-element-widget");

var makeWidgetClass = _require.makeWidgetClass;

var Map = Map || require("es6-map"); // eslint-disable-line no-native-reassign

function replaceCustomElementsWithSomething(vtree, registry, toSomethingFn) {
  // Silently ignore corner cases
  if (!vtree) {
    return vtree;
  }
  var tagName = (vtree.tagName || "").toUpperCase();
  // Replace vtree itself
  if (tagName && registry.has(tagName)) {
    var WidgetClass = registry.get(tagName);
    return toSomethingFn(vtree, WidgetClass);
  }
  // Or replace children recursively
  if (Array.isArray(vtree.children)) {
    for (var i = vtree.children.length - 1; i >= 0; i--) {
      vtree.children[i] = replaceCustomElementsWithSomething(vtree.children[i], registry, toSomethingFn);
    }
  }
  return vtree;
}

function makeCustomElementsRegistry(definitions) {
  var registry = new Map();
  for (var tagName in definitions) {
    if (definitions.hasOwnProperty(tagName)) {
      registry.set(tagName.toUpperCase(), makeWidgetClass(tagName, definitions[tagName]));
    }
  }
  return registry;
}

module.exports = {
  replaceCustomElementsWithSomething: replaceCustomElementsWithSomething,
  makeCustomElementsRegistry: makeCustomElementsRegistry
};

},{"./custom-element-widget":107,"es6-map":2}],109:[function(require,module,exports){
"use strict";

var svg = require("virtual-dom/virtual-hyperscript/svg");

var _require = require("./render-dom");

var makeDOMDriver = _require.makeDOMDriver;

var _require2 = require("./render-html");

var makeHTMLDriver = _require2.makeHTMLDriver;

var mockDOMResponse = require("./mock-dom-response");
var h = require("./virtual-hyperscript");

var CycleDOM = {
  /**
   * A factory for the DOM driver function. Takes a `container` to define the
   * target on the existing DOM which this driver will operate on. All custom
   * elements which this driver can detect should be given as the second
   * parameter. The output of this driver is a collection of Observables queried
   * with: `domDriverOutput.select(selector).events(eventType)` returns an
   * Observable of events of `eventType` happening on the element determined by
   * `selector`. Just `domDriverOutput.select(selector).observable` returns
   * an Observable of the DOM element matched by the given selector. Also,
   * `domDriverOutput.select(':root').observable` returns an Observable of
   * DOM element corresponding to the root (or container) of the app on the DOM.
   * The `events()` function also allows you to specify the `useCapture`
   * parameter of event listener. That is, the full function signature is
   * `events(eventType, useCapture)` where `useCapture` is by default `false`.
   *
   * @param {(String|HTMLElement)} container the DOM selector for the element
   * (or the element itself) to contain the rendering of the VTrees.
   * @param {Object} customElements a collection of custom element definitions.
   * The key of each property should be the tag name of the custom element, and
   * the value should be a function defining the implementation of the custom
   * element. This function follows the same contract as the top-most `main`
   * function: input are driver responses, output are requests to drivers.
   * @return {Function} the DOM driver function. The function expects an
   * Observable of VTree as input, and outputs the response object for this
   * driver, containing functions `select()` and `dispose()` that can be used
   * for debugging and testing.
   * @function makeDOMDriver
   */
  makeDOMDriver: makeDOMDriver,

  /**
   * A factory for the HTML driver function. Takes the registry object of all
   * custom elements as the only parameter. The HTML driver function will use
   * the custom element registry to detect custom element on the VTree and apply
   * their implementations.
   *
   * @param {Object} customElements a collection of custom element definitions.
   * The key of each property should be the tag name of the custom element, and
   * the value should be a function defining the implementation of the custom
   * element. This function follows the same contract as the top-most `main`
   * function: input are driver responses, output are requests to drivers.
   * @return {Function} the HTML driver function. The function expects an
   * Observable of Virtual DOM elements as input, and outputs an Observable of
   * strings as the HTML renderization of the virtual DOM elements.
   * @function makeHTMLDriver
   */
  makeHTMLDriver: makeHTMLDriver,

  /**
   * A shortcut to [virtual-hyperscript](
   * https://github.com/Matt-Esch/virtual-dom/tree/master/virtual-hyperscript).
   * This is a helper for creating VTrees in Views.
   * @name h
   */
  h: h,

  /**
   * An adapter around virtual-hyperscript `h()` to allow JSX to be used easily
   * with Babel. Place the [Babel configuration comment](
   * http://babeljs.io/docs/advanced/transformers/other/react/) `@jsx hJSX` at
   * the top of the ES6 file, make sure you import `hJSX` with
   * `import {hJSX} from '@cycle/dom'`, and then you can use JSX to create
   * VTrees.
   * @name hJSX
   */
  hJSX: function hJSX(tag, attrs) {
    for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return h(tag, attrs, children);
  },

  /**
   * A shortcut to the svg hyperscript function.
   * @name svg
   */
  svg: svg,

  /**
   * A testing utility which aids in creating a queryable collection of
   * Observables. Call mockDOMResponse giving it an object specifying selectors,
   * eventTypes and their Observabls, and get as output an object following the
   * same format as the DOM Driver's response. Example:
   *
   * ```js
   * const userEvents = mockDOMResponse({
   *   '.foo': {
   *     'click': Rx.Observable.just({target: {}}),
   *     'mouseover': Rx.Observable.just({target: {}})
   *   },
   *   '.bar': {
   *     'scroll': Rx.Observable.just({target: {}})
   *   }
   * });
   *
   * // Usage
   * const click$ = userEvents.select('.foo').events('click');
   * ```
   *
   * @param {Object} mockedSelectors an object where keys are selector strings
   * and values are objects. Those nested objects have eventType strings as keys
   * and values are Observables you created.
   * @return {Object} fake DOM response object, containin a function `select()`
   * which can be used just like the DOM Driver's response. Call
   * `select(selector).events(eventType)` on the response object to get the
   * Observable you defined in the input of `mockDOMResponse`.
   * @function mockDOMResponse
   */
  mockDOMResponse: mockDOMResponse
};

module.exports = CycleDOM;

},{"./mock-dom-response":111,"./render-dom":112,"./render-html":113,"./virtual-hyperscript":115,"virtual-dom/virtual-hyperscript/svg":93}],110:[function(require,module,exports){
"use strict";

var Rx = require("rx");

var disposableCreate = Rx.Disposable.create;
var CompositeDisposable = Rx.CompositeDisposable;
var AnonymousObservable = Rx.AnonymousObservable;

function createListener(_ref) {
  var element = _ref.element;
  var eventName = _ref.eventName;
  var handler = _ref.handler;
  var useCapture = _ref.useCapture;

  if (element.addEventListener) {
    element.addEventListener(eventName, handler, useCapture);
    return disposableCreate(function removeEventListener() {
      element.removeEventListener(eventName, handler, useCapture);
    });
  }
  throw new Error("No listener found");
}

function createEventListener(_ref2) {
  var element = _ref2.element;
  var eventName = _ref2.eventName;
  var handler = _ref2.handler;
  var useCapture = _ref2.useCapture;

  var disposables = new CompositeDisposable();

  var toStr = Object.prototype.toString;
  if (toStr.call(element) === "[object NodeList]" || toStr.call(element) === "[object HTMLCollection]") {
    for (var i = 0, len = element.length; i < len; i++) {
      disposables.add(createEventListener({
        element: element.item(i),
        eventName: eventName,
        handler: handler,
        useCapture: useCapture }));
    }
  } else if (element) {
    disposables.add(createListener({ element: element, eventName: eventName, handler: handler, useCapture: useCapture }));
  }
  return disposables;
}

function fromEvent(element, eventName) {
  var useCapture = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

  return new AnonymousObservable(function subscribe(observer) {
    return createEventListener({
      element: element,
      eventName: eventName,
      handler: function handler() {
        observer.onNext(arguments[0]);
      },
      useCapture: useCapture });
  }).publish().refCount();
}

module.exports = fromEvent;

},{"rx":undefined}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var emptyStream = _rx2['default'].Observable.empty();

function getEventsStreamForSelector(mockedEventTypes) {
  return function getEventsStream(eventType) {
    for (var key in mockedEventTypes) {
      if (mockedEventTypes.hasOwnProperty(key) && key === eventType) {
        return mockedEventTypes[key];
      }
    }
    return emptyStream;
  };
}

function mockDOMResponse() {
  var mockedSelectors = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  return {
    select: function select(selector) {
      for (var key in mockedSelectors) {
        if (mockedSelectors.hasOwnProperty(key) && key === selector) {
          return {
            observable: emptyStream,
            events: getEventsStreamForSelector(mockedSelectors[key])
          };
        }
      }
      return {
        observable: emptyStream,
        events: function events() {
          return emptyStream;
        }
      };
    }
  };
}

exports['default'] = mockDOMResponse;
module.exports = exports['default'];

},{"rx":undefined}],112:[function(require,module,exports){
"use strict";

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var Rx = require("rx");
var fromEvent = require("./fromevent");
var VDOM = {
  h: require("./virtual-hyperscript"),
  diff: require("virtual-dom/diff"),
  patch: require("virtual-dom/patch"),
  parse: typeof window !== "undefined" ? require("vdom-parser") : function () {}
};

var _require = require("./custom-elements");

var replaceCustomElementsWithSomething = _require.replaceCustomElementsWithSomething;
var makeCustomElementsRegistry = _require.makeCustomElementsRegistry;

var _require2 = require("./transposition");

var transposeVTree = _require2.transposeVTree;

var matchesSelector = undefined;
// Try-catch to prevent unnecessary import of DOM-specifics in Node.js env:
try {
  matchesSelector = require("matches-selector");
} catch (err) {
  matchesSelector = function () {};
}

function isElement(obj) {
  return typeof HTMLElement === "object" ? obj instanceof HTMLElement || obj instanceof DocumentFragment : //DOM2
  obj && typeof obj === "object" && obj !== null && (obj.nodeType === 1 || obj.nodeType === 11) && typeof obj.nodeName === "string";
}

function fixRootElem$(rawRootElem$, domContainer) {
  // Create rootElem stream and automatic className correction
  var originalClasses = (domContainer.className || domContainer.className.baseVal || "").trim().split(/\s+/);
  var originalId = domContainer.id;
  //console.log('%coriginalClasses: ' + originalClasses, 'color: lightgray')
  return rawRootElem$.map(function fixRootElemClassNameAndId(rootElem) {
    var fixedRootClassName = null;
    var svg = false;
    if (typeof rootElem.className === "string") {
      fixedRootClassName = rootElem.className;
    } else if (typeof rootElem.className.baseVal === "string") {
      fixedRootClassName = rootElem.className.baseVal;
      svg = true;
    }
    var previousClasses = fixedRootClassName.trim().split(/\s+/);
    var missingClasses = originalClasses.filter(function (clss) {
      return previousClasses.indexOf(clss) < 0;
    });
    var classes = previousClasses.length > 0 ? previousClasses.concat(missingClasses) : missingClasses;
    //console.log('%cfixRootElemClassName(), missingClasses: ' +
    //  missingClasses, 'color: lightgray')
    if (svg) {
      rootElem.className.baseVal = classes.join(" ").trim();
    } else {
      rootElem.className = classes.join(" ").trim();
    }
    if (originalId) {
      rootElem.id = originalId;
    }
    //console.log('%c  result: ' + fixedRootClassName, 'color: lightgray')
    //console.log('%cEmit rootElem$ ' + rootElem.tagName + '.' +
    //  fixedRootClassName, 'color: #009988')
    return rootElem;
  });
}

function isVTreeCustomElement(vtree) {
  return vtree.type === "Widget" && vtree.isCustomElementWidget;
}

function makeReplaceCustomElementsWithWidgets(CERegistry, driverName) {
  return function replaceCustomElementsWithWidgets(vtree) {
    return replaceCustomElementsWithSomething(vtree, CERegistry, function (_vtree, WidgetClass) {
      return new WidgetClass(_vtree, CERegistry, driverName);
    });
  };
}

function getArrayOfAllWidgetFirstRootElem$(vtree) {
  if (vtree.type === "Widget" && vtree.firstRootElem$) {
    return [vtree.firstRootElem$];
  }
  // Or replace children recursively
  var array = [];
  if (Array.isArray(vtree.children)) {
    for (var i = vtree.children.length - 1; i >= 0; i--) {
      array = array.concat(getArrayOfAllWidgetFirstRootElem$(vtree.children[i]));
    }
  }
  return array;
}

function checkRootVTreeNotCustomElement(vtree) {
  if (isVTreeCustomElement(vtree)) {
    throw new Error("Illegal to use a Cycle custom element as the root of " + "a View.");
  }
}

function isRootForCustomElement(rootElem) {
  return !!rootElem.cycleCustomElementMetadata;
}

function wrapTopLevelVTree(vtree, rootElem) {
  if (isRootForCustomElement(rootElem)) {
    return vtree;
  }

  var _vtree$properties$id = vtree.properties.id;
  var vtreeId = _vtree$properties$id === undefined ? "" : _vtree$properties$id;
  var _vtree$properties$className = vtree.properties.className;
  var vtreeClass = _vtree$properties$className === undefined ? "" : _vtree$properties$className;

  var sameId = vtreeId === rootElem.id;
  var sameClass = vtreeClass === rootElem.className;
  var sameTagName = vtree.tagName.toUpperCase() === rootElem.tagName;
  if (sameId && sameClass && sameTagName) {
    return vtree;
  }
  var attrs = {};
  if (rootElem.id) {
    attrs.id = rootElem.id;
  }
  if (rootElem.className) {
    attrs.className = rootElem.className;
  }
  return VDOM.h(rootElem.tagName, attrs, [vtree]);
}

function makeDiffAndPatchToElement$(rootElem) {
  return function diffAndPatchToElement$(_ref) {
    var _ref2 = _slicedToArray(_ref, 2);

    var oldVTree = _ref2[0];
    var newVTree = _ref2[1];

    if (typeof newVTree === "undefined") {
      return Rx.Observable.empty();
    }

    //let isCustomElement = isRootForCustomElement(rootElem)
    //let k = isCustomElement ? ' is custom element ' : ' is top level'
    var prevVTree = wrapTopLevelVTree(oldVTree, rootElem);
    var nextVTree = wrapTopLevelVTree(newVTree, rootElem);
    var waitForChildrenStreams = getArrayOfAllWidgetFirstRootElem$(nextVTree);
    var rootElemAfterChildrenFirstRootElem$ = Rx.Observable.combineLatest(waitForChildrenStreams, function () {
      //console.log('%crawRootElem$ emits. (1)' + k, 'color: #008800')
      return rootElem;
    });
    var cycleCustomElementMetadata = rootElem.cycleCustomElementMetadata;
    //console.log('%cVDOM diff and patch START' + k, 'color: #636300')
    /* eslint-disable */
    rootElem = VDOM.patch(rootElem, VDOM.diff(prevVTree, nextVTree));
    /* eslint-enable */
    //console.log('%cVDOM diff and patch END' + k, 'color: #636300')
    if (cycleCustomElementMetadata) {
      rootElem.cycleCustomElementMetadata = cycleCustomElementMetadata;
    }
    if (waitForChildrenStreams.length === 0) {
      //console.log('%crawRootElem$ emits. (2)' + k, 'color: #008800')
      return Rx.Observable.just(rootElem);
    }
    //console.log('%crawRootElem$ waiting children.' + k, 'color: #008800')
    return rootElemAfterChildrenFirstRootElem$;
  };
}

function renderRawRootElem$(vtree$, domContainer, _ref3) {
  var CERegistry = _ref3.CERegistry;
  var driverName = _ref3.driverName;

  var diffAndPatchToElement$ = makeDiffAndPatchToElement$(domContainer);
  return vtree$.flatMapLatest(transposeVTree).startWith(VDOM.parse(domContainer)).map(makeReplaceCustomElementsWithWidgets(CERegistry, driverName)).doOnNext(checkRootVTreeNotCustomElement).pairwise().flatMap(diffAndPatchToElement$);
}

function makeEventsSelector(element$) {
  return function events(eventName) {
    var useCapture = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

    if (typeof eventName !== "string") {
      throw new Error("DOM driver's get() expects second argument to be a " + "string representing the event type to listen for.");
    }
    return element$.flatMapLatest(function (element) {
      if (!element) {
        return Rx.Observable.empty();
      }
      return fromEvent(element, eventName, useCapture);
    }).share();
  };
}

function makeElementSelector(rootElem$) {
  return function select(selector) {
    if (typeof selector !== "string") {
      throw new Error("DOM driver's select() expects first argument to be a " + "string as a CSS selector");
    }
    var element$ = selector.trim() === ":root" ? rootElem$ : rootElem$.map(function (rootElem) {
      if (matchesSelector(rootElem, selector)) {
        return rootElem;
      } else {
        return rootElem.querySelectorAll(selector);
      }
    });
    return {
      observable: element$,
      events: makeEventsSelector(element$)
    };
  };
}

function validateDOMDriverInput(vtree$) {
  if (!vtree$ || typeof vtree$.subscribe !== "function") {
    throw new Error("The DOM driver function expects as input an " + "Observable of virtual DOM elements");
  }
}

function makeDOMDriverWithRegistry(container, CERegistry) {
  return function domDriver(vtree$, driverName) {
    validateDOMDriverInput(vtree$);
    var rawRootElem$ = renderRawRootElem$(vtree$, container, { CERegistry: CERegistry, driverName: driverName });
    if (!isRootForCustomElement(container)) {
      rawRootElem$ = rawRootElem$.startWith(container);
    }
    var rootElem$ = fixRootElem$(rawRootElem$, container).replay(null, 1);
    var disposable = rootElem$.connect();
    return {
      select: makeElementSelector(rootElem$),
      dispose: disposable.dispose.bind(disposable)
    };
  };
}

function makeDOMDriver(container) {
  var customElementDefinitions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  // Find and prepare the container
  var domContainer = typeof container === "string" ? document.querySelector(container) : container;
  // Check pre-conditions
  if (typeof container === "string" && domContainer === null) {
    throw new Error("Cannot render into unknown element `" + container + "`");
  } else if (!isElement(domContainer)) {
    throw new Error("Given container is not a DOM element neither a selector " + "string.");
  }

  var registry = makeCustomElementsRegistry(customElementDefinitions);
  return makeDOMDriverWithRegistry(domContainer, registry);
}

module.exports = {
  isElement: isElement,
  fixRootElem$: fixRootElem$,
  isVTreeCustomElement: isVTreeCustomElement,
  makeReplaceCustomElementsWithWidgets: makeReplaceCustomElementsWithWidgets,
  getArrayOfAllWidgetFirstRootElem$: getArrayOfAllWidgetFirstRootElem$,
  isRootForCustomElement: isRootForCustomElement,
  wrapTopLevelVTree: wrapTopLevelVTree,
  checkRootVTreeNotCustomElement: checkRootVTreeNotCustomElement,
  makeDiffAndPatchToElement$: makeDiffAndPatchToElement$,
  renderRawRootElem$: renderRawRootElem$,
  validateDOMDriverInput: validateDOMDriverInput,
  makeDOMDriverWithRegistry: makeDOMDriverWithRegistry,

  makeDOMDriver: makeDOMDriver
};

},{"./custom-elements":108,"./fromevent":110,"./transposition":114,"./virtual-hyperscript":115,"matches-selector":57,"rx":undefined,"vdom-parser":58,"virtual-dom/diff":73,"virtual-dom/patch":80}],113:[function(require,module,exports){
"use strict";

var Rx = require("rx");
var toHTML = require("vdom-to-html");

var _require = require("./custom-elements");

var replaceCustomElementsWithSomething = _require.replaceCustomElementsWithSomething;
var makeCustomElementsRegistry = _require.makeCustomElementsRegistry;

var _require2 = require("./custom-element-widget");

var makeCustomElementInput = _require2.makeCustomElementInput;
var ALL_PROPS = _require2.ALL_PROPS;

var _require3 = require("./transposition");

var transposeVTree = _require3.transposeVTree;

function makePropertiesDriverFromVTree(vtree) {
  return {
    get: function get(propertyName) {
      if (propertyName === ALL_PROPS) {
        return Rx.Observable.just(vtree.properties);
      } else {
        return Rx.Observable.just(vtree.properties[propertyName]);
      }
    }
  };
}

function makeReplaceCustomElementsWithVTree$(CERegistry, driverName) {
  return function replaceCustomElementsWithVTree$(vtree) {
    return replaceCustomElementsWithSomething(vtree, CERegistry, function toVTree$(_vtree, WidgetClass) {
      var interactions = { get: function get() {
          return Rx.Observable.empty();
        } };
      var props = makePropertiesDriverFromVTree(_vtree);
      var input = makeCustomElementInput(interactions, props);
      var output = WidgetClass.definitionFn(input);
      var vtree$ = output[driverName].last();
      /*eslint-disable no-use-before-define */
      return convertCustomElementsToVTree(vtree$, CERegistry, driverName);
      /*eslint-enable no-use-before-define */
    });
  };
}

function convertCustomElementsToVTree(vtree$, CERegistry, driverName) {
  return vtree$.map(makeReplaceCustomElementsWithVTree$(CERegistry, driverName)).flatMap(transposeVTree);
}

function makeResponseGetter() {
  return function get(selector) {
    if (console && console.log) {
      console.log("WARNING: HTML Driver's get(selector) is deprecated.");
    }
    if (selector === ":root") {
      return this;
    } else {
      return Rx.Observable.empty();
    }
  };
}

function makeBogusSelect() {
  return function select() {
    return {
      observable: Rx.Observable.empty(),
      events: function events() {
        return Rx.Observable.empty();
      }
    };
  };
}

function makeHTMLDriver() {
  var customElementDefinitions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var registry = makeCustomElementsRegistry(customElementDefinitions);
  return function htmlDriver(vtree$, driverName) {
    var vtreeLast$ = vtree$.last();
    var output$ = convertCustomElementsToVTree(vtreeLast$, registry, driverName).map(function (vtree) {
      return toHTML(vtree);
    });
    output$.get = makeResponseGetter();
    output$.select = makeBogusSelect();
    return output$;
  };
}

module.exports = {
  makePropertiesDriverFromVTree: makePropertiesDriverFromVTree,
  makeReplaceCustomElementsWithVTree$: makeReplaceCustomElementsWithVTree$,
  convertCustomElementsToVTree: convertCustomElementsToVTree,

  makeHTMLDriver: makeHTMLDriver
};

},{"./custom-element-widget":107,"./custom-elements":108,"./transposition":114,"rx":undefined,"vdom-to-html":62}],114:[function(require,module,exports){
"use strict";

var Rx = require("rx");
var VirtualNode = require("virtual-dom/vnode/vnode");

/**
 * Converts a tree of VirtualNode|Observable<VirtualNode> into
 * Observable<VirtualNode>.
 */
function transposeVTree(vtree) {
  if (typeof vtree.subscribe === "function") {
    return vtree.flatMap(transposeVTree);
  } else if (vtree.type === "VirtualText") {
    return Rx.Observable.just(vtree);
  } else if (vtree.type === "VirtualNode" && Array.isArray(vtree.children) && vtree.children.length > 0) {
    return Rx.Observable.combineLatest(vtree.children.map(transposeVTree), function () {
      for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
        arr[_key] = arguments[_key];
      }

      return new VirtualNode(vtree.tagName, vtree.properties, arr, vtree.key, vtree.namespace);
    });
  } else if (vtree.type === "VirtualNode" || vtree.type === "Widget") {
    return Rx.Observable.just(vtree);
  } else {
    throw new Error("Unhandled case in transposeVTree()");
  }
}

module.exports = {
  transposeVTree: transposeVTree
};

},{"rx":undefined,"virtual-dom/vnode/vnode":101}],115:[function(require,module,exports){
/* eslint-disable */
'use strict';

var isArray = require('x-is-array');

var VNode = require('virtual-dom/vnode/vnode.js');
var VText = require('virtual-dom/vnode/vtext.js');
var isVNode = require('virtual-dom/vnode/is-vnode');
var isVText = require('virtual-dom/vnode/is-vtext');
var isWidget = require('virtual-dom/vnode/is-widget');
var isHook = require('virtual-dom/vnode/is-vhook');
var isVThunk = require('virtual-dom/vnode/is-thunk');

var parseTag = require('virtual-dom/virtual-hyperscript/parse-tag.js');
var softSetHook = require('virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js');
var evHook = require('virtual-dom/virtual-hyperscript/hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
  var childNodes = [];
  var tag, props, key, namespace;

  if (!children && isChildren(properties)) {
    children = properties;
    props = {};
  }

  props = props || properties || {};
  tag = parseTag(tagName, props);

  // support keys
  if (props.hasOwnProperty('key')) {
    key = props.key;
    props.key = undefined;
  }

  // support namespace
  if (props.hasOwnProperty('namespace')) {
    namespace = props.namespace;
    props.namespace = undefined;
  }

  // fix cursor bug
  if (tag === 'INPUT' && !namespace && props.hasOwnProperty('value') && props.value !== undefined && !isHook(props.value)) {
    props.value = softSetHook(props.value);
  }

  transformProperties(props);

  if (children !== undefined && children !== null) {
    addChild(children, childNodes, tag, props);
  }

  return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
  if (typeof c === 'string') {
    childNodes.push(new VText(c));
  } else if (typeof c === 'number') {
    childNodes.push(new VText(String(c)));
  } else if (isChild(c)) {
    childNodes.push(c);
  } else if (isArray(c)) {
    for (var i = 0; i < c.length; i++) {
      addChild(c[i], childNodes, tag, props);
    }
  } else if (c === null || c === undefined) {
    return;
  } else {
    throw UnexpectedVirtualElement({
      foreignObject: c,
      parentVnode: {
        tagName: tag,
        properties: props
      }
    });
  }
}

function transformProperties(props) {
  for (var propName in props) {
    if (props.hasOwnProperty(propName)) {
      var value = props[propName];

      if (isHook(value)) {
        continue;
      }

      if (propName.substr(0, 3) === 'ev-') {
        // add ev-foo support
        props[propName] = evHook(value);
      }
    }
  }
}

// START Cycle.js-specific code >>>>>>>>
function isObservable(x) {
  return x && typeof x.subscribe === 'function';
}

function isChild(x) {
  return isVNode(x) || isVText(x) || isObservable(x) || isWidget(x) || isVThunk(x);
}
// END Cycle.js-specific code <<<<<<<<<<

function isChildren(x) {
  return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
  var err = new Error();

  err.type = 'virtual-hyperscript.unexpected.virtual-element';
  err.message = 'Unexpected virtual child passed to h().\n' + 'Expected a VNode / Vthunk / VWidget / string but:\n' + 'got:\n' + errorString(data.foreignObject) + '.\n' + 'The parent vnode is:\n' + errorString(data.parentVnode);
  '\n' + 'Suggested fix: change your `h(..., [ ... ])` callsite.';
  err.foreignObject = data.foreignObject;
  err.parentVnode = data.parentVnode;

  return err;
}

function errorString(obj) {
  try {
    return JSON.stringify(obj, null, '    ');
  } catch (e) {
    return String(obj);
  }
}
/* eslint-enable */

},{"virtual-dom/virtual-hyperscript/hooks/ev-hook.js":88,"virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js":89,"virtual-dom/virtual-hyperscript/parse-tag.js":91,"virtual-dom/vnode/is-thunk":95,"virtual-dom/vnode/is-vhook":96,"virtual-dom/vnode/is-vnode":97,"virtual-dom/vnode/is-vtext":98,"virtual-dom/vnode/is-widget":99,"virtual-dom/vnode/vnode.js":101,"virtual-dom/vnode/vtext.js":103,"x-is-array":106}]},{},[109])(109)
});