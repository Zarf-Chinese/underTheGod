//persisitent object
var PObject = cc.Class({
    name: "PObject",

    statics: {
        create(clazz, data) {
            if (cc.isChildClassOf(clazz, PObject) || clazz === PObject) {
                let ret = new clazz();
                PObject.load(ret, data);
                return ret;
            }
        },
        load(obj, data) {
            if (obj instanceof PObject) {
                obj._load(data);
            }
        },
        save(obj) {
            if (obj instanceof PObject) {
                return obj._save();
            }
        }
    },
    /**
     * 从数据中初始化对象
     * 可自行override
     * @param {Object} data 
     */
    _load(data) {
        for (const key in data) {
            if (data.hasOwnProperty(key) && this.hasOwnProperty(key)) {
                const elem = data[key];
                if (this[key] instanceof PObject)
                    this[key]._load(elem)
                else
                    this[key] = elem;
            }
        }
    },

    /**
     * 将对象转化为数据object
     * 可自行override
     * @returns {Object} 存储的数据
     */
    _save() {
        let ret = {}
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const elem = this[key]
                if (elem instanceof PObject) {
                    ret[key] = elem._save();
                } else
                    ret[key] = cc.instantiate(elem);
            }
        }
        return ret;
    }
});
