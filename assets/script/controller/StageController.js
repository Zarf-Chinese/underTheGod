var Stage = require("../PObject/Stage")
var Controller = require("../base/Controller");
var Util=require("../util/util")
var StageController = {
    context: null,
    __proto__: Controller,
    Type: Stage,//控制目标类型

    configs: [],//类型配置集，内含一个默认类型配置

    default: "default",//默认类型配置名

    /**
     *通过一个配置初始化一个实例
     * @attention 该初始化函数使用异步加载的方法，在加载完成后会触发 "stageLoaded" 事件，注意接收。
     * @param {Stage} stage
     * @param {Stage.Config} config
     */
    initByConfig(stage, config) {
        /**
         * Stage.Config 与 一个 正常的 stage data 有许多重合的地方，
         * 可以使用config 作为数据，初步初始化一个场景
         */
        Stage.load(stage, config);
        if (config.csv) {
            //若 csv存在，则试图从csv 中为场景添入自动化生成的对象
            this.context.Maid.listenToEvent("csvLoaded", function (data) {
                if (data) {
                    //get objects from csv
                    this.addObjectsFromCsv(stage, data);
                }
                //加载完成
                this.context.Maid.pushEvent("stageLoaded");
                return true;
            }.bind(this), 1);
            cc.loader.loadRes("stage/"+config.csv, function (event, data) {
                this.context.Maid.pushEvent("csvLoaded", data);
            }.bind(this));
        }else
        {
            //加载完成
            this.context.Maid.pushEvent("stageLoaded");
        }
        
    },

    /**
     * 根据一个属性的配置创建一个属性实例
     * @param {Stage.Config} config 配置
     * @return {Stage}
     */
    _createByConfig(config) {
        let stage = new Stage();
        this.initByConfig(stage, config);
        return stage;
    },

    /**
     *每度过一天，更新场景内的所有物件及其属性
     * @param {Stage} stage
     */
    pass(stage) {
        //fixme
    },

    /**
     * 从目标场景中获取目标场景的信息标识（会显示到游戏界面上）
     * @param {Stage} stage 目标场景
     */
    getInformation(stage) {
        return stage.name;
    },

    /**
     * 根据csv数据为目标场景添加对象，
     * csv格式：
     * ```
     * "3,2/3,5/2\n1,4,7\n3,6/2,4"
     * 同一地块的不同对象以   /     分隔
     * 同一行的不同地块以     ,     分隔
     * 同一场景的不同行以     \n    分隔
     * ```
     * @param {Stage} stage 目标场景
     * @param {string} csv csvData
     */
    addObjectsFromCsv(stage, csv){
        let data=Util.data.getDataFromCSV(csv,function(data){if(data)return Number.parseInt(data)},'\n',',','/')
        //fixme add objects
    }
}
StageController.registConfig(new Stage.Config());
StageController.setDefaultConfig("default");
module.exports = StageController;