var Attr=require("../PObject/Attr")
var Controller=require("../base/Controller");

var AttrController={
    __proto__:Controller,
    Type:Attr,//控制目标类型
    
    configs:[],//类型配置集，内含一个默认类型配置
    
    default:"default",//默认类型配置名

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Attr.Config} config 配置
     * @return {Attr}
     */
    _createByConfig(config){
        //fixme
    },

    /**
     *获取某属性的属性值
     * @param {Attr} attr
     * @returns {number} 属性的当前值
     */
    getValue(attr){
        return attr.value
    },

    /**
     *设置属性的当前值
     * @param {Attr} attr
     * @param {number} value
     */
    setValue(attr,value){
        attr.value=value;
    },

    /**
     *每度过一天，根据属性的变化量刷新属性的值
     * @param {Attr} attr
     */
    pass(attr){
        if(attr.delta)
        {
            attr._pass();
        }
    },

    /**
     * 使某属性产生变化
     * 属性的所有变化会在每回合末尾结算一次
     * @param {string} attr 属性
     * @param {number} alter 变化量
     */
    alterValue(attr,alter){
        attr.delta+=alter;
    }
}
AttrController.setDefaultConfig("default");
AttrController.registConfig(new Attr.Config());
module.exports=AttrController;