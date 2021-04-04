
import { mergeOptions } from '../utils';

export function initGlobalApi(Vue) {

    Vue.options = {};

    Vue.mixin = function(mixin) {
        
        // TODO 只先考虑生命周期， 不考虑data computed 等
        this.options = mergeOptions(this.options, mixin); // 合并对象

    }
}