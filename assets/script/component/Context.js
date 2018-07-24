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
var temp = {
    mapViewpointDelta: cc.v2(0, 0)
};
/**
 * 应用程序的上下文组件，
 * 持有整个应用的重要部件，
 * 并作为游戏主循环的入口
 */
var Context = cc.Class({
    extends: cc.Component,

    properties: {
        Maid: null,
        viewRect: cc.Vec2,
        stageSelectorNode: {
            default: null,
            type: cc.Node
        },

        //纹理地图，指向游戏的地图组件
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
        objMapLayer: {
            default: null,
            type: cc.TiledLayer,
        },
        objLayers:[cc.Node],
        tileSize: cc.Vec2,
        //纹理地图中的地块横纵数量
        tileAmount: cc.Vec2,

        objConfigAtlas: {
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
        this.tiledMapNode.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            //是否处于场景内
            if (this.Maid.isInStage()) {
                cc.pAddIn(temp.mapViewpointDelta, event.getDelta().neg());
                temp.onTouch = true;
            }
        }.bind(this));
    },
    onDestroy() {
        Maid.exit(this);
    },

    update(dt) {
        Maid.update(this, dt);
        if (this.Maid.isInStage()) this._updateMapViewpoint(dt);
    },

    _updateMapViewpoint(dt) {
        //根据 积累的用户触摸偏移量，计算偏移速度
        if (temp.onTouch) {
            this.mapViewpointSpeed = cc.pMult(temp.mapViewpointDelta, 1 / dt);
            temp.mapViewpointDelta = cc.v2(0, 0);
            let plength=cc.pLength(this.mapViewpointSpeed)
            //限速
            if (plength > 2000) {
                cc.pMultIn(this.mapViewpointSpeed, 2000 / plength);
            }else if(plength <200){
                cc.pMultIn(this.mapViewpointSpeed, 200 / plength);
            }
        }
        //速度过小时，将其忽略
        if (cc.pLength(this.mapViewpointSpeed) < 1) return;
        //根据速度，执行视图的位移
        let newViewpoint = null;
        while(!newViewpoint ||!cc.rectContainsPoint(this.mapViewpointBorder, newViewpoint)) {
            newViewpoint = cc.pAdd(this.mapViewpoint, cc.pMult(this.mapViewpointSpeed, dt));
            //减速
            this.mapViewpointSpeed = cc.pMult(this.mapViewpointSpeed, 0.92);
        }
        //视图点已经在安全界限之内
        this.mapViewpoint = newViewpoint;
        temp.onTouch = false;
    },
});
module.exports = Context;