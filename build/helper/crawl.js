"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractData = void 0;

var _cheerio = _interopRequireDefault(require("cheerio"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var extractData = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var html, $, data;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _axios["default"].get("https://giacaphe.com/");

          case 2:
            html = _context.sent;
            _context.next = 5;
            return _cheerio["default"].load(html.data);

          case 5:
            $ = _context.sent;
            data = [];
            $("#gianoidia").each(function (i, elem) {
              $(elem).find("tr").each(function (i, item) {
                if (i > 0) {
                  var std = $(item).find("td");
                  data.push({
                    name: std.eq(0).text().trim(),
                    price: std.eq(1).text().trim(),
                    change: std.eq(2).text().trim()
                  });
                }
              });
            });
            return _context.abrupt("return", data);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function extractData() {
    return _ref.apply(this, arguments);
  };
}();

exports.extractData = extractData;