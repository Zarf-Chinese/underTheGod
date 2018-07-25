var Stage = require("../PObject/Stage")
var Controller = require("../base/Controller");
var ObjectController = require("./ObjectController");
var AttrController = require("./AttrController")
var Util = require("../util/util")
var StageController = {
    context: null,
    __proto__: Controller,
    Type: Stage,//控制目标类型

    configs: [],//类型配置集，内含一个默认类型配置

    default: "default",//默认类型配置名

    /**
     *通过一个配置初始化一个实例
     * @attention 该初始化函数使用异步加载的方法，在加载完成后会触发 "stageReadyToEnter" 事件，注意接收。
     * @param {Stage} stage
     * @param {Stage.Config} config
     */
    initByConfig(stage, config) {
        /**
         * Stage.Config 与 一个 正常的 stage data 有许多重合的地方，
         * 可以使用config 作为数据，初步初始化一个场景
         */
        Stage.load(stage, config);
        //在进入场景时，执行更多加载任务
        this.context.Maid.listenToEvent("enterStage" + config.index, function () {
            this.context.Maid.listenToEvent("attrConfigAssetLoaded" + config.attrAsset, function () {
                //为场景加载对象配置后，执行生成对象等任务
                this.context.Maid.listenToEvent("objConfigAssetLoaded" + config.objectAsset, function () {
                    if (config.csv) {
                        //若 csv存在，则试图从csv 中为场景添入自动化生成的对象
                        //csv 加载完成后，为 场景添入对象
                        this.context.Maid.listenToEvent("csvLoaded" + config.csv, function (data) {
                            if (data) {
                                //get objects from csv
                                this.addObjectsFromCsv(stage, data);
                            }
                            //完成加载场景
                            this.context.Maid.pushEvent("stageReadyToEnter");
                            return true;
                        }.bind(this), 1);
                        //加载 csv 文件，并触发事件
                        cc.loader.loadRes("stage/" + config.csv, function (event, data) {
                            this.context.Maid.pushEvent("csvLoaded" + config.csv, data);
                        }.bind(this));
                    } else {
                        //完成加载场景
                        this.context.Maid.pushEvent("stageReadyToEnter");
                    }
                    return true;
                }.bind(this), 1);
                //加载 场景所需的对象配置
                ObjectController.reloadConfig(config.objectAsset);
                return true;
            }.bind(this), 1);
            AttrController.loadConfig(config.attrAsset);
        }.bind(this), 1)



    },

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Stage.Config} config 配置
     * @return {Stage}
     */
    _createByConfig(config) {
        let stage = new Stage();
        this.initByConfig(stage, config);
        return stage;
    },

    /**
     *每度过一天，更新场景内的所有物件及其属性
     * @param {Stage} stage
     */
    pass(stage) {
        //fixme
    },

    /**
     * 从目标场景中获取目标场景的信息标识（会显示到游戏界面上）
     * @param {Stage} stage 目标场景
     */
    getInformation(stage) {
        return stage.name;
    },

    /**
     * 根据csv数据为目标场景添加对象，
     * csv格式：
     * ```
     * "3,2/3,5/2\n1,4,7\n3,6/2,4"
     * 同一地块的不同对象以   /     分隔
     * 同一行的不同地块以     ,     分隔
     * 同一场景的不同行以     \n    分隔
     * ```
     * @param {Stage} stage 目标场景
     * @param {string} csv csvData
     */
    addObjectsFromCsv(stage, csv) {
        let data = Util.data.getDataFromCSV(csv, function (data) { if (data) return Number.parseInt(data) }, '\n', ',', '/')
        //考虑到 csv 中的对象横纵限制数量与csv对象横纵限制数量不符的情况，这里先将多有对象全部加载，之后再在加载地图时忽略、删去部分对象数据
        for (let _y = 0; _y < data.length; _y++) {
            let row = data[_y];
            if (row && !Util.array.isDeepEmpty(row))
                //如果 目标行存在 且 不为空
                for (let _x = 0; _x < row.length; _x++) {
                    let tileData = row[_x];
                    if (tileData && !Util.array.isDeepEmpty(tileData)) {
                        tileData.forEach(objType => {
                            StageController.addObjectByKey(stage, objType, _x, _y);
                        })
                    }
                }
        }
        /* for (let _y = 0; _y < this.context.tileAmount.y; _y++) {
            let row = data[_y];
            if (row && !Util.array.isDeepEmpty(row))
                //如果 目标行存在 且 不为空
                for (let _x = 0; _x < this.context.tileAmount.x; _x++) {
                    let tileData = row[_x];
                    if (tileData && !Util.array.isDeepEmpty(tileData)) {
                        tileData.forEach(objType => {
                            StageController.addObjectByKey(objType, _x, _y);
                        })
                    }
                }
        } */
    },
    /**
     * 在某位置上根据一个已注册过的对象类型添入一个对象
     * fixme 考虑国别
     * @param {Stage} stage 目标场景
     * @param {number} objKey 所需添入的对象的键值
     * @param {number} x 添入位置x
     * @param {number} y 添入位置y
     */
    addObjectByKey(stage, objKey, x, y) {
        let object = ObjectController.createByKey(objKey);
        if (object) {
            ObjectController.setTilePos(object, x, y);
            StageController.addObject(stage, object);
        }
    },

    /**
     * 给目标场景添加一个对象 
     * @param {Stage} stage 目标场景
     * @param {Object} object 要被添加的对象
     */
    addObject(stage, object) {
        //fixme 检查是否出现了同类对象位置重合的情况
        stage.objects.push(object);
    },

    /**
     * 加载目标场景的地图，
     * 会触发 ("mapLoaded")的事件，并传入目标 stage 作为参数，请注意接收
     * @param {Stage} stage 
     */
    loadMap(stage) {
        cc.loader.loadRes("map/" + stage.map, cc.TiledMapAsset, function (event, tmxAsset) {
            if (tmxAsset) {
                let map = this.context.tiledMapNode.getComponent(cc.TiledMap);
                map.tmxAsset = tmxAsset;
                this.refreshMapAsset(stage);
                this.context.Maid.pushEvent("mapLoaded", stage);
            }
        }.bind(this))
    },

    /**
     * 刷新 瓦片地图配置数据，
     * 根据瓦片地图，重置部分环境参数
     */
    refreshMapAsset(stage) {
        let mapNode = this.context.tiledMapNode;
        let map = mapNode.getComponent(cc.TiledMap);
        this.context.tileAmount = cc.pFromSize(map.getMapSize());
        this.context.baseMapLayer = map.getLayer("terrain");
        this.context.tileSize = cc.pFromSize(map.getTileSize())
        this.context.objMapLayer = map.getLayer("object");
        let boundingBox=map.node.getBoundingBoxToWorld();
        this.context.mapViewpointBorder=cc.rect(boundingBox.x+stage.offset.x,boundingBox.y+stage.offset.y,
            boundingBox.width-this.context.viewRect.width,boundingBox.height-this.context.viewRect.height);
        //由于 初始化时，tiledmap 处于屏幕中央，故无需设置初始视图点
        //this.context.mapViewpoint=cc.pMult(cc.pFromSize(map.node.getContentSize()),0.5);
        console.log(this.context)
    },
}
StageController.registConfig(new Stage.Config());
StageController.setDefaultConfig("default");
module.exports = StageController;