
export function renderMinix(Vue) { // 创建虚拟节点，用对象来藐视dom结构

    Vue.prototype._c = function() { // 创建元素

        return createElement(...arguments); // 虚拟dom元素
    }

    Vue.prototype._s = function(value) { // stringify

        return value === null ? '' : (typeof value === 'object' ) ? JSON.stringify(value) : value;
    }

    Vue.prototype._v = function(text) { // 创建文本元素

        return createTextVnode(text); // 虚拟文本元素
    }

    Vue.prototype._render = function() {

        const vm = this;

        const render = vm.$options.render;

        const vnode = render.call(this);

        return vnode;
    }
}

function createElement(tag, data = {}, ...children) { // 创建元素

    return vnode(tag, data, data.key, children);
}

function createTextVnode(text) {  // 创建文本元素

    return vnode(undefined, undefined, undefined, undefined, text);
}

function vnode(tag, data, key, children, text) { // 产生虚拟dom的
    
    return {
        tag, 
        data,
        key,
        children,
        text
    }
}