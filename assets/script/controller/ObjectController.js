var Object = require("../PObject/Object")
var Controller = require("../base/Controller");
var AttrController= require("./AttrController");
var ObjectController = {
    __proto__: Controller,
    Type: Object,//控制目标类型

    configs: [],//类型配置集，内含一个默认类型配置

    default: "default",//默认类型配置名

    /**
     * 通过一个键值来根据相应配置来创建一个对象
     * @param {number} key 对象的键值
     */
    createByKey(key){
        let config=ObjectController.getConfigByKey(key)
        if(config)return ObjectController.createByConfig(config);
    },

    /**
     * 通过键值来获取一个对象配置
     * @param {number} key 配置的键值
     */
    getConfigByKey(key){
        return this.configs.find(value=>{
            return(value.key===key);
        })
    },



    /**
     *通过一个配置初始化一个实例
     * @param {Object} object
     * @param {Object.Config} config
     */
    initByConfig(object, config) {
        object.type = config.type;
        config.attrs.forEach(function(attrType){
            //添加属性
            ObjectController.addAttrByType(object,attrType);
        })
    },

    /**
     * 设置某属性的值，若属性不存在，则会创建该属性
     * @param {Object} object 
     * @param {string} attrType 
     * @param {number} value 新值
     */
    setAttr(object,attrType,value){
        let attr= ObjectController._getAttr(object,attrType);
        if(attr){
            AttrController.setValue(attr,value);
        }else
        {
            ObjectController._addAttrByType(object,attrType,value);
        }
    },

    /**
     * 检查是否该对象含有某种类型的属性
     * @param {Object} object 
     * @param {string} attrType 
     * @param {boolean} 是否含有该类型的属性
     */
    hasAttr(object,attrType){
        return true & ObjectController._getAttr(object,attrType);
    },

    /**
     * @private
     * 获取某属性
     * @param {Object} object 
     * @param {string} attrType
     * @return {Attr} 
     */
    _getAttr(object,attrType){
        return object.attrs.find(attr=>{return attr.type==attrType});
    },

    /**
     * @private
     * 给某对象添加某属性
     * @param {Object} object 
     * @param {Attr} attr 
     */
    _addAttr(object,attr){
        object.attrs.push(attr);
    },

    /**
     * 给某对象添加相应类新的属性。
     * 如已经有该属性，则不会重复添加。
     * @param {Object} object 
     * @param {string} attrType 属性类型
     * @param {number} value 可选，在创建时赋予属性固定初始值
     */
    addAttrByType(object,attrType,value){
        if(ObjectController.hasAttr(object,attrType))return;
        ObjectController._addAttrByType(object,attrType,value);
    },
    /**
     * @private
     * 给某对象添加相应类新的属性。
     * @param {Object} object 
     * @param {string} attrType 属性类型
     * @param {number} value 可选，在创建时赋予属性固定初始值
     */
    _addAttrByType(object,attrType,value){
        let config=AttrController.getConfigByTypename(attrType);
        if(config){
            let attr=AttrController.createByConfig(config);
            if(typeof(value)=="number")AttrController.setValue(attr,value);
            ObjectController._addAttr(object,attr);
        }
    },

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Object.Config} config 配置
     * @return {Object}
     */
    _createByConfig(config) {
        let object = new Object();
        this.initByConfig(object, config);
        return object;
    },

    /**
     *每度过一天，根据属性的变化量刷新属性的值
     * @param {Object} object
     */
    pass(object) {
    },

    /**
     * 从一个配置集合中加载所有的配置
     * @param {string} configUrl 配置集合
     */
    _loadConfigAsset(configUrl) {
        //加载对象配置 图片资源集
        cc.loader.loadRes("object/" + configUrl, cc.SpriteAtlas,function (event, data) {
            //加载 对象配置数据
            if (data) {
                this.context.objConfigAtlas=data;
                cc.loader.loadRes("object/" + configUrl + ".config", function (event, data) {
                    if (data) {
                        this._loadConfigs(data);
                        this.context.Maid.pushEvent("objConfigAssetLoaded" + configUrl, data);
                    }
                }.bind(this));
            }
        }.bind(this));
    },

    _loadConfigs(configAsset) {
        configAsset.forEach(function(elem){
            ObjectController.registConfig(elem);
        })
    },

    /**
     * 从该文件中加载对象配置
     * 每个场景只能使用一种对象配置集，
     * 因而此次加载的对象配置将覆盖原有对象配置。
     * @param {string} configUrl 配置文件路径
     */
    reloadConfig(configUrl) {
        //如果上一次加载的 对象配置集和这一次的相同，则无须继续加载
        if (configUrl === this.configUrl) return;
        this.resetAllConfig();
        this._loadConfigAsset(configUrl);
    },

    /**
     * 设置目标对象的 tile 坐标
     * @param {Object} object 目标对象
     * @param {number} x 
     * @param {number} y 
     */
    setTilePos(object,x,y){
        object.pos.x=x;
        object.pos.y=y;
    }
}
ObjectController.registConfig(new Object.Config());
ObjectController.setDefaultConfig("default");
module.exports = ObjectController;