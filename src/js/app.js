'use strict';

class vcheck {
	constructor() {
		this.config = require("./config");
	}
}

var init = function () {
	jQuery(document).ready(function () {
		let $formOutput = jQuery("#mrmoney-form");
		let type = $formOutput.data("type");

		const check = new vcheck();
		check.config[type].toString();
	});
};

init();