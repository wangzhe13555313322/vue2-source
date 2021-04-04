import { nextTick } from './nextTick';
import { observe } from './observer/index'
import Watcher from './observer/watcher';
import { proxy } from './utils'


export function initState(vm) {

    const options = vm.$options;

    if (options.props) initProps(vm);

    if (options.methods) initMethods(vm);

    if (options.data)  initData(vm);

    if (options.computed) initComputed(vm);
    
    if (options.watch) initWatch(vm);
}

function initProps(vm) {
}

function initMethods(vm) {
}



function initData(vm) {

    let data = vm.$options.data;

    vm._data = data = typeof data === 'function' ? data.call(vm) : data;

    // 当在vm获取属性时，将属性的获取代理到vm_data上
    for (let key in data) {

        proxy(vm, '_data', key);
    }

    observe(data);
}

function initComputed(vm) {
}

function initWatch(vm) {

    let watch = vm.$options.watch;

    for (let key in watch) {

        const handler = watch[key]; // 这个handler可能是数组、字符串、对象、函数

        if (Array.isArray(handler)) { // 数组

            handler.forEach(hand => {

                createWatcher(vm, key, hand);
            })

        } else {

            createWatcher(vm, key, handler); // 字符串、对象、函数
        }
    }
}

function createWatcher(vm, exprOrfn, handler, options) { // options可以用来表识

    if (typeof handler === 'object' && handler !== null) {

        options = handler;

        handler = handler.handler;
    }

    if (typeof handler === 'string') {

        handler = vm[handler];
    }

    return vm.$watch(exprOrfn, handler, options)
 
}

export function stateMixin(Vue) {

    Vue.prototype.$nextTick = function(cb) {

        nextTick(cb);
    }

    Vue.prototype.$watch = function(exprOrfn, cb, options) {

        // 数据应该依赖这个watcher，数据变化后应该让watcher重新执行
        const watcher = new Watcher(this, exprOrfn, cb, { ...options, user: true });

        if (options && options.immediate) {

            cb(); // 如果是immediate需要立即执行
        }

    }
}