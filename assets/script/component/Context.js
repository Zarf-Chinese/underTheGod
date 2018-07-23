// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Maid=require("../base/Maid");

/**
 * 应用程序的上下文组件，
 * 持有整个应用的重要部件，
 * 并作为游戏主循环的入口
 */
var Context=cc.Class({
    extends: cc.Component,

    properties: {
        Maid:null,
        stageSelectorNode:{
            default:null,
            type:cc.Node
        },

        //纹理地图，指向游戏的地图组件
        tiledMap:{
            default:null,
            type:cc.TiledMap,
            notify(old){
                if(this.tiledMap){
                    if(old!=this.tiledMap)Maid.pushEvent("tiledMapResetted");
                }
                else Maid.pushEvent("tiledMapCleared");
            },
        },
        //特指地图中的对象层节点
        objMapNode:{
            default:null,
            type:cc.Node,
        },
        //纹理地图中的地块横纵数量
        tileAmount:cc.Vec2,

        objConfigAtlas:{
            default:null,
            type:cc.SpriteAtlas
        }
        
    },

    start () {
        this.Maid=Maid;
        Maid.start(this);
    },
    onDestroy(){
        Maid.exit(this);
    },

    update (dt) {
        Maid.update(this,dt);
    },
});
module.exports=Context;