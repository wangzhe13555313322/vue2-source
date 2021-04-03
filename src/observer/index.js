import { arrayMethods } from './array';
import { defineProperty } from '../utils'

class Observer {

    constructor(value) {

        /**
         * 判断一个对象是否被观察过，可以查看__ob__是否存在,
         * 1.这个属性可以对劫持的数据进行标识
         * 2.还可以将observer这个类绑定给每一个劫持对象，使其有能力调用observer的方法
         * 3.数组重新赋值的时，新增的元素可能是一个对象，要通过这个属性对新增元素添加劫持方法
         */
        defineProperty(value, '__ob__', this)
    
        if (!Array.isArray(value)) {
             
            // 使用defindProperty进行重新定义属性
            this.walk(value); 

        } else {  // defineProperty能对数组进行拦截，但是为了性能不进行劫持
           
            // 将传递的数组的原型进行重写，改写七种方法
            value.__proto__ = arrayMethods;

            // 需要观察数组中的对象类型
            this.observeArray(value); 
        }
    }

    observeArray(value) {

        value.forEach(item => {

            observe(item);
        })
    }

    walk(data) {

        let keys = Object.keys(data);

        keys.forEach(key => {

            defineReative(data, key, data[key]);
        })
    }
}

function defineReative(data, key, value) {

    // 递归进行劫持解析数据
    observe(value)

    Object.defineProperty(data, key, {
        get() {
            return value;
        },
        set(newValue) {

            if (newValue === value) {
                return;
            }

            observe(value); // 如果赋值为新对象，则继续进行监控

            value = newValue;
        }
    })
}

export function observe (data) {

    if (typeof data !== 'object' && data !== null) {
        return data;
    }

    // 表示这个数据已经被观察过了
    if (data.__ob__) { 
        return data;
    }
    
    return new Observer(data);

}