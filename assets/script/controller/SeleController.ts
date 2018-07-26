export module SeleController {
    var selections: Array<cc.Vec2>=new Array<cc.Vec2>();
    export var context;
    /**
     * 获取截至目前的所有被点中的位置选项
     * @returns tilepos[]
     */
    export function getSelections():Array<cc.Vec2>{
        return selections
    }

    /**
     * 添入一个选项
     * @param tilepos 新添入的点击位置 
     */
    export function push(tilepos:cc.Vec2){
        selections.push(tilepos);
    }

    /**
     * 抛出一个选项
     */
    export function pop():cc.Vec2{
        return selections.pop();
    }

    /**
     * 获取并推出某位置及其之后的所有选项
     * @param at 起始位置
     */
    export function pops(at:number):cc.Vec2[]{
        return selections.splice(at);
    }

    /**
     * 获取某个选项
     * @param at 位置
     */
    export function get(at:number):cc.Vec2{
        return selections[at];
    }

    /**
     * 从某位置开始，获取其与其之后的选项
     * @param at 起始位置
     */
    export function gets(at:number):cc.Vec2[]{
        return selections.slice(at);
    }
    
}