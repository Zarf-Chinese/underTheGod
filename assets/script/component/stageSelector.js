var GameController=require("../controller/GameController")
var StageController=require("../controller/StageController")
var Maid=require("../base/Maid")
var StageSelector = cc.Class({
    extends: cc.Component,

    properties: {
        selPrefab: {
            default: null,
            type: cc.Prefab,
        },
        selections: []
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },
    onLoad(){
    },

    /**
     * 通过一个场景配置的id，添入一个场景选项
     * 这个场景配置可能是一个标准的场景原型配置，也可能是过去玩过的场景记录
     * 在 UTG 中，场景记录（游戏记录）和原型是具有同等意义的，从序列化的格式到处理方法都是一致的。
     * 只不过游戏原型存储在stage.config.json文件中，而场景记录的配置存储在用户信息中
     * @param {number} stageIndex 场景序号
     */
    pushStageSelection(stageIndex) {
        let selection = cc.instantiate(this.selPrefab)
        if (this.initSelection(selection, stageIndex))
            this.node.addChild(selection);
    },
    /**
     * 通过 场景配置的序号 来初始化一个选项按钮
     * 点击选项按钮所在节点即可进入 该场景
     * @param {cc.Node} selectionNode
     * @param {number} id 场景配置的序号
     */
    initSelection(selectionNode, id) {
        /**
         * 通过 Maid 管理器获取游戏实例，再通过游戏控制器获取目标 stage 的信息
         * 如果未找到该实例，则失败
         * 使 selectionNode 内部的 label 标注场景信息
         */
        let stage = GameController.getStage(Maid.game, id)
        if (!stage) return false;
        selectionNode.getComponent(cc.Label).string = StageController.getInformation(stage);
        /* 
        selectionNode 内部预置了一个空的 cc.Button 组件
        给该组件绑定 select 函数
        使点击 selectionNode 时，进入该场景 
        */
        var eventHandler = new cc.Component.EventHandler()
        eventHandler.target=this.node;
        eventHandler.component="stageSelector";
        eventHandler.handler="_selectCallback";
        eventHandler.customEventData=id
        selectionNode.getComponent(cc.Button).clickEvents.push(eventHandler)
        return true;
    },
    //选择某场景的回调函数
    _selectCallback(event,id){this.select(id);},
    /**
     * 根据场景的id 选择进入该场景
     * @param {string} id 场景id
     */
    select(id) {
        //fixme
        console.log("entering... : " + id)
    },
});
