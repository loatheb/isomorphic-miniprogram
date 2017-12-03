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
var utils_1 = __webpack_require__(2);
var nativeMethods = __webpack_require__(3);
__webpack_require__(6);
__webpack_require__(7);
var appname = __wxConfig__.appname;
var serviceFrame = utils_1.createFrame('service', "/" + appname + "/appservice", true);
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


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 2 */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var merge = __webpack_require__(4);
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
/* 4 */
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
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ }),
/* 5 */
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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var command = __webpack_require__(8);
window.addEventListener('message', function (_ref) {
    var _ref$data = _ref.data,
        data = _ref$data === undefined ? {} : _ref$data;
    var cmd = data.cmd,
        msg = data.msg;

    if (data.to == null || data.to === 'contentscript' || /^devtools/.test(data.to)) return;
    if (cmd === 'EXEC_JSSDK') {
        return;
    }
    if (cmd === 'TO_APP_SERVICE') {
        delete data.command;
        return;
    }
    if (cmd === 'COMMAND_FROM_ASJS') {
        var sdkName = data.sdkName;

        if (command.hasOwnProperty(sdkName)) {
            return command[sdkName](data);
        }
        return console.warn("Method " + sdkName + " not implemented for command!");
    }
    if (cmd === 'PULLDOWN_REFRESH') {
        return command['PULLDOWN_REFRESH'](data);
    }
    if (cmd === 'WEBVIEW_READY') {
        // TODO figure out WTF is this
        return;
    }
    console.warn("Command " + cmd + " not recognized!");
});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var Emitter = __webpack_require__(1);
exports.event = new Emitter();
exports.event.once('APP_SERVICE_COMPLETE', function () {
    console.log('APP_SERVICE_COMPLETE');
    window.postMessage({
        to: 'devtools',
        sdkName: 'APP_SERVICE_COMPLETE'
    }, '*');
});

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var listener_1 = __webpack_require__(7);
var viewManage = __webpack_require__(9);
function getRoutes() {
    var root = __root__;
    var path = location.hash.replace(/^#!/, '');
    if (sessionStorage == null) return path ? [path] : [root];
    var str = sessionStorage.getItem('routes');
    if (!str) return path ? [path] : [root];
    var routes = str.split('|');
    if (routes.indexOf(path) !== routes.length - 1) {
        return path ? [path] : [root];
    }
    return routes;
}
function APP_SERVICE_COMPLETE(data) {
    listener_1.event.emit('APP_SERVICE_COMPLETE');
    var routes = getRoutes();
    var firstPage = routes.shift();
    viewManage.navigateTo(firstPage);
}
exports.APP_SERVICE_COMPLETE = APP_SERVICE_COMPLETE;
function getPublicLibVersion() {}
exports.getPublicLibVersion = getPublicLibVersion;
function systemLog() {}
exports.systemLog = systemLog;
function showShareMenu() {}
exports.showShareMenu = showShareMenu;
function switchTab(data) {}
exports.switchTab = switchTab;
function shareAppMessage(data) {}
exports.shareAppMessage = shareAppMessage;
function requestPayment(data) {}
exports.requestPayment = requestPayment;
function previewImage(data) {}
exports.previewImage = previewImage;
function stopPullDownRefresh(data) {}
exports.stopPullDownRefresh = stopPullDownRefresh;
function publish(data) {}
exports.publish = publish;
function scanCode(data) {}
exports.scanCode = scanCode;
function redirectTo(data) {}
exports.redirectTo = redirectTo;
function navigateTo(data) {}
exports.navigateTo = navigateTo;
function navigateBack(data) {}
exports.navigateBack = navigateBack;
function PULLDOWN_REFRESH(data) {}
exports.PULLDOWN_REFRESH = PULLDOWN_REFRESH;
function WEBVIEW_READY(data) {}
exports.WEBVIEW_READY = WEBVIEW_READY;
function GET_APP_DATA(data) {}
exports.GET_APP_DATA = GET_APP_DATA;
function WRITE_APP_DATA(data) {}
exports.WRITE_APP_DATA = WRITE_APP_DATA;
function GET_APP_STORAGE(data) {}
exports.GET_APP_STORAGE = GET_APP_STORAGE;
function DELETE_APP_STORAGE(data) {}
exports.DELETE_APP_STORAGE = DELETE_APP_STORAGE;
function SET_APP_STORAGE(data) {}
exports.SET_APP_STORAGE = SET_APP_STORAGE;
function send_app_data(data) {}
exports.send_app_data = send_app_data;
function setNavigationBarTitle(data) {}
exports.setNavigationBarTitle = setNavigationBarTitle;
function showNavigationBarLoading() {}
exports.showNavigationBarLoading = showNavigationBarLoading;
function hideNavigationBarLoading() {}
exports.hideNavigationBarLoading = hideNavigationBarLoading;
function chooseImage(data) {}
exports.chooseImage = chooseImage;
function chooseVideo(data) {}
exports.chooseVideo = chooseVideo;
function saveFile(data) {}
exports.saveFile = saveFile;
function enableCompass() {}
exports.enableCompass = enableCompass;
function enableAccelerometer() {}
exports.enableAccelerometer = enableAccelerometer;
function getNetworkType(data) {}
exports.getNetworkType = getNetworkType;
function getLocation(data) {}
exports.getLocation = getLocation;
function openLocation(data) {}
exports.openLocation = openLocation;
function chooseLocation(data) {}
exports.chooseLocation = chooseLocation;
function setStorage(data) {}
exports.setStorage = setStorage;
function getStorage(data) {}
exports.getStorage = getStorage;
function clearStorage(data) {}
exports.clearStorage = clearStorage;
function startRecord(data) {}
exports.startRecord = startRecord;
function stopRecord() {}
exports.stopRecord = stopRecord;
function playVoice(data) {}
exports.playVoice = playVoice;
function pauseVoice() {}
exports.pauseVoice = pauseVoice;
function stopVoice() {}
exports.stopVoice = stopVoice;
function getMusicPlayerState(data) {}
exports.getMusicPlayerState = getMusicPlayerState;
function operateMusicPlayer(data) {}
exports.operateMusicPlayer = operateMusicPlayer;
function uploadFile(data) {}
exports.uploadFile = uploadFile;
function downloadFile(data) {}
exports.downloadFile = downloadFile;
function getSavedFileList(data) {}
exports.getSavedFileList = getSavedFileList;
function removeSavedFile(data) {}
exports.removeSavedFile = removeSavedFile;
function getSavedFileInfo(data) {}
exports.getSavedFileInfo = getSavedFileInfo;
function openDocument(data) {}
exports.openDocument = openDocument;
function getStorageInfo(data) {}
exports.getStorageInfo = getStorageInfo;
function removeStorage(data) {}
exports.removeStorage = removeStorage;
function showToast(data) {}
exports.showToast = showToast;
function hideToast(data) {}
exports.hideToast = hideToast;
function showModal(data) {}
exports.showModal = showModal;
function showActionSheet(data) {}
exports.showActionSheet = showActionSheet;
function getImageInfo(data) {}
exports.getImageInfo = getImageInfo;
function base64ToTempFilePath(data) {}
exports.base64ToTempFilePath = base64ToTempFilePath;
function refreshSession(data) {}
exports.refreshSession = refreshSession;
function showPickerView(data, args) {}
exports.showPickerView = showPickerView;
function showDatePickerView(data, args) {}
exports.showDatePickerView = showDatePickerView;
function requiredArgs(keys, data) {}
function onError(data, message) {}
function onSuccess(data) {
    var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
}
function onCancel(data) {
    var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
}
function publishPagEevent(eventName, extra) {}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
function onRoute() {
    util.redirectTo(curr.url);
    Bus.emit('route', getViewIds().length, curr);
    var arr = [];
    var view = curr;
    while (view) {
        arr.push(view.url);
        if (view.pid != null) {
            view = getViewById(view.pid);
        } else {
            view = null;
        }
    }
    var str = arr.reverse().join('|');
    sessionStorage.setItem('routes', str);
}
function navigateTo(path) {
    path = normalize(path);
    var exists = tabViews[path];
    if (curr) curr.hide();
    if (exists) {
        curr = exists;
        exists.show();
    } else {
        var isTabView = util.isTabbar(path);
        var pid = curr ? curr.id : null;
        var v = curr = new View(path);
        curr.pid = isTabView ? null : pid;
        views[v.id] = v;
        if (isTabView) tabViews[path] = curr;
    }
    onRoute();
}
exports.navigateTo = navigateTo;

/***/ })
/******/ ]);