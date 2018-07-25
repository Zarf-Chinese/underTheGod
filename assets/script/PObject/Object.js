var PObject = require("PObject")
var Attr=require("Attr");
var AttrController=require("../controller/AttrController")
var Object = cc.Class({
    statics: {

        //对于object 来说， 配置是必要的。 每个object 必然对应着唯一一个 配置
        Config: cc.Class({
            name: "ObjectConfig",
            extends: PObject,
            properties: {
                key:-1,
                type: "noName",
                offset: cc.Vec2,
                frame: "",
                zOrder: 0,
                attrs: [cc.String],
            }
        })
    },
    ctor() {
        //  fixme this.node=...
    },
    name: "Object",
    extends: PObject,
    properties: {
        type: "noName",
        pos: cc.Vec2,       //地图位置，而非像素位置 
        node: null,
        attrs: [Attr],
    },
    /**
     *通过一个配置初始化一个实例
     *
     * @param {Object.Config} config
     */
    _initByConfig(config){

    },
    _load(data) {
        if(data.hasOwnProperty("type"))
        {
            this.type=data.type;
        }
        if(data.hasOwnProperty("pos")){
            this.pos=cc.v2(data.pos)
        }
        if(data.hasOwnProperty("attrs")){
            for (let index = 0; index < data.attrs.length; index++) {
                const attr = data.attrs[index];
                this.attrs.push(PObject.create(Attr,attr));
            }
        }
    },

    _save(){
        let ret={};
        ret.type =this.type;
        ret.pos=cc.v2(this.pos);
        if(this.hasOwnProperty("attrs"))
        {
            ret.attrs=[];
            for (let index = 0; index < this.attrs.length; index++) {
                const attr = this.attrs[index];
                ret.attrs.push(PObject.save(Attr,attr));
            }
        }
        return ret;
    },

    _findAttr(attr){
        this.attrs.forEach(attr => {
            if(attr.type===attr){
                return attr;
            }
        });
    },

    _addAttr(attr){

    },

    _removeAttr(attr){

    },

    /**
     * 根据属性名获取属性现在的值，若不存在，则会返回 0
     * @param {string} attr 属性名
     */
    _getAttr(attr){
        let _attr=this._findAttr(attr)
        return _attr ? AttrController.getValue(_attr):0
    },
    /**
     * 根据属性名给属性一个变化量（所有变化量会在每回合结束时统一叠加到属性值上）
     * 若不存在，则不执行任何操作
     * @param {string} attr 属性名
     * @param {number} alter 变化量
     */
    _alterAttr(attr,alter){
        let _attr=this._findAttr(attr);
        if(_attr){
            AttrController.alterValue(attr,alter);
        }
    }
})