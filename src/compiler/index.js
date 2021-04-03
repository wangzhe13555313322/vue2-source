
import { parseHTML } from './parse';
import { generate } from './generate';

export function compileToFunctions(template) {

    /**
     * 总体流程：
     * 将html模版变成render函数，通过ast语法树
     * 1、需要将html代码转化成ast语法树
     * 2、通过ast树重新生成代码
    */

    // 1、需要将html代码转化成ast语法树
    let ast = parseHTML(template);

    // TODO 2、静态节点优化，给每个节点打static属性

    // 3、通过ast树，生成代码
    let code = generate(ast);

    // 4、将字符串变成函数，限制取值范围，用with进行值的获取，调用render函数时候，可以通过改变this的方式让这个函数内获取到结果
    let render = new Function(`with(this){ return ${code} }`);

    return render;
}
