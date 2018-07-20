var Stage=require("../PObject/Stage")
var Controller=require("../base/Controller");

var StageController={
    __proto__:Controller,
    Type:Stage,//控制目标类型
    
    configs:[],//类型配置集，内含一个默认类型配置
    
    default:"default",//默认类型配置名

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Stage.Config} config 配置
     * @return {Stage}
     */
    _createByConfig(config){
        //fixme
    },

    /**
     *每度过一天，更新场景内的所有物件及其属性
     * @param {Stage} stage
     */
    pass(stage){
        //fixme
    },

    /**
     * 从目标场景中获取目标场景的信息标识（会显示到游戏界面上）
     * @param {Stage} stage 目标场景
     */
    getInformation(stage){
        return stage.name;
    },
}
StageController.registConfig(new Stage.Config());
StageController.setDefaultConfig("default");
module.exports=StageController;