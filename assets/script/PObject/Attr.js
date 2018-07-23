var PObject = require("PObject");
/**
 * {
 * "type":"funds",
 * "init":10000,
 * "float":100,
 * "max":1e10,
 * "inflex":
 * }
 * 
 * 
 * 
 */
var Attr = cc.Class({
    statics: {
        //类型配置
        Config: cc.Class({
            name: "AttrConfig",
            extends: PObject,
            properties: {
                type: "default",
                init: 0,
                float: 0,
                max: 1e9,
                inflex: 1e5,
                inflexPos: 0.6
            }
        })
    },
    name: "Attr",
    extends: PObject,
    properties: {
        type: "default",
        value: 0,
        delta: 0
    },

    /**
     * 每度过一天，刷新一次，根据 delta 改变 value 的值
     */
    _pass() {
        if (this.delta) {
            this.value += this.delta;
        }
        this.delta = 0;
    }
})
module.exports=Attr;