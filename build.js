/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = __webpack_require__(1);
var nativeMethods = __webpack_require__(2);
var appname = __wxConfig__.appname;
var serviceFrame = utils_1.createFrame('service', appname + "/appservice", true);
Object.defineProperty(serviceFrame.contentWindow, 'prompt', {
    get: function get() {
        return function (str) {
            if (str.indexOf('____sdk____') !== 0) {
                return console.warn("Invalid prompt " + str);
            }
            var obj = JSON.parse(str.replace(/^____sdk____/, ''));
            var method = obj.sdkName;
            if (nativeMethods.hasOwnProperty(method)) {
                return JSON.stringify(nativeMethods[method](obj));
            }
            console.warn(method + " not found on native.js");
        };
    }
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function createFrame(id, src, hidden) {
    var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;

    var el = document.createElement('iframe');
    el.setAttribute('src', src);
    el.setAttribute('id', id);
    el.setAttribute('name', id);
    el.setAttribute('seamless', 'seamless');
    el.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    el.setAttribute('frameborder', '0');
    el.setAttribute('width', hidden ? '0' : '100%');
    el.setAttribute('height', hidden ? '0' : '100%');
    if (hidden) {
        el.setAttribute('style', 'width:0;height:0;border:0; display:none;');
    }
    parent.appendChild(el);
    return el;
}
exports.createFrame = createFrame;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var merge = __webpack_require__(3);
function toResult(msg, data, command) {
    var obj = {
        msg: msg,
        ext: data
    };
    if (command) obj.command = command;
    return obj;
}
function toError(data) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var name = data.sdkName;
    var obj = merge.recursive(true, {
        errMsg: name + ":fail"
    }, extra);
    return toResult(obj, data, result ? 'GET_ASSDK_RES' : null);
}
function toSuccess(data) {
    var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var name = data.sdkName;
    var obj = merge.recursive(true, {
        errMsg: name + ":ok"
    }, extra);
    return toResult(obj, data, result ? 'GET_ASSDK_RES' : null);
}
function systemInfo() {
    return {
        model: /iPhone/.test(navigator.userAgent) ? 'iPhone6' : 'Android',
        pixelRatio: window.devicePixelRatio || 1,
        windowWidth: window.innerWidth || 0,
        windowHeight: window.innerHeight || 0,
        language: window.navigator.language,
        platform: 'wept',
        version: '6.3.9'
    };
}
function getSystemInfoSync(data) {
    var info = systemInfo();
    return toSuccess(data, true, info);
}
exports.getSystemInfoSync = getSystemInfoSync;
function getSystemInfo(data) {
    var info = systemInfo();
    return toSuccess(data, true, info);
}
exports.getSystemInfo = getSystemInfo;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/*!
 * @name JavaScript/NodeJS Merge v1.2.0
 * @author yeikos
 * @repository https://github.com/yeikos/js.merge

 * Copyright 2014 yeikos - MIT license
 * https://raw.github.com/yeikos/js.merge/master/LICENSE
 */

;(function(isNode) {

	/**
	 * Merge one or more objects 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	var Public = function(clone) {

		return merge(clone === true, false, arguments);

	}, publicName = 'merge';

	/**
	 * Merge two or more objects recursively 
	 * @param bool? clone
	 * @param mixed,... arguments
	 * @return object
	 */

	Public.recursive = function(clone) {

		return merge(clone === true, true, arguments);

	};

	/**
	 * Clone the input removing any reference
	 * @param mixed input
	 * @return mixed
	 */

	Public.clone = function(input) {

		var output = input,
			type = typeOf(input),
			index, size;

		if (type === 'array') {

			output = [];
			size = input.length;

			for (index=0;index<size;++index)

				output[index] = Public.clone(input[index]);

		} else if (type === 'object') {

			output = {};

			for (index in input)

				output[index] = Public.clone(input[index]);

		}

		return output;

	};

	/**
	 * Merge two objects recursively
	 * @param mixed input
	 * @param mixed extend
	 * @return mixed
	 */

	function merge_recursive(base, extend) {

		if (typeOf(base) !== 'object')

			return extend;

		for (var key in extend) {

			if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

				base[key] = merge_recursive(base[key], extend[key]);

			} else {

				base[key] = extend[key];

			}

		}

		return base;

	}

	/**
	 * Merge two or more objects
	 * @param bool clone
	 * @param bool recursive
	 * @param array argv
	 * @return object
	 */

	function merge(clone, recursive, argv) {

		var result = argv[0],
			size = argv.length;

		if (clone || typeOf(result) !== 'object')

			result = {};

		for (var index=0;index<size;++index) {

			var item = argv[index],

				type = typeOf(item);

			if (type !== 'object') continue;

			for (var key in item) {

				var sitem = clone ? Public.clone(item[key]) : item[key];

				if (recursive) {

					result[key] = merge_recursive(result[key], sitem);

				} else {

					result[key] = sitem;

				}

			}

		}

		return result;

	}

	/**
	 * Get type of variable
	 * @param mixed input
	 * @return string
	 *
	 * @see http://jsperf.com/typeofvar
	 */

	function typeOf(input) {

		return ({}).toString.call(input).slice(8, -1).toLowerCase();

	}

	if (isNode) {

		module.exports = Public;

	} else {

		window[publicName] = Public;

	}

})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)(module)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ })
/******/ ]);