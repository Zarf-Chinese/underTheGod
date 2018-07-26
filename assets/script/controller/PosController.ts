export module PosController{
    export var context;
    export function touch2cam(touchpos:cc.Vec2):cc.Vec2{
        return cc.pAdd(touchpos.add(context.viewRect),cc.v2(context.viewRect.width/2,context.viewRect.height/2));
    }
    export function touch2rel(touchpos:cc.Vec2):cc.Vec2{
        let ret=cc.pAdd(touchpos,cc.v2(context.viewRect.x+context.viewRect.width/2,context.viewRect.y+context.viewRect.height/2).neg());
        ret.addSelf(context.mapViewpoint);
        return ret;
    }
    export function map2_map(mappos:cc.Vec2):cc.Vec2{
        return cc.pAdd(mappos,context.mapOffset);
    }
    export function _map2map(_mappos:cc.Vec2):cc.Vec2{
        return cc.pAdd(_mappos,context.mapOffset.neg());
    }
    export function rel2_map(relpos:cc.Vec2):cc.Vec2{
        return relpos.add(context._mapSize.mul(0.5))
    }
    export function _map2_rel(_mappos:cc.Vec2):cc.Vec2{
        return _mappos.add(context._mapSize.mul(-0.5))
    }
    export function rel2map(relpos:cc.Vec2):cc.Vec2{
        let ret=_map2map(rel2_map(relpos));
        return ret;
    }
    export function map2rel(mappos:cc.Vec2):cc.Vec2{
        let ret=_map2_rel(map2_map(mappos));
        return ret;
    }
    export function map2ter(mappos:cc.Vec2):cc.Vec2{
        //(10,2240)
        let ret=cc.v2(mappos.x,context.mapSize.y-mappos.y);
        //(10,10)
        ret.addSelf(context.tileOffset.neg());
        //(-20,-10)
        return ret;
    }
    export function ter2map(terpos:cc.Vec2):cc.Vec2{
        //(0,0)
        let ret=cc.v2(terpos.x,context.mapSize.y-terpos.y);
        //(0,2250)
        ret.addSelf(context.tileOffset);
        //(30,20)
        return ret;
    }
    /**
     * boxpos:将地图分隔为若干小份，以近似得到该坐标近似所处在的地块坐标
     * @param terpos 
     * @returns boxpos
     */
    export function ter2box(terpos:cc.Vec2):cc.Rect{
        let ret=cc.rect(Math.floor(terpos.x/context.boxSize.x) ,Math.floor(terpos.y/context.boxSize.y),terpos.x%context.boxSize.x,terpos.y%context.boxSize.y); 
        return ret;
    }
    export function box2ter(boxpos:cc.Rect):cc.Vec2{
        let ret=cc.v2(boxpos.x*context.boxSize.x+boxpos.width,boxpos.y*context.boxSize.y+boxpos.height);
        console.log("box2ter"+ret);
        return ret;
    }
    export function touch2tile(touchpos:cc.Vec2):cc.Vec2{
        return ter2tile(map2ter(rel2map(touch2rel(touchpos))))
    }
    export function ter2tile(terpos:cc.Vec2):cc.Vec2{
        return box2tile(ter2box(terpos));
    }
    /**
     * 获取地块中心的原始地图位置
     * @param tilepos 
     * @returns 中心 _mappos 
     */
    export function tile2_map(tilepos:cc.Vec2):cc.Vec2{
        return context.baseMapLayer.getPositionAt(tilepos)
    }
    /**
     * 获取地块中心的相对位置
     * @param tilepos 
     * @returns 中心 relpos 
     */
    export function tile2rel(tilepos:cc.Vec2):cc.Vec2{
        let ret= _map2_rel(tile2_map(tilepos)).add(context.tileSize.mul(0.5));
        return ret;
    }
    export function box2tile(boxpos:cc.Rect):cc.Vec2{
        let deltapos=cc.pFromSize(boxpos)
        let ret=cc.v2();
        if((boxpos.x+boxpos.y)%2){ 
            //odd 
            var p0=cc.v2(0,context.boxSize.y); 
            var p1=cc.v2(context.boxSize.x,0); 
            var _y=[1,0]
        }else 
        { 
            //even 
            var p0=cc.v2(0,0); 
            var p1:cc.Vec2=context.boxSize; 
            var _y=[0,1];
        } 
        //判断 更接近的一边 
        let dist_0=cc.pDistance(p0,deltapos); 
        let dist_1=cc.pDistance(p1,deltapos); 
        let _near=dist_0<dist_1; 
        if(boxpos.x%2){ 
            ret.x=(boxpos.x+(_near?-1:1))/2 
        }else 
        { 
            ret.x=boxpos.x/2 
        } 
        ret.y=boxpos.y+(_near?_y[0]:_y[1]);
        //安全检查 
        ret.x=ret.x>=0?ret.x:0; 
        ret.y=ret.y>=0?ret.y:0; 
        ret.x=ret.x<=context.tileAmount.x?ret.x:context.tileAmount.x; 
        ret.y=ret.y<=context.tileAmount.y?ret.y:context.tileAmount.y; 
        return ret;
    }
}