

// vue的渲染流程 =》 先初始化数据 =》 将模版进行编译成render函数 =》 
// 调用render函数 =》 生成虚拟节点 =》 生成真实dom渲染到页面上


export function patch(oldVnode, vnode) {

    // 将虚拟节点转化成真实节点
    let el = createEl(vnode);

    let parentElm = oldVnode.parentNode; // 获取老得节点app的父亲

    parentElm.insertBefore(el, oldVnode.nextSibling); // 真实元素插入老得节点元素的后面

    parentElm.removeChild(oldVnode); // 删除老得节点
}

function createEl(vnode) {

    let { tag, children, key, data, text } = vnode;

    if (typeof tag === 'string') {

        vnode.el = document.createElement(tag);

        children.forEach(child => {

            vnode.el.appendChild(createEl(child));
        })

    } else {

        vnode.el = document.createTextNode(text);
    }

    return vnode.el;
}