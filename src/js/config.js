'use strict';

const wohngebaeude = require("./forms/wohngebaeude");
const phv = require("./forms/phv");
const rechtsschutz = require("./forms/rechtsschutz");

const config = {
	wohngebaeude: new wohngebaeude(),
	phv: new phv(),
	rechtsschutz: new rechtsschutz()
};

module.exports = config;