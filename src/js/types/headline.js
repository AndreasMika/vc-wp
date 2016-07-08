'use strict';

const type = require("./type");

class headline extends type {

	constructor(config) {
		super(config);

		this.type = "h3";
	}

	/**
	 *
	 * @returns {Element}
	 */
	toString() {
		let headlineItem = document.createElement(this.type);
		headlineItem.setAttribute("class", "row");
		if (this.name != "") {
			headlineItem.setAttribute("id", this.name + "-wrapper");
		}

		jQuery(headlineItem).html(this.label);

		return headlineItem;
	}
}

module.exports = headline;