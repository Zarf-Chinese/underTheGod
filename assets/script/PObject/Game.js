var PObject=require("PObject");
var Stage=require("Stage");
/**
 * 游戏实例，保持有整个游戏的所有数据
 * 应当由 Maid 生成，由 GameController 直接控制
 */
var Game=cc.Class({
    
    statics:{
        Config:cc.Class({
            name:"GameConfig",
            extends: PObject,
            properties:{
                stages:[]
            }

        })
    },
    name:"Game",
    extends:PObject,
    //fixme
    properties: {
        //stageConfigs:[Stage.Config],
    },
    _load(data){
        this.stageConfigs=[];
        if(data.hasOwnProperty("stageConfigs")){
            data.stageConfigs.forEach(stageConfigData => {
                this.stageConfigs.push(PObject.create(Stage.Config,stageConfigData))
            });
        }
    },
    _save(){
        let ret={};
        ret.stageConfigs=[];
        this.stageConfigs.forEach(stageConfig=>{
            ret.stageConfigs.push(PObject.save(stageConfig));
        })
        return ret;
    },
    /**
     * 开始游戏
     */
    _start(){

    },
    /**
     * 退出游戏
     */
    _exit(){
        //exit current Stage();
    },
});
module.exports=Game;