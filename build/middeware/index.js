"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCacheServer = exports.clearCache = exports.isExistCache = exports.getCache = exports.setCache = void 0;

var _cache = _interopRequireDefault(require("../helper/cache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var setCache = function setCache(key, object) {
  return _cache["default"].set(key, JSON.stringify(object));
};

exports.setCache = setCache;

var getCache = function getCache(key) {
  var data = _cache["default"].get(key);

  if (data !== undefined) {
    return JSON.parse(data);
  }

  return undefined;
};

exports.getCache = getCache;

var isExistCache = function isExistCache(key) {
  return _cache["default"].has(key);
};

exports.isExistCache = isExistCache;

var clearCache = function clearCache(key) {
  return _cache["default"].del(key);
};

exports.clearCache = clearCache;

var getCacheServer = function getCacheServer(req, res, next) {
  if (isExistCache("price")) {
    return res.json(getCache("price"));
  }

  next();
};

exports.getCacheServer = getCacheServer;