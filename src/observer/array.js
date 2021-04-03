
let oldArrayProtoMethods = Array.prototype;

export let arrayMethods = Object.create(oldArrayProtoMethods);

// 可以改写原数组的方法
const methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

// 重写数组的方法
methods.forEach(method => {

    arrayMethods[method] = function(...args) {

        // this就是调用方法的值，就是observe的value
        const result = oldArrayProtoMethods[method].apply(this, args);

        let inserted;

        let ob = this.__ob__;

        switch(method) {
            case 'push':
            case 'unshift': // 新加的内容可能是对象类型，需要重复劫持
                inserted = args;
                break;
            case 'splice':
                inserted = args.slice(2);
                break;
            default:
                break;
        }

        if (inserted) {
            ob.observeArray(inserted);
        }

        return result;
    }
})
