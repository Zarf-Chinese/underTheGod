var Attr=require("../PObject/Attr")
var Controller=require("../base/Controller");

var AttrController={
    context:null,
    __proto__:Controller,
    Type:Attr,//控制目标类型
    
    configs:[],//类型配置集，内含一个默认类型配置
    
    default:"default",//默认类型配置名

    /**
     * 根据一个属性的配置来获取一个属性的随机值
     * @param {Attr.Config} config 目标配置
     */
    getValueFromConfig(config){
        let ret=config.init;
        ret+=2*(Math.random()-0.5)*config.float;
        return ret;
    },

    /**
     * 从配置文件中读取配置集合
     * 会覆盖过去的同类型 属性配置
     * @param {string} configUrl 配置文件路径
     */
    loadConfig(configUrl){
        cc.loader.loadRes("attr/"+configUrl+".config",function(event,data){
            if(data){
                data.forEach(config=>{AttrController.registConfig(config,true)});
                this.context.Maid.pushEvent("attrConfigAssetLoaded"+configUrl);
            }
        }.bind(this));
    },
    
    
    /**
     *通过一个配置初始化一个实例
     * @param {Attr} attr
     * @param {Attr.Config} config
     */
    initByConfig(attr,config){
        attr.delta=0;
        attr.type=config.type;
        AttrController.setValue(attr,AttrController.getValueFromConfig(config));
    },

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Attr.Config} config 配置
     * @return {Attr}
     */
    _createByConfig(config){
        let attr = new Attr();
        this.initByConfig(attr, config);
        return attr;
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
     *仅支持整数
     * @param {Attr} attr
     * @param {number} value
     */
    setValue(attr,value){
        attr.value=Math.round(value);
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
AttrController.registConfig(new Attr.Config());
AttrController.setDefaultConfig("default");
module.exports=AttrController;