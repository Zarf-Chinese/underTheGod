
var StageSelector=cc.Class({
    extends: cc.Component,

    properties: {
        selPrefab:{
            default:null,
            type:cc.Prefab,
        },
        selections:[]
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    /**
     * 通过一个场景配置的id，添入一个场景选项
     * 这个场景配置可能是一个标准的场景原型配置，也可能是过去玩过的场景记录
     * 在 UTG 中，场景记录（游戏记录）和原型是具有同等意义的，从序列化的格式到处理方法都是一致的。
     * 只不过游戏原型存储在stage.config.json文件中，而场景记录的配置存储在用户信息中
     * @param {number} stageIndex 场景序号
     */
    pushStageSelection(stageId){
        let selection=cc.instantiate(this.selPrefab)
        this.initSelection(selection.getComponent(cc.Button),stageId);
        this.node.addChild(selection);
    },
    /**
     * 通过 场景配置的序号 来初始化一个 button 控件，
     * 点击 button 所在节点即可进入 该场景
     * @param {cc.Button} selectionButton
     * @param {number} id 场景配置的序号
     */
    initSelection(selectionButton,id){
        /* 
        selectionButton 内部预置会在点击时调用 this.select 函数
        给 selectionButton 绑定该 stage 的 id ，
        使点击 selectionButton 所在节点时，进入该场景 
        */
        selectionButton.clickEvents[0].customEventData=id;
    },
    /**
     * 根据场景的id 选择进入该场景
     * @param {string} id 场景id
     */
    select(id){
        //fixme
    },
});
