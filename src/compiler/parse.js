// aaa-123,匹配的标签名字，例如<a-b></a-b>
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
// 命名空间标签<a:xx></a-b>
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
// 匹配标签开头
const startTagOpen = new RegExp(`^<${qnameCapture}`);
// 匹配标签结尾
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
// 属性匹配
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// 匹配标签结束  ---> />
const startTagClose = /^\s*(\/?)>/;
// 匹配{{ xxx }}
const defaultTagRE = /\{\{((?:.|\n)+?)\}\}/g;

function createASTElement(tagName, attrs) {

    return {
        tag: tagName, // 标签名
        type: 1, // 元素类型
        children: [], // 孩子列表
        attrs, // 属性集合
        parent: null // 父元素
    }
}

let root;

let currentParent;

// 验证标签是不是符合预期，需要用栈行结构来验证
let stack = [];

function start(tagName, attrs) { // 处理开始标签

    let element = createASTElement(tagName, attrs);

    if (!root) {
        root = element;
    }

    currentParent = element; // 保存当前解析的标签

    stack.push(element); // 将生成的ast元素放入栈中
}

function end(tagName) { // 处理结束标签，可以创建父子关系
    let element = stack.pop(); // 获取栈中最后一个

     // 判断栈中的最后一个元素的名字是否和当前闭合标签的名字相同
    if (element.tag === tagName) {

        // 当栈的最后一个元素被pop出之后，证明一个标签已经完成，需要将当前的currentParent重新赋值到上一个标签中
        currentParent = stack[stack.length - 1];

        if (currentParent) { // 在闭合时，可以知道标签的父亲

            element.parent = currentParent;

            currentParent.children.push(element);
        }
    }
}

function chars(text) { // 处理文本

    text = text.replace(/\s/g, '');

    if (text) {

        currentParent.children.push({
            type: 3,
            text
        })
    }
}

export function parseHTML(html) {

    while(html) { // 只要html不为空字符串就一直解析

        let textEnd = html.indexOf('<');

        if (textEnd === 0) {  // 一定是标签

            const startTagMatch = parseStartTag(); // 解析开始,标签的匹配结果 ----> 以<开头

            if (startTagMatch) {

                start(startTagMatch.tagName, startTagMatch.attrs);

                continue;
            }

            const endTagMatch = html.match(endTag);

            if (endTagMatch) { // 处理结束标签

                end(endTagMatch[1]); // 将结束标签传入

                advance(endTagMatch[0].length);

                continue;
            }
        }

        let text;

        if (textEnd > 0) { // 是文本

            text = html.substring(0, textEnd);
        }

        if (text) { // 处理文本

            chars(text);

            advance(text.length);
        }
    }

    function advance(n) { // 将字符串进行截取，然后更新html字符串

        html = html.substring(n);
    }

    function parseStartTag() {

        const start = html.match(startTagOpen)

        if (start) {

            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }

            advance(start[0].length) // 删除开始标签

            // 如果直接是闭合标签，说明没有属性
            let end, attr;
            // 不是结尾标签并且能匹配到属性
            while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 属性匹配

                match.attrs.push({ name: attr[1], value: attr[3] ||  attr[4] ||  attr[5] });

                advance(attr[0].length)
            }
            if (end) {

                advance(end[0].length);

                return match;
            }
        }
    }

    return root;
}