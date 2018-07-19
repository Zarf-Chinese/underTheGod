var Game = require("../PObject/Game");

/**
 * 游戏控制器，
 * 由于不需要通过配置来生成游戏，顾不需要继承 Controller
 * Maid（游戏的核心管理）持有当前的游戏实例，并通过GameController 来实现对游戏的控制
 */
var GameController={

    /**
     * 进入目标游戏
     * 将经过反序列化后所得到的数据信息填充到 view 层
     * @param {Game} game 目标游戏
     */
    start(game){
        game._start();
    },
    /**
     * 退出目标游戏，将所有资源、数据信息从 view 层抽出，
     * 以便将游戏实例序列化
     * @param {Game} game 目标游戏
     */
    exit(game){
        game._exit();
    },
}
module.exports=GameController;