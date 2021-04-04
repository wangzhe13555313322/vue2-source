import { arrayMethods } from './array';
import { defineProperty } from '../utils'
import Dep from './dep';

class Observer {

    constructor(value) {
        console.log(value)

        this.dep = new Dep(); // 这个dep是相当于给劫持的对象或者数组给了一个dep属性

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

    // 递归进行劫持解析数据，获取数组对应的dep
    let childDep = observe(value) // 这个方法递归执行绑定，但是只有对象的时候才会进行observer的创建，这个是给对象的每一个value进行绑定

    let dep = new Dep(); // 每个属性都有一个dep，这个是给对象的每一个key进行绑定

    Object.defineProperty(data, key, { // 当页面获取值时，将watcher和这个属性对应起来

        get() {

            if (Dep.target) {


                dep.depend();

                if (childDep) {

                    dep.depend(); // 数组存放起来了这个渲染watcher
                }
            }

            return value;
        },

        set(newValue) {

            if (newValue === value) {
                return;
            }

            observe(value); // 如果赋值为新对象，则继续进行监控

            value = newValue;

            dep.notify();
        }
    })
}

export function observe (data) {

    // observe是递归解析的过程，初始化进来的时候，data永远是一个object类型
    // 当递归解析data里面的数据的时候才存在array类型

    if (typeof data !== 'object' && data !== null) {
        return;
    }

    // 表示这个数据已经被观察过了
    if (data.__ob__) { 
        return data;
    }
    return new Observer(data);

}