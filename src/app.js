/**
 * Created by chkui on 2017/6/26.
 */
'use strict';
import React from 'react'
import {Route} from './router'
import bundle from './bundle'
import {isElement} from './util'

/**
 * 前后端同构的App入口。如果需要二次开发，请参照这个模板
 * @param {object} props{
 *     init : {comp:后台初始化的组件,id:初始化组件对应的id}
 *     routes : 路由列表
 *     className : app的样式
 *     header: 头部元素
 *     children : 内容子元素
 *     footer:页脚元素
 * }
 * @return {XML}
 * @constructor
 */
const App = props => {
    const {init, routes, className, header, children, footer} = props;

    return (
        <div className={className}>
            {isElement(header) ? header : (() => {
                const Header = header;
                return <Header/>
            })()}
            {isElement(children) ? children : (() => {
                const Children = children;
                return <Children/>
            })()}
            {routes.map(i => <Route key={i.id} exact path={i.url}
                                    component={bundle(init.id === i.id && init.comp, i.component)}/>)}
            {isElement(footer) ? footer : (() => {
                const Footer = footer;
                return <Header/>
            })()}
        </div>
    )
}

module.exports = App;
module.exports.default = module.exports;