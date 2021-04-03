
import { patch } from './vdom/patch';

export function lifecycleMixin(Vue) {

    Vue.prototype._update = function(vnode) {

        const vm = this;
        
        patch(vm.$el, vnode);
    }
}

export function mountComponent(vm, el) {

    // 先调用render方法创建一个虚拟节点，在将虚拟节点放到页面上, 调用render方法去渲染el属性
    vm._update(vm._render());
}