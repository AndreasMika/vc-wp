'use strict';

/**
 *
 */
class xml2json {
	static convertToJson(xml) {
		let result = [];

		for (let i in xml.children[0].children) {
			let item = xml.children[0].children[i];
			let obj = {};

			for (let u in item.children) {
				let prop = item.children[u];
				//debugger;
				//if (!prop.children)
				obj[prop.tagName] = prop.textContent;
			}

			if (typeof obj["beitrag"] != "undefined")
				result.push(obj);
		}

		return result;
	}
}

module.exports = xml2json;