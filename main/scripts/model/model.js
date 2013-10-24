/**
 * 数据模型
 */
define(function(require, exports) {
	'require:nomunge,exports:nomunge,module:nomunge';

	// 后台页数据模型
	var model = chrome.extension.getBackgroundPage().model,
	
	// 工具集
	util = require('../util/util.js'),

	// 结点
	Entry = require('./entry.js'),

	/**
	 * 使用代理让变更立即生效
	 */
	doProxy = function(array) {
		var script = '', i;
		for (i = 0; i < array.length; i++) {
			script += '}else if(host=="' + array[i].hostname + '"){';
			script += 'return "PROXY ' + array[i].addr + ':80; DIRECT";';
		}
		chrome.proxy.settings.set({
			value: {
				mode: 'pac_script',
				pacScript: {
					data: 'function FindProxyForURL(url,host){if(shExpMatch(url,"http:*")){if(isPlainHostName(host)){return "DIRECT";' +
							script + '}else{return "DIRECT";}}else{return "DIRECT";}}'
				}
			},
			scope: 'regular'
		}, $.noop);
	},

	manifest = {};

	// 加载manifest.json文件
	$.ajax({
		async: false,
		dataType: 'json',
		success: function(data) {
			manifest = data;
		},
		url: '/manifest.json'
	});

	/**
	 * 存储数据
	 */
	exports.put = model.put;

	/**
	 * 获取数据
	 */
	exports.get = model.get;

	/**
	 * 删除数据
	 */
	exports.remove = model.remove;

	/**
	 * 添加组
	 */
	exports.addGroup = function(groupData) {
		var data = model.get('data') || exports.loadData(),
		group = data[groupData.line] || new Entry(groupData.line),
		entry = new Entry();
		data[groupData.line] = group;
		group.enable = false;
		entry.enable = false;
		entry.comment = groupData.comment;
		entry.addr = groupData.addr;
		entry.hostname = groupData.hostname;
		group.link(entry);
	};

	/**
	 * 从hosts文件加载内容
	 */
	exports.loadContent = function() {
		return model.readFile(exports.getHostsPath());
	};

	/**
	 * 从hosts文件加载数据
	 */
	exports.loadData = function() {
		var content = exports.loadContent(),
		data = {},
		i, c;
		if (content) {
			for (i = 0; i < content.length; i++) { // 扫描非utf8字符
				c = content.charAt(i);
				if (c == '\ufffc' || c == '\ufffd') {
					data.error = 'unknownChar';
					break;
				}
			}
			exports.parseData(content, data);
		} else {
			model.put('data', data);
		}
		return data;
	};

	/**
	 * 解析数据
	 */
	exports.parseData = function(dataStr, data, group) {
		var content = dataStr.split(/\r?\n/),
		data = data || model.get('data') || exports.loadData(),
		i, c, d, entry;
		for (i = 0; i < content.length; i++) {
			entry = new Entry();
			if (entry.analysis(content[i])) { // 是合法记录
				c = group || util.i18n('defaultGroup');
				d = c.charAt(0) == '@' ? c.substring(1) : c;
				data[d] = data[d] || new Entry(c);
				data[d].link(entry);
			} else { // 是注释或空行
				group = entry.line;
			}
		}
		for (i in data) {
			if (i != 'error') {
				data[i].checkEnable();
			}
		}
		model.put('data', data);
		return data;
	};

	/**
	 * 保存数据到指定文件
	 */
	exports.saveData = function(file) {
		var data = model.get('data'),
		method = model.get('method'),
		array = [],
		content = '', i;
		if (method == 'clearCache') {
			for (i in data) {
				content += data[i].toString();
			}
			model.saveFile(file || exports.getHostsPath(), content);
			setTimeout(function() {
				bm.clearCache();
				bm.clearHostResolverCache();
				bm.clearPredictorCache();
				bm.closeConnections();
			}, 0);
		} else if (method == 'useProxy') {
			for (i in data) {
				content += data[i].toString();
				data[i].pushEnables(array);
			}
			model.saveFile(file || exports.getHostsPath(), content);
			doProxy(array);
		} else {
			for (i in data) {
				content += data[i].toString();
			}
			model.saveFile(file || exports.getHostsPath(), content);
		}
	};

	/**
	 * 设置hosts文件路径
	 */
	exports.setHostsPath = function(path) {
		model.put('hostsPath', path);
	};

	/**
	 * 获取hosts文件路径(优先手动设置的值,其次默认值)
	 */
	exports.getHostsPath = function() {
		return model.get('hostsPath') || model.getHostsPath();
	};

	/**
	 * 获取版本号
	 */
	exports.getVersion = function() {
		return manifest.version;
	};

});