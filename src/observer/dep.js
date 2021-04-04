

// 是一个多对多的关系，每个属性都对应一个dep，这个dep用来收集watcher
// dep可以存放多个watcher
// 一个watcher可以对应多个dep

let id = 0;

class Dep {

    constructor() {

        this.subs = [];

        this.id = id++;
    }

    depend() {

        // dep存放watcher，watcher可以存放dep
        Dep.target.addDep(this); // 为了实现双向记忆
    }

    addSub(watcher) {

        this.subs.push(watcher);
    }

    notify() {

        this.subs.forEach(watcher => watcher.update());
    }

}

export default Dep;

Dep.target = null; // 因为js编译过程会对class进行提升，taget这个静态属性会一直存在内存中

let stack = [];

export function pushTarget(wathcer) { // 保留watcher

    Dep.target = wathcer;

    stack.push(wathcer); // 可能哟渲染watcher 还有其他的watcher
}

export function popTarget() { // 将变量删除

    stack.pop();

    Dep.target = stack[stack.length - 1];
}