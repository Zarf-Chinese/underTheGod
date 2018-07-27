var Unit = require("../PUnit/Unit")
var Controller = require("../base/Controller");
var AttrController= require("./AttrController");
var PosController=require("./PosController").PosController;
var UnitController = {
    __proto__: Controller,
    Type: Unit,//控制目标类型

    configs: [],//类型配置集，内含一个默认类型配置

    default: "default",//默认类型配置名

    /**
     * 通过一个键值来根据相应配置来创建一个对象
     * @param {number} key 对象的键值
     */
    createByKey(key){
        let config=UnitController.getConfigByKey(key)
        if(config)return UnitController.createByConfig(config);
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
     * 根据深度创建一个对象层节点
     * 将会检查是否存在该对象层。若已经存在，则不会进行任何操作。
     * @param {number} zOrder 深度
     */
    addObjLayer(zOrder){
        if(!this.context.unitLayers[zOrder]){
            //仅在 目标对象层不存在时新建
            let unitLayer=new cc.Node();
            this.context.unitLayers[zOrder]=unitLayer;
            unitLayer.setLocalZOrder(zOrder);
            unitLayer.tag=zOrder;
            this.context.Maid.pushEvent("newObjLayerAdded",zOrder);
        }
    },

    /**
     * 根据深度值获取相应对象层节点
     * @param {number} zOrder 深度
     * @return {cc.Node} 图像层节点
     */
    getUnitLayerByZOrder(zOrder){
        if(!this.context.unitLayers[zOrder]){
            //add unit layer
            UnitController.addObjLayer(zOrder);
            return UnitController.getUnitLayerByZOrder(zOrder);
        }
        return this.context.unitLayers[zOrder]
    },
    /**
     * 获取该对象所对应的对象层节点
     * @param {Unit} unit 
     * @return {cc.Node} 图像层节点
     */
    getUnitLayer(unit){
        let config=UnitController.getConfig(unit)
        if(config){
            return UnitController.getUnitLayerByZOrder()
        }
    },



    /**
     *通过一个配置初始化一个实例
     * @param {Unit} unit
     * @param {Unit.Config} config
     */
    initByConfig(unit, config) {
        unit.type = config.type;
        config.attrs.forEach(function(attrType){
            //添加属性
            UnitController.addAttrByType(unit,attrType);
        })
        //添加节点
        UnitController._initUnitNode(unit,config);
    },
    
    /**
     * @private
     * 初始化 对象所属的节点
     * @param {Unit} unit 
     * @param {Unit.Config} config 
     */
    _initUnitNode(unit,config){
        let node=new cc.Node();
        let frame=this.context.unitConfigAtlas.getSpriteFrame(config.frame);
        let sprite= node.addComponent(cc.Sprite);
        if(frame){
            sprite.spriteFrame=frame;
        }else
        {
            console.log("warning! spirte frame not found:%s",config.frame);
        }
        UnitController.getUnitLayerByZOrder(config.zOrder).addChild(node);
        unit.node=node;
    },

    /**
     * 设置某属性的值，若属性不存在，则会创建该属性
     * @param {Unit} unit 
     * @param {string} attrType 
     * @param {number} value 新值
     */
    setAttr(unit,attrType,value){
        let attr= UnitController._getAttr(unit,attrType);
        if(attr){
            AttrController.setValue(attr,value);
        }else
        {
            UnitController._addAttrByType(unit,attrType,value);
        }
    },

    /**
     * 检查是否该对象含有某种类型的属性
     * @param {Unit} unit 
     * @param {string} attrType 
     * @param {boolean} 是否含有该类型的属性
     */
    hasAttr(unit,attrType){
        return true & UnitController._getAttr(unit,attrType);
    },

    /**
     * @private
     * 获取某属性
     * @param {Unit} unit 
     * @param {string} attrType
     * @return {Attr} 
     */
    _getAttr(unit,attrType){
        return unit.attrs.find(attr=>{return attr.type==attrType});
    },

    /**
     * @private
     * 给某对象添加某属性
     * @param {Unit} unit 
     * @param {Attr} attr 
     */
    _addAttr(unit,attr){
        unit.attrs.push(attr);
    },

    /**
     * 给某对象添加相应类新的属性。
     * 如已经有该属性，则不会重复添加。
     * @param {Unit} unit 
     * @param {string} attrType 属性类型
     * @param {number} value 可选，在创建时赋予属性固定初始值
     */
    addAttrByType(unit,attrType,value){
        if(UnitController.hasAttr(unit,attrType))return;
        UnitController._addAttrByType(unit,attrType,value);
    },
    /**
     * @private
     * 给某对象添加相应类新的属性。
     * @param {Unit} unit 
     * @param {string} attrType 属性类型
     * @param {number} value 可选，在创建时赋予属性固定初始值
     */
    _addAttrByType(unit,attrType,value){
        let config=AttrController.getConfigByTypename(attrType);
        if(config){
            let attr=AttrController.createByConfig(config);
            if(typeof(value)=="number")AttrController.setValue(attr,value);
            UnitController._addAttr(unit,attr);
        }
    },

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Unit.Config} config 配置
     * @return {Unit}
     */
    _createByConfig(config) {
        let unit = new Unit();
        this.initByConfig(unit, config);
        return unit;
    },

    /**
     *每度过一天，根据属性的变化量刷新属性的值
     * @param {Unit} unit
     */
    pass(unit) {
    },

    /**
     * 从一个配置集合中加载所有的配置
     * @param {string} configUrl 配置集合
     */
    _loadConfigAsset(configUrl) {
        //加载对象配置 图片资源集
        cc.loader.loadRes("unit/" + configUrl, cc.SpriteAtlas,function (event, data) {
            //加载 对象配置数据
            if (data) {
                this.context.unitConfigAtlas=data;
                cc.loader.loadRes("unit/" + configUrl + ".config", function (event, data) {
                    if (data) {
                        this._loadConfigs(data);
                        this.context.Maid.pushEvent("unitConfigAssetLoaded" + configUrl, data);
                    }
                }.bind(this));
            }
        }.bind(this));
    },

    _loadConfigs(configAsset) {
        configAsset.forEach(function(elem){
            UnitController.registConfig(elem);
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
     * @param {Unit} unit 目标对象
     * @param {number} x 
     * @param {number} y 
     */
    setTilePos(unit,x,y){
        unit.pos.x=x;
        unit.pos.y=y;
        this.context.Maid.pushEvent("unitPosChanged",unit);
    },

    /**
     * 根据目标对象现有的 tilepos，
     * 刷新目标对象的 relpos
     * @param {Unit} unit 
     */
    refreshObjPosition(unit){
        let config=UnitController.getConfig(unit)
        let position =UnitController.getObjPositionAt(unit.pos,config);
        unit.node.position=position;
    },
    /**
     *  根据对象的配置获取对象的相对位置 relpos
     * @param {cc.Vec2} tilepos 地图位置
     * @param {Unit.Config} unitConfig 对象类型
     * @return {cc.Vec2} relpos
     */
    getObjPositionAt(tilepos,unitConfig){
        let offset=unitConfig && unitConfig.offset;
        let ret= PosController.tile2rel(tilepos);
        return offset? ret.add(cc.v2(offset[0],offset[1])):ret;
    },
}
UnitController.registConfig(new Unit.Config());
UnitController.setDefaultConfig("default");
module.exports = UnitController;