export function proxy(vm, data, key) {

    Object.defineProperty(vm, key, {

        get() {
            return vm[data][key]
        },
        set(val) {
            vm[data][key] = val;
        }
    })
}

export function defineProperty(target, key, value) {
    
    Object.defineProperty(target, key, {
        enumerable: false, // 不能枚举，能保证不能进行循环进行劫持
        configurable: false,
        value
    })
}

export const LIFECYCLE_HOOKS = [ // 生命周期队列
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'update',
    'beforeDestory',
    'destory'
]

const strats = {}; // 策略对象

function mergeHook(parentVal, childVal) { // 生命周期的合并

    console.log(parentVal)

    if (childVal) {

        if (parentVal) {

            return parentVal.concat(childVal);

        } else {

            return [ childVal ];
        }

    } else {

        return parentVal; // 不进行合并
    }
}

LIFECYCLE_HOOKS.forEach(hook => {

    strats[hook] = mergeHook;
})

export function mergeOptions(parent, child) {

    const options = {};

    for (let key in parent) {

        mergeFiled(key);
    }

    for (let key in child) { // 将儿子多的赋给父亲

        if (!parent.hasOwnProperty(key)) {

            mergeFiled(key);
        }
    }

    function mergeFiled(key) { // 合并字段

        // 根据不同的key，进行不同方式的合并
        if (strats[key]) {

            options[key] = strats[key](parent[key], child[key]);
        }
    }


    return options;
}