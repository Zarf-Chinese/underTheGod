var event={
    /**
     * 可以通过一个eventname注册一个事件，这个事件会尝试调用component内与eventname同名的函数
     * @param {cc.Component} targetComponent 
     * @param {string} eventName 
     * @param {boolean} once
     */
    registEventCallback(targetComponent,eventName,once){
        var callback=targetComponent[eventName];
        let callFuncname=once?"once":"on";
        if(callback) targetComponent.node[callFuncname](eventName,callback,targetComponent);
    },

    /**
     * 给目标节点注册一个点击事件（touch的移动长度小于3）
     * @param {Node} node 
     * @param {(event:cc.Touch)} callback 
     * @param {number} tensity touch最大可允许的移动长度，默认为3
     */
    onClick(node,callback,tensity){
        tensity=tensity ||3;
        //node.on(cc.Node.EventType.TOUCH_START)
        node.on(cc.Node.EventType.TOUCH_END, function (event) {
            let delta=cc.v2(event.getLocation()).add(cc.v2(event.getStartLocation()).neg()).mag();
            if(delta<tensity){
                callback(event);
            } 
        });
    }

    
}
module.exports=event;