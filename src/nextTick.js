
let callbacks = [];

let timerFunc = null;

let pending = false;

function flushCallbacks() {

    while(callbacks.length) {

        let cb = callbacks.shift();
        
        cb()
    }

    pending = false; // 执行状态，标志为执行完毕

}

if (Promise) {

    timerFunc = () => {

        Promise.resolve().then(flushCallbacks);
    }

} else if (MutationObserver) {

    let observe = new MutationObserver(flushCallbacks);

    let textNode = document.createTextNode(1);

    observe.observe(textNode, { characterData: true });

    timerFunc = () => {

        textNode.textContent = 2;
    }

} else {

    timerFunc = () => {
        
        setTimeout(flushCallbacks);
    }
}

export function nextTick(cb) { // 因为内部会调用nextTick，用户也会调用nextTick，异步执行也会执行一次

    callbacks.push(cb);

    if (!pending) {

        timerFunc(); // 这个方法是异步方法，做了兼容处理

        pending = true;
    }
}


