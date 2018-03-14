/**
 * Created by chkui on 2017/6/26.
 */
'use strict';
import React from 'react'
import {render} from 'react-dom';
import {Provider} from 'react-redux'
import {Router, history} from './router'
import {set} from './lib/context'
import {buildStore} from './flux'
import DefApp from './app'
/**
 * 单页面前端基础入口组件，提供整合pwfe-server的入口支持。
 * 1）必须使用已定义的前后端通用标准页面模板。必须包含title、REDUX_STATE、SERVER_PARAMS模板参数
 *-------------------------------------------------------------------------------------------------------------
 *<html lang="en">
 <head>
 <title><%- title %></title>
 </head>
 <body>
 <div id="root"><%- root %></div>
 <script>
 window.REDUX_STATE = <%- JSON.stringify(state) %>;
 window.SERVER_PARAMS =<%- JSON.stringify(params) %>
 </script>
 *</html>
 *-----------------------------------------------------------------------------------------------------------------
 2）路由列表必须使用标准结构
 *-----------------------------------------------------------------------------------------------------------------
 *[{
    id: 'comp1', //页面id，在列表中唯一
    url: '/', //页面对应的URL //如果不提供url，则视为全匹配路径，一般用于404页面
    name: '演示文稿', //页面名称，会渲染到title媒体属性中
    component: (cb)=> { //加载组件的回调
        //after get component
        cb(require('./sub/comp1'))
    }
 *}]
 *-----------------------------------------------------------------------------------------------------------------
 *3）仅用于客户端
 *4）如果有特殊需要，可以参照这个模型进行开发。关键一定要生成首屏渲染的页面组件。
 * @param {object} options{
 *  {object} reducer：redux的reducer。结构为{key:value}
 *  {array} routes：路由列表
 *  {component} app: 用于前后端同构渲染的app。该App会被传入 init参数和 routes参数。
 *  {component} header: 在app中显示的头部元素，如果传入了自定义的app，则会传入到props.header中，组件会在children之前显示
 *  {component} children: 在app中显示的子元素，如果传入了自定义的app，则会传入到props.children中
 *  {component} footer: 在app中显示的头部元素，如果传入了自定义的app，则会传入到props.footer中，组件会在routes之后显示
 *  {string} className: app的样式
 *  {function} renderCb: 渲染完成的回调
 * }
 * init的结构为{comp 和 id} comp表示首屏渲染的页面以及页面对应的id。
 * routes就是定义的路由列表
 */
const entry = (options) => {
    const {reducer, routes, app, renderCb, className, header, footer} = options,
        innerWindow = window || {}, //防止window不存在时属性运算异常
        store = buildStore(reducer, innerWindow.REDUX_STATE),
        serverParam = innerWindow.SERVER_PARAMS || {},
        initID = serverParam.initId || routes[0].id,
        App = app || DefApp
    set('routes',routes)
    for (let i of routes) {
        if (i.id === initID) {
            i.component(comp=> {
                set('initRoute', i)
                render(
                    <Provider store={store}>
                        <Router history={history}>
                            <App className={className} init={{comp, id: initID}} routes={routes} header={header} footer={footer}>
                                {options.children}
                            </App>
                        </Router>
                    </Provider>,
                    document.getElementById('root')
                );
                renderCb && renderCb()
            })
        }
    }
}

module.exports = entry;
module.exports.default = module.exports;