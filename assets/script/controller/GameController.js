var Game = require("../PObject/Game");

/**
 * 游戏控制器，
 * 由于不需要通过配置来生成游戏，顾不需要继承 Controller
 * Maid（游戏的核心管理）持有当前的游戏实例，并通过GameController 来实现对游戏的控制
 */
var GameController = {
    Type:Game,
    context:null,

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
    getStageConfig(game,stageIndex){
        return game.stageConfigs.find((v,i)=>{
            return v.index==stageIndex;
        },this);
    },

    /**
     * 准备选择场景
     * 根据游戏数据和原生场景配置，在该节点中添入诸多场景选项
     * 以供玩家进入某场景
     * @param {Game} game 
     */
    getReadyToSelectStage(game) {
        //获取选择场景的控件节点，其应该内置了一个 stageSelector 组件
        let stageSelectorNode=this.context.stageSelectorNode;
        let stageSelector = stageSelectorNode.getComponent("stageSelector")
        if (!stageSelector) return;
        {
            game.stageConfigs.forEach(stageConfig => {
                stageSelector.pushStageSelection(stageConfig);
            });
        }
    },

    


}
module.exports = GameController;