
import Watcher from './observer/watcher';
import { patch } from './vdom/patch';

export function lifecycleMixin(Vue) {

    Vue.prototype._update = function(vnode) {

        const vm = this;

        const prevVnode = vm._vnode; // 第一次渲染时不存在

        if (!prevVnode) { // 首次渲染

            vm.$el = patch(vm.$el, vnode); // 用新的创建的元素替换老得元素

        } else {

            // vm.$el = patch(prevVnode, vnode); // 更新diff算法
        }

        vm.$el = patch(vm.$el, vnode); // 用新的创建的元素替换老得元素

        vm._vnode = vnode; // 保存当前的vnode以便下一次进行比对
    }
}

export function mountComponent(vm, el) {

    vm.$el = el;

    // 先调用render方法创建一个虚拟节点，在将虚拟节点放到页面上, 调用render方法去渲染el属性
    let updateComponent = () => {

        vm._update(vm._render()); // 渲染和更新逻辑
    }

    // 这个watcher是用于渲染的, true为渲染watcher的标志
    new Watcher(vm, updateComponent, () => {

        callHook(vm, 'updated');

    }, true);
}

// 调用生命周期函数
export function callHook(vm, hook) {

    const handlers = vm.$options[hook];

    if (handlers) {

        for (let i = 0; i < handlers.length; i++) {

            handlers[i].call(vm);
        }
    }

}