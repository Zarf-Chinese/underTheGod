// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
let Direction = cc.Enum({
    horizontal: 0,
    vertical: 1
})
cc.Class({
    extends: cc.Component,

    properties: {
        bar: {
            default: null,
            type: cc.Sprite
        },
        indicator: {
            default: null,
            type: cc.Label,
        },
        value: {
            default: 100,
            notify: function () {
                if (this.value > this.maxValue)
                    this.value = this.maxValue;
                else if (this.value < 0)
                    this.value = 0;
                this.indicateValue();
            }
        },
        inflexionValue: {
            default: 1000,
            notify: function (){
                if (this.inflexionValue < 0)
                    this.inflexionValue = 0;
                else if (this.inflexionValue > this.maxValue)
                    this.inflexionValue = this.maxValue;
                this.makeDirty();
            }
        },
        inflexionPosition: {
            default: 0.5,
            min:0,
            max:1,
            notify: function () {
                this.makeDirty();
            }
        },
        maxValue: {
            default: 100000,
            notify: function () {
                if (this.maxValue < 0)
                    this.maxValue = 0;
                this.makeDirty();
            }
        },
        direction: {
            default: Direction.horizontal,
            type: Direction
        },
        maxColor:{
            default:cc.Color.RED,
            notify:function(){this.makeDirty();}
        },
        minColor:{
            default:cc.Color.BLUE,
            notify:function(){this.makeDirty();}
        },
        maxLength:{
            default:100,
            notify:function(){
                this.makeDirty();
            }
        },
        _logBase:{
            default:10
        }
    },
    makeDirty() {
        this.dirty = true;
    },
    calculateBase(){
        this.maxValue-this.inflexionValue
    },
    indicateValue(){
        
        //刷新显示比例
        let percent=0;
        if(this.inflexionValue>=this.value)
            percent=this.value/this.inflexionValue*this.inflexionPosition;
        else
        {
            let _p=Math.log(this.value/this.inflexionValue)/Math.log(this.maxValue/this.inflexionValue)
            percent=cc.lerp(_p,1,this.inflexionPosition);
        }
        //刷新显示位置
        if(this.direction==Direction.vertical){
            this.bar.node.height=this.maxLength*percent;
        }else
        {
            this.bar.node.width=this.maxLength*percent;
        }
        //刷新显示颜色
        this.bar.node.color=this.minColor.lerp(this.maxColor,percent)
        //刷新显示数值
        this.indicator.string=percent;
    },
    update() {
        if (this.dirty & this.indicator) {
            //参数值改变
            this.calculateBase();
            //因参数值改变，需要重新刷新 显示比例
            this.indicateValue();
        }
        this.dirty = false;
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },

    // update (dt) {},
});
