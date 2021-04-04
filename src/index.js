import { initMixin } from './init';
import { lifecycleMixin } from './lifecycle';
import { renderMinix } from './vdom/index';
import { initGlobalApi } from './global-api/index';
import { stateMixin } from './state';


function Vue(option) {
    
    this._init(option); // 入口方法
}

//原型方法
initMixin(Vue); // 初始化数据

lifecycleMixin(Vue); // 混合声明周期

renderMinix(Vue);

stateMixin(Vue);

// 静态方法
initGlobalApi(Vue)

export default Vue;