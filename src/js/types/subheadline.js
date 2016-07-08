'use strict';

const headline = require("./headline");

class subheadline extends headline {

	constructor(config) {
		super(config);

		this.type = "h4";
	}
}

module.exports = subheadline;