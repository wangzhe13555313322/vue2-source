import { nextTick } from "../nextTick";
import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {

    constructor(vm, exprOrFn, cb, options) {

        this.vm = vm; // vm实例

        this.exprOrFn = exprOrFn; // 渲染表达式

        this.cb = cb;

        this.options = options;

        this.user = options.user; // 这是一个用户watcher

        this.lazy = options.lazy; // 如果这个watcher有lazy属性，说明是计算属性

        this.dirty = this.lazy; // 取值时候，是否执行用户提供的方法

        this.isWatcher = typeof options === 'boolean';

        this.id = id++; // watcher的唯一标志

        this.depsId = new Set();

        this.deps = []; // watcher记录有多少dep依赖它

        if (typeof exprOrFn === 'function') {

            this.getter = exprOrFn;

        } else {

            this.getter = function() {

                // 当在当前实例上取值的时候才会触发依赖收集
                let path = exprOrFn.split('.');

                let obj = vm;

                for (let i = 0; i < path.length; i++) {

                    obj = obj[path[i]];
                }

                return obj;
            }
        }

        this.value = this.lazy ? void(0) : this.get(); // 默认调用get方法
    }

    get() { // 调用表达式方法

        pushTarget(this); // this表示当前实例

        let result = this.getter.call(this.vm); // 调用exprOrFn方法，渲染页面

        popTarget();

        return result;
    }

    addDep(dep) { // 添加和dep的相互依赖

        const id = dep.id;
        
        /**
         * depsId，是为了进行去重的效果，因为当页面多次取相同值的时候
         * 对这个值进行了一次双向绑定劫持，会产生一个dep，这个dep会有唯一标志
         * 当页面用到多次的时候，会多次触发dep.depend事件，depend事件会调用watcher的addDep事件
         * addDep事件会收集本次生成的watcher对应的所有dep，会向deps数组中不断添加dep实例
         * 为了保证不重复，需要用dep的id进行去重
         */
        if (!this.depsId.has(id)) {

            this.depsId.add(id);

            this.deps.push(dep);

            dep.addSub(this);
        }

    }

    update() { // 更新操作

        if (this.lazy) { // 是计算属性

            this.dirty = true;

        } else { // 不是计算属性

            queueWatcher(this); // 暂存
        }
    }

    evaluate() {

        this.value = this.get();

        this.dirty = false; // 取过一次的值后，标识为取值完成
    }

    depend() {

        // watcher会存储dep dep会存储watcher 
        let i = this.deps.length;

        while(i--) {

            this.deps[i].depend();
        }
    }

    run() { // watcher执行

        let newValue = this.get();

        let oldValue = this.value;

        if (this.user) {

            this.cb.call(this.vm, newValue, oldValue);
        }
    }
}

let queue = []; // 将需要更新的watcher存到一个队列中，稍后让watcher执行

let has = {};

let pending = false;

function flushScheduleQueue() {

    queue.forEach(watcher => {
        
        watcher.run();

        if (watcher.isWatcher) {

            watcher.cb();
        }

    });

    queue = [];

    has = {};

    pending = false;
}

function queueWatcher(watcher) {

    const id = watcher.id;

    if (!has[id]) {

        queue.push(watcher);

        has[id] = true;

        if (!pending) {

            nextTick(flushScheduleQueue);

            pending = true;
        }
        
    }
}

export default Watcher;