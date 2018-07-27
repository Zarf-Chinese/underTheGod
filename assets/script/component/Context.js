// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var Maid = require("../base/Maid");
/**
 * 应用程序的上下文组件，
 * 持有整个应用的重要部件，
 * 并作为游戏主循环的入口
 */
var Context = cc.Class({
    extends: cc.Component,

    properties: {
        Maid: null,
        viewRect: cc.Rect,
        stageSelectorNode: {
            default: null,
            type: cc.Node
        },

        //纹理地图，指向游戏的地图节点
        tiledMapNode: {
            default: null,
            type: cc.Node
        },
        mapViewpointSpeed: cc.v2(0, 0),
        mapViewpoint: {
            default: cc.v2(0, 0),
            notify() {
                this.camera.node.position = this.mapViewpoint;
            },
        },
        mapViewpointBorder: cc.Rect,
        camera: {
            default: null,
            type: cc.Camera,
        },
        baseMapLayer: {
            default: null,
            type: cc.TiledLayer
        },
        //特指地图中的对象层组件
        unitMapLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        unitLayers: [cc.Node],
        tileSize: cc.Vec2,
        //纹理地图中的地块横纵数量
        tileAmount: cc.Vec2,
        mapSize:cc.Vec2,
        mapOffset:cc.Vec2, //mappos 相对 _mappos 的偏移量
        tileOffset:cc.Vec2, //tilepos(0,0) 的中心相对 mappos左上角 的偏移量
        unitConfigAtlas: {
            default: null,
            type: cc.SpriteAtlas
        }

    },

    start() {
        let visibleOrigin = cc.director.getVisibleOrigin();
        let visibleSize = cc.director.getVisibleSize();
        this.viewRect = cc.rect(visibleOrigin.x, visibleOrigin.y, visibleSize.width, visibleSize.height);
        this.Maid = Maid;
        Maid.start(this);
    },
    onDestroy() {
        Maid.exit(this);
    },

    update(dt) {
        Maid.update(this, dt);
    },
});
module.exports = Context;