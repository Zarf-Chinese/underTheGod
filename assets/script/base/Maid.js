/**
 * 全局事件列表：
 * newObjLayerAdded
 * objPosChanged
 * tileSelected
 * dayPassed
 */


var EventLisener = function (key, callback, life) {
    this.key = key;
    this.callback = callback;
    this.life = life;
}
var Event = function (key, arg) {
    this.key = key;
    this.arg = arg;
}
var GameDataItem = "test";
var PObject = require("./PObject")
var StageController= require("../controller/StageController")
var GameController = require("../controller/GameController")
var ObjectController=require("../controller/ObjectController")
var AttrController=require("../controller/AttrController")
var SeleController=require("../controller/SeleController").SeleController;
var PosController=require("../controller/PosController").PosController;
/**
 * @SingleInstance
 * @Controller
 * 整个程序的核心管理器
 * @Usages
 * ```
 * 处理游戏公开事件
 * 掌握游戏循环进程
 * 初始化用户交互的核心功能
 * ```
 * @example
 * ``` js
 * //init
 * Maid.init();
 * Maid.listenToEvent(key,callback,wait)
 * //update
 * while(true){
 *  Maid.update(dt);
 * }
 * //push event
 * Maid.pushEvent(key,...arg)
 * 
 * ```
 * 
 * @ImproveMe
 * ```
 * 由于本程序涉及基本面较少，仅需要一个核心管理器实例即可，
 * 这里没有必要使用接口模式，亦或多重拆分解耦。
 * 但一个大型项目还是需要多种 Controller / Maid 协作控制
 * ```
 */
var Maid = {
    value:{
        accelerate:0.95,
        clickIntensity:1,
        onTouch:false,
        mapViewpointDelta: cc.v2(0, 0)
    },
    game: null,
    pushedEvents: [],
    eventlisteners: [],
    defaultGameDataUrl: "",

    /**
     * 开始整个应用，读取用户数据并创建游戏
     * @param context 应用的上下文组件
     */
    start(context) {
        //给予各类controller 赋予上下文
        PosController.context=context;
        AttrController.context=context;
        ObjectController.context=context;
        StageController.context=context;
        GameController.context=context;

        //注册 加载游戏数据完成后的回调函数
        this.listenToEvent("afterGameDataLoaded", function (gameData) {
            this.game = PObject.create(GameController.Type, gameData);
            GameController.start(this.game, context);
            GameController.getReadyToSelectStage(this.game);
            return true;
        }.bind(this),1);

        //加载游戏数据
        let gameData = JSON.parse(cc.sys.localStorage.getItem(GameDataItem));
        //若未能加载游戏数据，则尝试从 gameData.json 中新建一份默认的游戏数据
        gameData ? this.pushEvent("afterGameDataLoaded", gameData) :
            cc.loader.loadRes("gameData", function (event, data) { Maid.pushEvent("afterGameDataLoaded", data) });
        //初始化 地图交互
        this._readyToInteraction(context);

    },
    /**
     * 结束整个应用，结束当前游戏进程并存储用户数据
     * @param context 应用的上下文组件
     */
    exit(context) {
        GameController.exit(this, game);
        let gameData = PObject.save(this.game, context);
        cc.sys.localStorage.setItem(GameDataItem, gameData);
    },
    /**
     * 刷新 Maid 逻辑进程
     * @param context 应用的上下文组件
     * @param {number} dt 与上一次刷新之间的间隔时间
     */
    update(context, dt) {
        this.dealWithAllEvents();
        if (this.isInStage()) this._updateMapViewpoint(context,dt);
    },
    /**
     * 发布事件，支持给事件处理方法传递一个参数
     * @param {string} key 事件关键词
     * @param {any} arg 传给事件处理方法的一个参数
     */
    pushEvent(key, arg) {
        this.pushedEvents.push(new Event(key, arg));
        console.log("New event happedned : %s",key);
    },
    /**
     * 注册一个事件监听器
     * @param {string} key 事件的关键字
     * @param {(arg)=>boolean} callback 处理事件的方法，仅接受一个参数，返回是否彻底完成该事件的处理（返回true则会销毁该事件）
     * @param {number} life 可选，该监听器生效的次数
     */
    listenToEvent(key, callback, life) {
        this.eventlisteners.push(new EventLisener(key, callback, life));
        console.log("Add new listened event: %s",key);
    },
    /**
     * 根据事件的关键词获取与之相联系的所有监听器
     * @param {string} key 事件关键词
     */
    getEventListeners(key) {
        let ret = [];
        this.eventlisteners.forEach(eventListener => {
            if (eventListener.key === key)
                ret.push(eventListener)
        });
        return ret;
    },

    /**
     * 处理所有的事件
     */
    dealWithAllEvents() {
        for (let index = this.pushedEvents.length - 1; index >= 0; index--) {
            const event = this.pushedEvents[index];
            this.dealWithEvent(event);
        }
    },

    /**
     * 处理一个事件
     * @param {Event} event 要被处理的事件
     */
    dealWithEvent(event) {
        let listeners = this.getEventListeners(event.key)
        let over = false;
        for (let i = listeners.length-1; i >=0 ; i--) {
            const listener = listeners[i];
            let callable = true;
            //如果life是数字，则检查剩余有效次数。根据需要销毁监听器
            if (typeof(listener.life)=="number") {
                if (--listener.life <= 0) {
                    if (listener.life < 0){
                        //不执行监听器
                        callable = false;
                    }
                    //销毁监听器
                    this.eventlisteners.splice(this.eventlisteners.indexOf(listener),1);
                }
            }
            if (callable && listener.callback(event.arg)) {
                //判断：结束事件
                over = true;
                break;
            }

        }
        if (over) {
            //结束事件
            this.pushedEvents.splice(this.pushedEvents.indexOf(event),1);
        }
    },
    /**
     * 是否正在玩游戏（处于场景中）
     */
    isInStage(){
        return Maid.game && GameController.isPlaying(Maid.game);
    },

    /**
     * 初始化地图上的用户交互功能
     * @param {context} context 
     */
    _readyToInteraction(context) {
        context.tiledMapNode.on(cc.Node.EventType.TOUCH_START, function (event) { Maid.value.onTouch = true })
        context.tiledMapNode.on(cc.Node.EventType.TOUCH_END, function (event) { 
            //判断是否算一次点击
            let delta=cc.v2(event.getLocation()).add(cc.v2(event.getStartLocation()).neg()).mag();
            if(delta<Maid.value.clickIntensity){
                //使用这个绝对地图位置 来获取 地块位置
                Maid.pushEvent("tileSelected",PosController.touch2tile(event.getLocation()));
            } 
            Maid.value.onTouch = false; 
        })
        context.tiledMapNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            //是否处于场景内
            if (Maid.isInStage()) {
                cc.pAddIn(Maid.value.mapViewpointDelta, event.getDelta().neg());
            }
        });
    },
    _updateMapViewpoint(context,dt) {
        let newViewpoint = null;
        //根据 积累的用户触摸偏移量，计算偏移速度
        if (Maid.value.onTouch) {
            context.mapViewpointSpeed = cc.pMult(Maid.value.mapViewpointDelta, 1 / dt);
            Maid.value.mapViewpointDelta = cc.v2(0, 0);
        } else {
            let plength = cc.pLength(context.mapViewpointSpeed)
            //速度过小时，将其忽略
            if (plength < 1) return;
            //摩擦减速
            context.mapViewpointSpeed = cc.pMult(context.mapViewpointSpeed, Maid.value.accelerate);
            //限速
            if (plength > 2000) {
                cc.pMultIn(context.mapViewpointSpeed, 2000 / plength);
            }
        }
        //根据速度，执行视图的位移
        newViewpoint = cc.pAdd(context.mapViewpoint, cc.pMult(context.mapViewpointSpeed, dt));
        //边缘检查，防止视图移动到地图外
        while (!cc.rectContainsPoint(context.mapViewpointBorder, newViewpoint)) {
            //削减变化量，重新尝试
            context.mapViewpointSpeed = cc.pMult(context.mapViewpointSpeed, 0.1);
            newViewpoint = cc.pAdd(context.mapViewpoint, cc.pMult(context.mapViewpointSpeed, dt));
        }
        //视图点已经在安全界限之内
        context.mapViewpoint = newViewpoint;
    },

    /**
     * 根据上下文组件，初始化游戏事件监听器。
     * @param {context} context 
     */
    initGameListener(context){
        //注册一个 添加对象图层 的事件监听器 , 以准备添入所有被注册的对象层
        this.listenToEvent("newObjLayerAdded", function (zOrder) {
            let newLayer=ObjectController.getObjectLayerByZOrder(zOrder)
            context.objMapLayer.node.addChild(newLayer);
            return true;
        });
        //注册一个 改变对象位置 的事件监听器 ，以准备设置对象节点的像素位置
        this.listenToEvent("objPosChanged",function(object){
            ObjectController.refreshObjPosition(object)
            return true;
        });
        this.listenToEvent("tileSelected",function(pos){
            if(Maid.isInStage()){
                SeleController.pushSelection(pos);
            }
            return true;
        });
        this.listenToEvent("dayPassed",function(){
            //fixme pass one day;
            return true;
        });
    },
}
module.exports = Maid;