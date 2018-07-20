var Object=require("Object");
var PObject=require("PObject");
var Stage=cc.Class({
    
    statics:{
        Config:cc.Class({
            name:"StageConfig",
            extends: PObject,
            properties:{
                index:1000,
                type:-1,
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
                source:[]
            }

        })
    },
    name:"Stage",
    extends:PObject,
    //fixme
    properties: {
        type:-1,
        objects:[Object],
        /**
         * 游戏主人公所属阵营
         */
        hero:-1
    },
    /**
     *通过一个配置初始化一个实例
     *
     * @param {Stage.Config} config
     */
    _initByConfig(config){

    },
});
module.exports=Stage;