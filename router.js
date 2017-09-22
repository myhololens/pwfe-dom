/**
 * Created by chkui on 2017/5/11.
 * 通用路由工具组件
 */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = exports.StaticRouter = exports.Redirect = exports.history = exports.reRouteMatch = exports.reRoute = exports.withRouter = exports.Link = exports.Route = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _util = require('./util');

var _env = require('./env');

var _createBrowserHistory = require('history/createBrowserHistory');

var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

var _createHashHistory = require('history/createHashHistory');

var _createHashHistory2 = _interopRequireDefault(_createHashHistory);

var _match = require('./lib/match');

var _match2 = _interopRequireDefault(_match);

var _reactRouterDom = require('react-router-dom');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//路由
var history = !(0, _util.isServerEvn)() && ((0, _env.getHisType)() === _env.HistoryType.Browser ? (0, _createBrowserHistory2.default)() : (0, _createHashHistory2.default)());

/**
 * 服务器控制类
 * @type {{local: ((p1:*)), forward: ((p1?:*)), back: (())}}
 */
var browser = {
    /**
     * 服务器跳转，使用该方法会导致服务器重加载并重新渲染页面。//TODO 暂时未实现
     * @param url 要跳转的地址
     */
    local: function local(url) {
        window.location.href = url;
    },
    /**
     * 浏览器向前跳转，使用该方法时不会发生服务器请求，只会发生react组件替换。
     * 1）若不传入url参数，则浏览器会发生前进一页的行为
     * 2）若传入url参数，浏览器会自行跳转到对应url
     * @param url
     */
    forward: function forward(url) {
        url ? history.push(url) : history.goForward();
    },
    /**
     * 浏览器回滚，不会发生服务器请求
     */
    back: function back() {
        history.goBack();
    }
};

/**
 * 浏览器重定向高阶组件，用于重定向跳转。
 * 使用该组件时请注意数据突变的问题。
 * 1）被包裹的组件可以通过 props.browser 获取 browser对象。
 * @returns {function(*=)}
 */
var reRoute = function reRoute() {
    return function (Wrap) {
        var NextWrapper = function (_React$Component) {
            _inherits(NextWrapper, _React$Component);

            function NextWrapper() {
                var _ref;

                _classCallCheck(this, NextWrapper);

                for (var _len = arguments.length, props = Array(_len), _key = 0; _key < _len; _key++) {
                    props[_key] = arguments[_key];
                }

                return _possibleConstructorReturn(this, (_ref = NextWrapper.__proto__ || Object.getPrototypeOf(NextWrapper)).call.apply(_ref, [this].concat(props)));
            }

            _createClass(NextWrapper, [{
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps, nextState) {
                    return this.props !== nextProps;
                }
            }, {
                key: 'render',
                value: function render() {
                    var _this2 = this;

                    var _browser = Object.assign({}, { path: function path() {
                            return _this2.props.match.path;
                        } }, { url: function url() {
                            return _this2.props.match.url;
                        } }, browser);
                    var props = Object.assign({}, this.props, { browser: _browser });
                    return _react2.default.createElement(Wrap, props);
                }
            }]);

            return NextWrapper;
        }(_react2.default.Component);

        var ReRoute = (0, _reactRouterDom.withRouter)(NextWrapper);
        ReRoute.displayName = 'ReRoute(' + (0, _util.getComponentName)(Wrap) + ')';
        return ReRoute;
    };
};

/**
 * 携带routes匹配的高阶组件，用于根据routes配置知道当前请求对应的route。
 * 1）reRouteMatch可以组合了所有的reRoute属性值。所以需要reRoute的功能不必重复组合
 * 2）将reRouteMatch和reRoute分离，主要是reRouteMatch进行正则运算较多，而不是所有组件都需要知道请求所属route
 * @returns {*}
 */
var reRouteMatch = function reRouteMatch() {
    return function (Wrap) {
        var Wrapper = function (_React$Component2) {
            _inherits(Wrapper, _React$Component2);

            function Wrapper() {
                var _ref2;

                _classCallCheck(this, Wrapper);

                for (var _len2 = arguments.length, props = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    props[_key2] = arguments[_key2];
                }

                return _possibleConstructorReturn(this, (_ref2 = Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call.apply(_ref2, [this].concat(props)));
            }

            _createClass(Wrapper, [{
                key: 'shouldComponentUpdate',
                value: function shouldComponentUpdate(nextProps, nextState) {
                    return this.props !== nextProps;
                }
            }, {
                key: 'render',
                value: function render() {
                    var originBrowser = this.props.browser,
                        route = (0, _match2.default)(originBrowser),
                        browser = Object.assign({}, originBrowser, { route: route });
                    var props = Object.assign({}, this.props);
                    props.browser = browser;
                    return _react2.default.createElement(Wrap, props);
                }
            }]);

            return Wrapper;
        }(_react2.default.Component);

        var ReRouteMatch = reRoute()(Wrapper);
        ReRouteMatch.displayName = 'ReRouteMatch(' + (0, _util.getComponentName)(Wrap) + ')';
        return ReRouteMatch;
    };
};

exports.Route = _reactRouterDom.Route;
exports.Link = _reactRouterDom.Link;
exports.withRouter = _reactRouterDom.withRouter;
exports.reRoute = reRoute;
exports.reRouteMatch = reRouteMatch;
exports.history = history;
exports.Redirect = _reactRouterDom.Redirect;
exports.StaticRouter = _reactRouterDom.StaticRouter;
exports.Router = _reactRouterDom.Router;