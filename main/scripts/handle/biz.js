/**
 * 业务逻辑
 */
define(function(require, exports) {
	'require:nomunge,exports:nomunge,module:nomunge';

	// 后台页数据模型
	var model = require('../model/model.js'),

	// 工具集
	util = require('../util/util.js'),

	/**
	 * 禁用掉集合中的域名, 返回禁用结点集合(指定group或entry的除外)
	 */
	disableAll = function(hostnames, group, entry) {
		var data = exports.loadData(),
		disables = $(), did, i;
		for (i in data) {
			if (data[i] != group) {
				did = false;
				data[i].traverse(function() {
					if (this != entry && this.enable && hostnames[this.hostname]) {
						this.enable = false;
						disables = disables.add(this.target);
						did = true;
					}
				});
				if (did) {
					data[i].enable = false;
					disables = disables.add(data[i].target);
				}
			}
		}
		hostnames = group = entry = data = null;
		return disables;
	};

	/**
	 * 切换组启用状态
	 */
	exports.checkGroup = function(node, callback) {
		var entry = node.data('target');
		if (entry.enable) { // 启用的组切换为禁用
			entry.traverse(function() {
				if (this.enable) {
					this.enable = false;
					node = node.add(this.target);
				}
			});
			entry.enable = false;
			callback(null, node);
			entry = node = null;
		} else { // 禁用的组切换为启用
			var hostnames = {},
			duplicate = false,
			disables = null,
			enables = entry.target;
			entry.traverse(function() { // 寻找组内是否有重复hostname
				if (hostnames[this.hostname]) {
					duplicate = true;
					return false;
				} else {
					hostnames[this.hostname] = true;
				}
			});
			if (duplicate) {
				throw 1;
			}
			disables = disableAll(hostnames, entry); // 禁用其他组内和本组有重复的hostname
			entry.traverse(function() {
				if (!this.enable) {
					this.enable = true;
					enables = enables.add(this.target);
				}
			});
			entry.enable = true;
			callback(enables, disables);
			entry = node = hostnames = disables = enables = null;
		}
	};

	/**
	 * 切换行启用状态
	 */
	exports.checkLine = function(node, callback) {
		var entry = node.data('target'),
		group = entry.findGroup(),
		hostnames = {},
		enables = null;
		if (entry.enable) {
			entry.enable = false;
			group.enable = false;
			callback(null, entry.target.add(group.target));
		} else {
			hostnames[entry.hostname] = true;
			entry.enable = true;
			enables = group.checkEnable() ? group.target.add(entry.target) : entry.target;
			callback(enables, disableAll(hostnames, null, entry));
		}
	};

	/**
	 * 加载数据
	 */
	exports.loadData = function(noCache) {
		if (noCache || !model.get('data')) {
			return model.loadData();
		} else {
			return model.get('data');
		}
	};

	/**
	 * 获取需要编辑的表单项
	 */
	exports.editFields = function(data) {
		var fields = [];
		if (data.addr) { // 行
			fields.push({
				label: '{{:olAddr}}',
				name: 'addr',
				value: data.addr,
				check: 'isValidIP'
			});
			fields.push({
				label: '{{:olHost}}',
				name: 'hostname',
				value: data.hostname,
				check: /^[\w\.\-]+$/
			});
			fields.push({
				label: '{{:olComment}}',
				name: 'comment',
				value: data.comment,
				check: /^[^#]*$/
			});
		} else { // 组
			fields.push({
				label: '{{:olGroup}}',
				name: 'line',
				value: data.line,
				check: /^[^@][^#]*$/,
				placeholder: util.i18n('groupNameTpl')
			});
		}
		return fields;
	};

	/**
	 * 获取当前tab的IP
	 */
	exports.getIP = function(tabId) {
		return model.get(tabId);
	};

	/**
	 * 当前系统是否支持写入hosts文件
	 */
	exports.canWrite = function() {
		return model.get('writeStorage') == '1';
	};

	/**
	 * 解析数据
	 */
	exports.parseData = model.parseData;

	/**
	 * 添加组
	 */
	exports.addGroup = model.addGroup;

	/**
	 * 保存数据
	 */
	exports.saveData = model.saveData;

	/**
	 * 获取版本号
	 */
	exports.getVersion = model.getVersion;

	/**
	 * 获取hosts文件路径
	 */
	exports.getHostsPath = model.getHostsPath;

	/**
	 * 设置hosts文件路径
	 */
	exports.setHostsPath = model.setHostsPath;

	/**
	 * 存数据
	 */
	exports.putData = model.put;

	/**
	 * 取数据
	 */
	exports.getData = model.get;

	/**
	 * 取文件内容
	 */
	exports.loadContent = model.loadContent;
});