/**
 * 工具集
 */
define(function(require, exports) {
	'require:nomunge,exports:nomunge,module:nomunge';

	// 后台页工具集
	var util = chrome.extension.getBackgroundPage().util,

	// 是否是合法的IPv4地址
	isV4 = function(ip) {
		if (/^\d{1,3}(\.\d{1,3}){3}$/.test(ip)) {
			ip = ip.split('.');
			for (i = 0; i < ip.length; i++) {
				if (Number(ip[i]) > 255) {
					return false;
				}
			}
			return true;
		} else {
			return false;
		}
	};

	/**
	 * 是否是合法的IP地址
	 */
	exports.isValidIP = function(ip) {
		var i, parts;
		if (isV4(ip)) { // IPv4
			return true;
		} else if (ip.indexOf(':') !== -1) { // IPv6 (http://zh.wikipedia.org/wiki/IPv6)
			parts = ip.split(':');
			if (ip.indexOf(':::') !== -1) {
				return false;
			} else if (ip.indexOf('::') !== -1) {
				if (!(ip.split('::').length === 2 || parts.length > 8)) {
					return false;
				}
			} else {
				if (parts.length !== 8) {
					return false;
				}
			}
			if (parts.length === 4 && isV4(parts[3])) {
				return parts[2] === 'ffff';
			} else {
				for (i = 0; i < parts.length; i++) {
					if (!/^[0-9A-Za-z]{0,4}$/.test(parts[i])) {
						return false;
					}
				}
				return !/(^:[^:])|([^:]:$)/g.test(ip);
			}
		} else {
			return false;
		}
	};

	/**
	 * 从URL里找出可能的域名
	 */
	exports.findHostname = function(url) {
		if (url) {
			url = url.split('/');
			for (var i = 2; i < url.length; i++) {
				if (url[i]) {
					return url[i];
				}
			}
		}
		return '';
	};

	/**
	 * 获取当前tab
	 * @param callback 参数为当前tab
	 */
	exports.getCurrentTab = function(callback) {
		chrome.tabs.query({
			windowId: chrome.windows.WINDOW_ID_CURRENT,
			active: true
		}, function(tabs) {
			if (tabs && tabs[0]) {
				callback(tabs[0]);
			}
		});
	};

	/**
	 * 文件是否存在
	 */
	exports.fileExists = util.fileExists;

	/**
	 * 路径是否是目录
	 */
	exports.isDirectory = util.isDirectory;

	/**
	 * 获取国际化文案
	 */
	exports.i18n = chrome.i18n.getMessage;

});