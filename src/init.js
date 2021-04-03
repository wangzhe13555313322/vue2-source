import { initState } from './state';
import { compileToFunctions } from './compiler/index';
import { mountComponent } from './lifecycle';

export function initMixin(Vue) {

    // 初始化方法
    Vue.prototype._init = function(options) {

        const vm = this;

        vm.$options = options;

        // 初始化状态（将数据做一个初始化劫持，当数据改变时会更新页面） vue核心特性，响应式数据原理
        initState(vm);

        // 如果当前有el属性说明需要渲染模版
        if (vm.$options.el) {

            vm.$mount(vm.$options.el);
        }
    }

    Vue.prototype.$mount = function(el) {

        // 进行挂载操作
        const vm  = this;

        const options = vm.$options

        el = document.querySelector(el);

        vm.$el = el;

        if (!options.render) {

            // 如果没有render，将template转成render方法
            let template = options.template;

            // 如果没有template属性并且有el属性就行内容赋给template
            if (!template && el) {

                template = el.outerHTML;
            }

            // 编译原理 将模版编译成render函数
            const render = compileToFunctions(template);

            options.render = render;  // 渲染时都是用的这个render方法
        }

        // 需要挂载这个组件
        mountComponent(vm, el);
    }
}