module.exports = {

    /**
     *
     * 寻找某unit是否含有某元素（按表面值寻找），若果有，返回该元素的序号
     * @param {Unit} target
     * @param {any} value
     * @returns
     */
    contain(target, value) {
        for (const key in target) {
            if (target.hasOwnProperty(key)) {
                const elem = target[key];
                if (elem === value) {
                    return key;
                }
            }
        }
    },

    createPObject(POClass,data){
        let ret=new POClass();
        ret.load(data)
        return ret;
    }


}
