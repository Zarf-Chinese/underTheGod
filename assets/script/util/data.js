
let _handleData = function (csvData,dataHandler) {
    return (dataHandler instanceof Function) ? dataHandler(csvData) : csvData;
}

let _getDataFromCSV = function (csvString, dataHandler, rSeps) {
    /**
     * 若 csvString 不存在，直接返回空数组。
     * @attention 此处若csvString 为 ""，将依旧视作存在。 
     */
    if (typeof (csvString) != "string") return [];
    //取出这一层的 分隔符
    let sep = rSeps.pop();
    
    /**
     * 若本层已没有分隔符，则本层即为最终数据，
     * @attention 此处不支持 空字符串作为分隔符。
     */
    if (!sep) { return _handleData(csvString, dataHandler); }
    let ret = []
    // 进行下一层分隔操作
    csvString.split(sep).forEach(function (data) { ret.push(_getDataFromCSV(data, dataHandler, rSeps)) });
    //放回这一层的 分隔符（以备同一层的分隔操作）
    rSeps.push(sep)
    return ret;
}
var data = {
    /**
     * 根据自定义的维度分隔符和预处理方法，将csv信息转化为多维度数组
     * @param {string} csvString 
     * @param {(data:string)=>any} dataHandler 可选，读对读取到的每一个字符串数据块进行预处理，应当返回这个被读取到的数据块的处理结果值
     * @param {Array<string>} seps 维度分隔符，前两个维度默认分隔符为 '\n' & ','
     * @returns {Array}
     */
    getDataFromCSV(csvString, dataHandler, ...seps) {
        seps[0] = seps[0] || '\n';
        seps[1] = seps[1] || ',';
        return _getDataFromCSV(csvString, dataHandler, seps.reverse());
    }
}
module.exports = data;