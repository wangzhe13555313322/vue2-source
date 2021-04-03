
// 拼接属性
function genProps(attrs) {

    let str = '';

    for (let i = 0; i < attrs.length; i++) {

        let attr = attrs[i];

        if (attr.name === 'style') {

            let obj = {};

            attr.value.split(';').forEach(item => {

                let [key, value ] = item.split(':');

                obj[key] = value;
            });

            attr.value = obj;
        } 

        str += `${attr.name}: ${JSON.stringify(attr.value)},`
    }

    return `{${str.slice(0, -1)}}`;
}

function getChildren(el) {

    const children = el.children;

    if (children) { // 将所有转化后的儿子元素用逗号拼接

        return children.map(child => gen(child)).join(',');
    }
}

const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

function gen(node) {

    if (node.type === 1) { // 生成元素节点的字符串

        return generate(node);

    } else {

        let text = node.text; // 获取文本

        if (!defaultTagRE.test(text)) {

            // 如果是普通文本，不带带括号的
            return `_v(${JSON.stringify(text)})`
        }

        let tokens = []; // 存放每一段的代码

        let lastIndex = defaultTagRE.lastIndex = 0; // 如果正则是全局模式，每次使用前lastIndex置为0

        let match, index; // 每次匹配到的结果

        // exec只会对匹配的字符串进行一次匹配，第一次匹配成功了，下一次匹配会从上一次匹配完成的index开始
        // 所以如果要进行字符串多次重复匹配，需要将正则的lastIndex设置为0
        while(match = defaultTagRE.exec(text)) {

            index = match.index; // 保存匹配到的索引

            if (index > lastIndex) {

                tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }

            tokens.push(`_s(${match[1].trim()})`);

            lastIndex = index + match[0].length; // 此处赋值是为了进行最后的拼接使用，
        } 

        if (lastIndex < text.length) {

            tokens.push(JSON.stringify(text.slice(lastIndex)));
        }

        return `_v(${tokens.join('+')})`;


        
    }
}


export function generate(el) {

    let children = getChildren(el); // 儿子生成

    let code = `_c('${el.tag}', ${
        el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'
    }${
        children ? `,${children}` : ''
    })`;

    return code;
}