var data={
    /**
     * 将 csv文件信息转化为 二维数组
     * @param {string} csvString
     * @param {(data:string)=>any} dataHandler 可选，对读取到的每一个数据块进行预处理，返回处理结果
     * @param {number} iLimit 可选，第一维度数量限制
     * @param {number} jLimit 可选，第二维度数量限制
     * @returns {[cc.Vec2]}
     */
    getV2DataFromCSV(csvString,dataHandler,iLimit,jLimit){
        var lineStrings=csvString.split("\n",iLimit);
        var ret=new Array();
        for (let i=0;i<lineStrings.length;i++) {
            ret[i]=lineStrings[i].split(",",jLimit);
            if(dataHandler instanceof Function){
                for(let j=0;j<ret[i].length;j++){
                    ret[i][j]=dataHandler(ret[i][j]);
                }
            }
        } 
        return ret;
    }
}
module.exports=data;