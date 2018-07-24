var Game = require("../PObject/Game");
var StageController = require("./StageController");
var ObjectController = require("./ObjectController")
/**
 * 游戏控制器，
 * 由于不需要通过配置来生成游戏，顾不需要继承 Controller
 * Maid（游戏的核心管理）持有当前的游戏实例，并通过GameController 来实现对游戏的控制
 */
var GameController = {
    Type: Game,
    context: null,

    /**
     * 进入目标游戏
     * 将经过反序列化后所得到的数据信息填充到 view 层
     * @param {Game} game 目标游戏
     */
    start(game) {
        game._start();
    },
    /**
     * 退出目标游戏，将所有资源、数据信息从 view 层抽出，
     * 以便将游戏实例序列化
     * @param {Game} game 目标游戏
     * @param context 应用程序的上下文组件
     */
    exit(game, context) {
        game._exit();
    },

    /**
     * 根据游戏某个场景的序号获取该场景配置
     * 游戏存储了若干场景配置，同时最多持有一个活动的场景实例。
     * @param {Game} game 目标游戏
     * @param {number} stageIndex 场景序号
     */
    getStageConfig(game, stageIndex) {
        return game.stageConfigs.find((v, i) => {
            return v.index == stageIndex;
        }, this);
    },

    /**
     * 准备选择场景
     * 根据游戏数据和原生场景配置，在该节点中添入诸多场景选项
     * 以供玩家进入某场景
     * @param {Game} game 
     */
    getReadyToSelectStage(game) {
        //获取选择场景的控件节点，其应该内置了一个 stageSelector 组件
        let stageSelectorNode = this.context.stageSelectorNode;
        let stageSelector = stageSelectorNode.getComponent("stageSelector")
        if (!stageSelector) return;
        {
            game.stageConfigs.forEach(stageConfig => {
                stageSelector.pushStageSelection(stageConfig);
            });
        }
    },
    /**
     * 进入目标场景。
     * 游戏只能同时进入一个场景，
     * 若之前已经处在某一个场景中，则会先退出该场景
     * @param {Game} game 目标游戏
     * @param {number} id 目标场景的 id
     */
    enterStageById(game, id) {
        //ImproveMe 后期可以加入切换画面
        //fixme 退出之前的场景
        let stage = StageController.createByConfig(GameController.getStageConfig(game, id));
        this.context.Maid.listenToEvent("stageReadyToEnter", function () {
            GameController._enterStage(game, stage)
        }, 1)
        this.context.Maid.pushEvent("enterStage" + id);
    },
    /**
     * 正式进入一个场景，
     * 这个场景应该是一个彻底加载完成，直接可用的场景，
     * 此时游戏内不应该有其他场景存在
     * @param {Game} game 目标游戏
     * @param {stage} stage 目标场景
     */
    _enterStage(game, stage) {
        this.context.Maid.listenToEvent("mapLoaded", function (_stage) {
            //加载完成地图之后...
            if (_stage !== stage) return false;
            game.isPlaying = true;
            console.log(stage);
            //注册一个 添加对象图层 的事件监听器 , 以准备添入所有被注册的对象层
            this.context.Maid.listenToEvent("newObjLayerAdded", function (zOrder) {
                this.context.objMapLayer.node.addChild(ObjectController.getObjectLayerByZOrder(zOrder));
                return true;
            }.bind(this));
            //注册一个 改变对象位置 的事件监听器 ，以准备设置对象节点的像素位置
            this.context.Maid.listenToEvent("objPosChanged",function(object){
                //fixme set object position
                return true;
            }.bind(this));
        }.bind(this), 1);
        StageController.loadMap(stage);

    },

    isPlaying(game) {
        return game.isPlaying;
    }




}
module.exports = GameController;