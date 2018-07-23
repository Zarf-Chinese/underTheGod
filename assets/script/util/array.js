var array = {
    /**
     * 深度检查目标数组是否存在、是否为空，
     * 将顺延判断子数组
     * 若目标不是数组，返回非空
     * @param {Array} _array 
     */
    isDeepEmpty(_array) {
        let ret = true;
        //若目标不是数组，无法判断，默认返回不空
        if (!(_array instanceof Array)) ret = false;
        else {
            for (let i = _array.length - 1; i >= 0; i--) {
                if (_array[i] instanceof Array) {
                    //若该子元素为数组。。。
                    if (!array.isDeepEmpty(_array[i])) {
                        ret = false;
                        break;
                    } 
                }else {
                    //若该元素不是数组。。。 
                    if(_array[i]!==null && _array[i]!==undefined){
                        ret=false;
                        break;
                    }
                }
            }
        }
        return ret;
    }
};
module.exports = array;