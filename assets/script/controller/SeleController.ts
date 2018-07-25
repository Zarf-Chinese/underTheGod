export module SeleController {
    var selections: Array<cc.Vec2>=new Array<cc.Vec2>();
    /**
     * 获取截至目前的所有勾选地块
     */
    export function getSelections():Array<cc.Vec2>{
        return selections
    }

    /**
     * 添入一个点击位置
     * @param pos 新添入的点击位置
     */
    export function pushSelection(pos:cc.Vec2){
        selections.push(pos);
    }
    
}