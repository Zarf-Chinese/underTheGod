var keymap={
    /**
     * @returns the target element (safely).
     * @param {unit} keymap 
     * @param {string[]} keyArray 
     * @example 
     * ```js
     * let obj={}
     * let elem1=util.unit.getElementByKeyArray(obj,["prop1","prop2","prop3"]) //obj[prop1][prop2][prop3]
     * let elem2=util.unit.getElementByKeyArray(obj,[]) //obj
     * ```
     * 
     */
    getElementByKeyArray(keymap, keyArray) {
        let obj=keymap;
        for(let i=0,l=keyArray.length;i<l && obj;i++)
        {
            obj=obj[keyArray[i]];
        }
        return obj;
    }
};
module.exports=keymap;
