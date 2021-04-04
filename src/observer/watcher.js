import { popTarget, pushTarget } from "./dep";

let id = 0;

class Watcher {

    constructor(vm, exprOrFn, cb, options) {

        this.vm = vm; // vm实例

        this.exprOrFn = exprOrFn; // 渲染表达式

        this.cb = cb;

        this.options = options;

        this.id = id++; // watcher的唯一标志

        this.depsId = new Set();

        this.deps = []; // watcher记录有多少dep依赖它

        if (typeof exprOrFn === 'function') {

            this.getter = exprOrFn;
        }

        this.get(); // 默认调用get方法
    }

    get() {

        pushTarget(this); // this表示当前实例

        this.getter(); // 调用exprOrFn方法，渲染页面

        popTarget();
    }

    addDep(dep) {

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

    update() {
        
        this.get(); // 重新渲染
    }
}

export default Watcher;