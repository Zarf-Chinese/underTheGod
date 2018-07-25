var Object=require("./Object");
var PObject=require("PObject");
var Stage=cc.Class({
    
    statics:{
        //对于stage 来说， 配置是不必要的。 这个 stage 有可能 由一个配置生成 也有可能由一个 游戏记录生成
        Config:cc.Class({
            name:"StageConfig",
            extends: PObject,
            properties:{
                offset:cc.Vec2,
                index:1000,
                type:-1,
                attrAsset:null,
                objectAsset:null,
                name:"default",
                /**
                 * 记录了基本的游戏对象，但并不记录游戏对象的属性的具体数值。
                 * 这些游戏对象的属性将根据属性的配置而随机确定
                 */
                csv:"test",
                /**
                 * 游戏所使用的地图
                 */
                map:"default",
                /**
                 * 非随机生成的游戏对象数据，记录了关于这个对象的所有属性
                 */
                objects:[]
            }

        })
    },
    name:"Stage",
    extends:PObject,
    //fixme
    properties: {
        type:-1,
        attrAsset:null,
        objectAsset:null,
        objects:[Object],
        map:null,
        offset:{
            default:cc.v2(0,0),
        },
        /**
         * 游戏主人公所属阵营
         */
        hero:-1
    },

    _load(data){
        this.type=data.type;
        this.objects=[];
        if(data.hasOwnProperty("objects")){
            data.objects.forEach(objectData => {
                this.objects.push(PObject.create(Object,objectData))
            });
        }
        this.objectAsset=data.objectAsset;
        this.attrAsset=data.attrAsset;
        this.map=data.map;
        this.offset=data.offset||this.offset
    },
    _save(){
        let ret={};
        ret.type=this.type;
        ret.objects=[];
        this.objects.forEach(object=>{
            ret.objects.push(PObject.save(object));
        })
        ret.objectAsset=this.objectAsset;
        ret.attrAsset=this.attrAsset;
        ret.map=this.map;
        ret.offset=this.offset;
        return ret;
    }
});
module.exports=Stage;