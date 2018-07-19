var property = {
    /**
     * 通过下属某组件的某个函数的调用器。若找不到该函数，或者该索引所得不是函数，都会返回null
     * @example 
     * ```
     * f_caller=util.property.getPropertyFuncCaller("cc.Node","setPosition")
     * f_caller(cc.p(10,10))
     * ```
     * @param {string} targetComponentname 
     * @param {string} funcname 
     * @returns {function} the target function
     */
    getPropertyFuncCaller(targetComponentname, funcname) {
        return function(...arg)
        {
            if(!this ||typeof(this.getComponent)!="function"){
                Editor.failed("A component of cc.Sprite is required to properly use me!");
                return null;
            }
            let comp = this.getComponent(targetComponentname);
            if (!comp || typeof(comp[funcname]) != "function"){
                Editor.failed("A component of cc.Sprite is required to properly use me!");
                return null;
            }
            comp[funcname](...arg);
        }
    }
};
module.exports=property;
