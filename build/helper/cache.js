"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodeCache = _interopRequireDefault(require("node-cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CachService = new _nodeCache["default"]({
  stdTTL: 100,
  checkperiod: 120
});
var _default = CachService;
exports["default"] = _default;