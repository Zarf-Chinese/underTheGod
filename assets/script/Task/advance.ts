/*
targetType :[
"tile",         //targets:Array<cc.Vec2>地块位置
"country",      //targets:Array<Unit> 国家对象
"#type",        //targets:Array<Unit> 相应type的object
(stage:Stage,selections:Array<cc.Vec2>):Array<any>
]
*/
/**
 * 进击
 * @importance              1                                                           //重要级别，1为最重要，直到彻底完成后不会执行下一个任务。2为次重要，除非将要执行的任务的重要级别为1，否则彻底执行下去
 * @startDate               1                                                           //起始日期
 * @userType                "soldier"                                                   //使用者对象类型
 * @targetType              "tile"                                                      //目标类型
 * @maxSeleCount            1                                                           //最大可选目标数量
 * @estimate                (stage:Stage,soldier:Unit,targets:Array<any>):Cost        //每回合开始前、初始化任务时调用，dayCost:预计剩余时间，返回小于等于0的数则表示任务彻底结束。moneyCost:预计剩余消耗资金，返回小于0的数则表示获取了资金
 * @pass                    (stage:Stage,soldier:Unit,targets:Array<any>,cache:any):Result//每回合结束时调用，cache会被缓存。执行任务内容，返回执行结果，包括实际消耗资金、任务报告等。
 * @save
 * @load
 */
var Stage=import("../PObject/Stage");
var Unit=import("../PObject/Unit");
var StageController;
var UnitController;
var CountryController;
var RoutineCal;
class Cost {
    dayCost: number;
    moneyCost: number;
    constructor (_dayCost:number,_moneyCost:number) {
        this.dayCost = _dayCost;
        this.moneyCost = _moneyCost;
    }
}
class Result {
    //实际资金消耗
    moneyCost: number;
    constructor(_moneyCost) {
        this.moneyCost = _moneyCost;
    }
}
export module Advance {
    export const type: string = "advance";
    //export var importance: number = 1;
    //export var startDate: number;
    export const userType: string="soldier";
    export const targetType: string="tile";
    export const maxSeleCount: number = 1;
    export function estimate(stage, soldier, targets: Array<cc.Vec2>): Cost {
        let target = targets[0];
        let distance = UnitController.getTileDistance(soldier, target);
        let dayCost = distance;
        let moneyCost = dayCost * UnitController.get(soldier, "number");
        let cost = new Cost(dayCost, moneyCost);
        return cost;
    }
    //export function pass(stage: Stage, soldier: Unit, targets: Array<cc.Vec2>, cache): Result {
    //    let target = targets[0];
    //    let intelli = 100;
    //    //根据 场景设定、出发点、目的点、智力 来寻路
    //    cache.routine = cache.routine || RoutineCal.calculate(stage, UnitController.getPosition(soldier), target,intelli);
    //    //沿之前计算的路径走一步
    //    cache.step = RoutineCal.step(stage, cache.routine, cache.step);
    //    RoutineCal.pass(soldier,)
    //    return new Result(UnitController.get(soldier, "number"));
    //}
    export function pass(stage, soldier, targets: Array<cc.Vec2>, cache): Result {
        let target = targets[0];
        let success = UnitController.stepTo(soldier, target);
        let moneyCost = success ? UnitController.get(soldier, "number") : 0;
        return new Result(moneyCost);
    }
    export function save(instance,cache) {
        return {
            type: instance.type,

        }
    }
    export function load(instance,data) {

    }
}