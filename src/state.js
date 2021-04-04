import { nextTick } from './nextTick';
import Dep from './observer/dep';
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

    /**
     * 1、需要一个watcher
     * 2、需要用defineProperty进行劫持
     * 3、需要一个dirty属性
     */

    let computed = vm.$options.computed;

    const watcher = vm._computedWatchers = {};

    for (let key in computed) {

        const userDef = computed[key];

        const getter = typeof userDef === 'function' ? userDef : userDef.get; // 获取get方法,watcher使用

        watcher[key] = new Watcher(vm, getter, () => {}, { lazy: true }); // watcher是懒的

        defineComputed(vm, key, userDef);
    }
}


function defineComputed(target, key, userDef) {

    const sharedPropertyDefinition = {

        enumerable: true,

        configurable: true,

        get: () => {},

        set: () => {}
    };

    if (typeof userDef === 'function') {

        sharedPropertyDefinition.get = createComputedGetter(key);

    } else {

        sharedPropertyDefinition.get = userDef.createComputedGetter(key); // 需要添加缓存

        sharedPropertyDefinition.set = userDef.set;
    }

    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {

    return function() { // 此方法是包装的方法，没去取值多次调用这个方法

        const watcher = this._computedWatchers[key]; // 拿到这个属性对应的watcher

        if (watcher) {

            if (watcher.dirty) { // 默认是true

                watcher.evaluate();
            }

            if (Dep.target) { // 说明有渲染watcher，也应该进行收集

                watcher.depend();
            }

            return watcher.value; // 默认返回值
        }
    }

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