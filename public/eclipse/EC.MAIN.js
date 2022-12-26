/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./eclipse/main.js":
/*!*************************!*\
  !*** ./eclipse/main.js ***!
  \*************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\nclass Eclipse {\n  constructor(config = {}) {\n    this.bare = config.bare || \"/bare/\"\n    this.prefix = config.prefix || \"/service/\"\n    navigator.serviceWorker.register(location.origin + '/eclipse/EC.SW.js' + '?config=' + encodeURIComponent(JSON.stringify({bare: this.bare, prefix: \"/eclipse\" + this.prefix})),{scope: \"/eclipse\" + this.prefix})\n  }\n  url = function(url) {\n    if (url) {\n      return window.location.origin + \"/eclipse\" + this.prefix + url;\n      } else {\n      return \"\";\n    }\n  }\n  search = function(url, engine) {\n    if (url && engine) {\n      if (!engine.includes(\"%s\")) {\n        return console.error(\"Search engine must include %s in place of query\")\n      } else {\n          if (url.match(/^https?:\\/\\//)) {\n          return url;\n          } else if (url.includes('.') && !url.includes(\" \")) {\n          return \"https://\" + url;\n          } else {\n          return engine.replace(\"%s\", url)\n          }          \n      }\n    }\n  }\n}\n\nwindow.Eclipse = Eclipse\n\n//# sourceURL=webpack://eclipse/./eclipse/main.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./eclipse/main.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;