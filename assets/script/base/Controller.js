/**
 * 控制器的基元
 * 继承控制器需要实现的三个静态元素：
 * Type             :target class
 * configs          :config sets
 * default          :default config name
 * _createByConfig  :(Type.Config)->Type
 */
var Controller = {
    /**
     * 通过一个被注册过的类型名设置默认的类型配置
     * 若传入的类型名未被注册，则执行失败
     * @param {string} type 类型名
     * @return {boolean} 是否设置成功
     */
    setDefaultConfig(type) {
        if (!this.getConfigByTypename(type)) {
            return false;
        }
        this.default = type;
        return true;
    },
    /**
     * 获取默认的类型配置
     * @return {Controller.Type.Config} 默认的类型配置
     */
    getDefaultConfig() {
        return this.getConfigByTypename(this.default);
    },
    /**
     *通过一个类型名获取一个类型配置
     *若未找到，返回null
     * @param {string} type 类型名
     * @return {Controller.Type.Config} 类型配置
     */
    getConfigByTypename(type) {
        return this.configs.find(config => {
            return(config.type === type) 
        });
    },
    /**
     * 删去该类型的配置
     * @param {string} type 
     */
    removeConfig(type) {
        let index = this.Configs.findIndex(value => { return value.type == type });
        if (type(index) == "number") {
            this.configs.splice(index, 1);
        }
    },
    /**
     *获取某指定实例的属性类型配置
     *若未能找到，返回null
     * @param {Controller.Type} instance 某实例
     * @returns 类型配置
     */
    getConfig(instance) {
        return this.getConfigByTypename(instance.type);
    },
    /**
     *注册一个类型配置
     *若已经存在相应的类型，则注册失败。
     * @param {Controller.Type.Config} config 类型配置
     * @param {boolean} replace
     * @return {boolean} 是否注册成功
     */
    registConfig(config, replace) {
        if (this.getConfigByTypename(config.type)) {
            if (!replace)
                return false;
            else
                this.removeConfig(config.type);
        }
        this.configs.push(config);
        return true
    },
    /**
     * 根据一个类型配置创建一个实例
     * @param {Controller.Type.Config} config 类型配置，可选，默认为默认类型配置
     * @return {Controller.Type}
     */
    createByConfig(config) {
        config = config || this.getDefaultConfig();
        return this._createByConfig(config);
    },
    /**
     * 根据一个类型名创建一个实例
     * 如果传入了尚未注册的类型名，则会按照默认的类型的配置创建这个实例
     * @param {string} type 类型名
     * @return {Controller.Type} 创建出的实例
     */
    create(type) {
        let config = this.getConfigByTypename(type);
        //根据找到的配置创建一个实例
        let instance = this.createByConfig(config);
        /*在这一步，考虑到存在实例类型名和配置类型名不符的情况
        （如使用默认类型配置创建了某个实例），
        需要确保实例类型名符合要求
        */
        instance.type = type;
        return instance;
    },
    /**
     * 重置配置，保留默认配置，删去其余配置。
     */
    resetAllConfig() {
        for (let i = this.configs.length - 1; i >= 0; i--) {
            //保留 default 配置，删除其余配置
            if (this.configs[i].type !== this.default) {
                this.configs.splice(i, 1);
            }
        }
    }
}

module.exports = Controller;
