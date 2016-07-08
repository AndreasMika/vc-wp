'use strict';

const moment = require("moment");
const select = require("../types/select");
const headline = require("../types/headline");
const subheadline = require("../types/subheadline");
const input = require("../types/input");
const form = require("./form");
const _ = require("lodash");

class config extends form {
	constructor() {
		super();
		this.sparte = "PHV";

		this.action = "http://www.mr-money.de/module/kern/phv.php";

		this.formClass = "phv";
		this.sp_lang = 'haftpflicht';
		this.form = this.getForm();

		var toggleSanierung = [
			'KrPHV',
			'KrTIE',
			'KrHUG',
			'KrOEL',
			'KrWG',
			'KrWGGLS',
			'KrHR',
			'KrHRGLS',
			'KrUNF',
			'KrRS'
		];

		this.pages = [
			[
				new headline({
					label: "Privathaftpflicht Vergleich"
				}),
				new select({
					label : "Tarifauswahl",
					name  : "single",
					values: {
						"Familie/Lebensgemeinschaft mit Kinder" : "Familie/Lebensgemeinschaft mit Kind/Kindern",
						"Familie/Lebensgemeinschaft ohne Kinder": "Familie/Lebensgemeinschaft ohne Kinder",
						"Single ohne Kinder"                    : "Single ohne Kinder",
						"Single mit Kinder"                     : "Single mit Kind/Kindern"
					}
				}),
				new select({
					label : "Tarifgruppe",
					name  : "beamte",
					values: {
						"Normal"                       : "Normal",
						"öffentl. Dienst"              : "öffentlicher Dienst",
						"ÖD mit Dienst-HP (nur Lehrer)": "ÖD mit Dienst-HP (nur Lehrer)"
					}
				}),
				new input({
					label   : "Alter",
					name    : "alter",
					type    : "text",
					value   : "30",
					required: true
				}),
				new select({
					label : "Ausfalldeckung",
					name  : "ausfall",
					values: {
						"nein": "nein",
						"ja"  : "ja"
					}
				}),
				new select({
					label : "Deliktunfähige Kinder unter 7 Jahre mitversichern?	Eltern haften nicht für unter 7jährige Kinder (bei Verkehr nicht bis unter 10 Jahre), wenn sie Ihrer Aufsichtspflicht nachkommen. Diese Schäden können Sie hier versichern.",
					name  : "delikt",
					values: {
						"nein": "nein",
						"ja"  : "ja"
					}
				}),
				new select({
					label : "Hund mitversichern? (kein Kampfhund!)",
					name  : "Hundn",
					values: {
						"0": "0",
						"1": "1",
						"2": "2",
						"3": "3",
						"4": "4",
						"5": "5"
					}
				}),
				new headline({
					label:'Rabattrelevante Angaben'
				}),
				new select({
					label : "Laufzeit",
					name  : "laufzeit",
					values: {
						"1": "1 Jahr",
						"3"  : "3 Jahre",
						"5"  : "5 Jahre"
					},
					value : '3'
				}),
				new select({
					label   : "Bestand in den letzten 5 Jahren eine Vorversicherung?",
					name    : "vorvers5",
					required: true,
					regex   : /(nein|ja)/,
					values  : {
						"."   : "-- Bitte wählen --",
						"nein": "nein",
						"ja"  : "ja"
					},
					value: "."
				}),
				new select({
					label : "Schäden in den letzten 5 Jahren",
					name  : "schaeden5",
					values: {
						"." : "-- Bitte wählen --",
						"0": "0",
						"1": "1",
						"2": "2",
						"3": "3",
						"4": "4"
					},
					value : "."
				}),
				new select({
					label : "Kombirabatte mit berechnen?",
					name  : "kombirabatte",
					values: {
						"nein": "nein",
						"ja"  : "ja"
					},
					value: 'nein',
					events: {
						change: {
							ja : {
								show  : toggleSanierung,
								custom: () => {}
							},
							nein : {
								hide  : toggleSanierung,
									custom: () => {}
								}
							}
						}

				}),

				new input({
					label   : "Privathaftpflicht",
					name    : "KrPHV",
					type    : "checkbox",
					value   : "1"
				}),
				new input({
					label   : "Tierhalterhaftpflicht",
					name    : "KrTIE",
					type    : "checkbox",
					value   : "1"
				}),
				new input({
					label   : "Haus-Grundbesitzer Haftpflicht",
					name    : "KrHUG",
					type    : "checkbox",
					value   : "1"
				}),
				new input({
					label   : "Gewässerschaden/Öltank",
					name    : "KrOEL",
					type    : "checkbox",
					value   : "1"
				}),
 				new input({
					label   : "Wohngebäude",
					name    : "KrWG",
					type    : "checkbox",
					value   : "1"
				}),
 				new input({
					label   : "Wohngebäude-Glas",
					name    : "KrWGGLS",
					type    : "checkbox",
					value   : "1"
				}),
 				new input({
					label   : "Hausrat",
					name    : "KrHR",
					type    : "checkbox",
					value   : "1"
				}),
 				new input({
					label   : "Hausrat-Glas",
					name    : "KrHRGLS",
					type    : "checkbox",
					value   : "1"
				}),
 				new input({
					label   : "Unfall",
					name    : "KrUNF",
					type    : "checkbox",
					value   : "1"
				}),
 				new input({
					label   : "Rechtsschutz",
					name    : "KrRS",
					type    : "checkbox",
					value   : "1"
				})


			]
		];

		this.initialFilterValues = [];
	};

	drawFilter(xml) {

		this.filter = document.createElement("table");
		this.filter.setAttribute("class", "filter-block");

		let row = `
			<tr>
				<td><b>Zahlweise:</b> <span id="zahlweiseFilterValue"></span></td>
				<td class="slider">
					<div id="zahlweiseFilter"></div>
				</td>
			</tr>
			<tr>
				<td><b>Selbstbeteiligung:</b> <span id="sbFilterValue"></span></td>
				<td class="slider">
					<div id="sbFilter"></div>
				</td>
			</tr>
			<tr>
				<td><b>Vers.summe:</b> <span id="vsFilterValue"></span></td>
				<td class="slider">
					<div id="vsFilter"></div>
				</td>
			</tr>
			<tr>
				<td><b>Anbieterbewertung:</b> <span id="rateFilterValue"></span></td>
				<td class="slider">
					<div id="rateFilter"></div>
				</td>
			</tr>
			<tr>
				<td><b>Sortierung:</b> <span id="sortFilterValue"></span></td>
				<td class="slider">
					<div id="sortFilter"></div>
				</td>
			</tr>
		`;

		jQuery(this.filter).html(row);

		if (jQuery('.mrmoney-widget-content').length>0) {
			jQuery('.mrmoney-widget-content').html(this.filter);
		} else {
			jQuery(this.form).after(this.filter);
		}


		var stepSlider1 = document.getElementById('zahlweiseFilter');
		var stepSlider2 = document.getElementById('sbFilter');
		var stepSlider3 = document.getElementById('vsFilter');
		var stepSlider4 = document.getElementById('rateFilter');
		var stepSlider5 = document.getElementById('sortFilter');

		noUiSlider.create(stepSlider1, {
			start: [1],
			step : 1,
			range: {
				'min': [1],
				'max': [4]
			}
		});
		noUiSlider.create(stepSlider2, {
			start: [1],
			step : 1,
			range: {
				'min': [1],
				'max': [6]
			}
		});
		noUiSlider.create(stepSlider3, {
			start: [1],
			step : 1,
			range: {
				'min': [1],
				'max': [8]
			}
		});
		noUiSlider.create(stepSlider4, {
			start: [1],
			step : 1,
			range: {
				'min': [1],
				'max': [6]
			}
		});
		noUiSlider.create(stepSlider5, {
			start: [1],
			step : 1,
			range: {
				'min': [1],
				'max': [3]
			}
		});

		this.initialFilterValues = [1,1,1,1,1];

		stepSlider1.noUiSlider.on("update", (values, handle) => {
			this.initialFilterValues[0] = values[0];
			this.filterXml();
		});

		stepSlider2.noUiSlider.on("update", (values, handle) => {
			this.initialFilterValues[1] = values[0];
			this.filterXml();
		});

		stepSlider3.noUiSlider.on("update", (values, handle) => {
			this.initialFilterValues[2] = values[0];
			this.filterXml();
		});

		stepSlider4.noUiSlider.on("update", (values, handle) => {
			this.initialFilterValues[3] = values[0];
			this.filterXml();
		});

		stepSlider5.noUiSlider.on("update", (values, handle) => {
			this.initialFilterValues[4] = values[0];
			this.filterXml();
		});


	}

	filterXml () {

		let xml = this.tarife;
		let v,p,output;


		// filter #1 logic - stepSlider1
		v = this.initialFilterValues[0];
		p = 0;
		output = "jährlich";
		switch(v) {
			case "1.00":
				p = 0;
				output = "jährlich";
				break;
			case "2.00":
				p = 1;
				output = "halbjährlich";
				break;
			case "3.00":
				p = 2;
				output = "vierteljährlich";
				break;
			case "4.00":
				p = 3;
				output = "monatlich";
				break;
		}

		xml = _.filter(xml, function(item) {
			let zw = item["zw_erlaubt"].split(";");
			return zw[p] == 1;
		});
		jQuery("#zahlweiseFilterValue").html(output);


		// filter #2 logic - stepSlider2
		v = this.initialFilterValues[1];
		output = "0 €";
		p = 0;
		switch(v) {
			case "1.00":
				p = 0;
				output = "0 €";
				break;
			case "2.00":
				p = 99;
				output = "99 €";
				break;
			case "3.00":
				p = 100;
				output = "100 €";
				break;
			case "4.00":
				p = 125;
				output = "125 €";
				break;
			case "5.00":
				p = 150;
				output = "150 €";
				break;
			case "6.00":
				p = 250;
				output = "250 €";
				break;
		}

		xml = _.filter(xml, function(item) { return item["sb"] <= p; });
		jQuery("#sbFilterValue").html(output);


		// filter #3 logic - stepSlider3
		v = this.initialFilterValues[2];
		output = "0 €";
		p = 0;
		switch(v) {
			case "1.00":
				p = 3000000;
				output = "3 Mio. €";
				break;
			case "2.00":
				p = 5000000;
				output = "5 Mio. €";
				break;
			case "3.00":
				p = 7000000;
				output = "7 Mio. €";
				break;
			case "4.00":
				p = 10000000;
				output = "10 Mio. €";
				break;
			case "5.00":
				p = 15000000;
				output = "15 Mio. €";
				break;
			case "6.00":
				p = 20000000;
				output = "20 Mio. €";
				break;
			case "7.00":
				p = 25000000;
				output = "25 Mio. €";
				break;
			case "8.00":
				p = 50000000;
				output = "50 Mio. €";
				break;
		}

		xml = _.filter(xml, function(item) { 
			return item["vs"] >= p; });
		jQuery("#vsFilterValue").html(output);


		// filter #4 logic - stepSlider4
		v = this.initialFilterValues[3];
		output = "mind. 1 Sterne";
		p = 0;
		switch(v) {
			case "1.00":
				p = 1;
				output = "mind. 1 Sterne";
				break;
			case "2.00":
				p = 2;
				output = "mind. 2 Sterne";
				break;
			case "3.00":
				p = 3;
				output = "mind. 3 Sterne";
				break;
			case "4.00":
				p = 4;
				output = "mind. 4 Sterne";
				break;
			case "5.00":
				p = 4.5;
				output = "mind. 4.5 Sterne";
				break;
			case "6.00":
				p = 5;
				output = "mind. 5 Sterne";
				break;
		}

		xml = _.filter(xml, function(item) {
			return item["ges_bewsterne"] >= p; });
		jQuery("#rateFilterValue").html(output);


		// filter #5 logic - stepSlider5
		v = this.initialFilterValues[4];
		output = "günstigster Beitrag";
		p = 0;
		switch(v) {
			case "1.00":
				p = 'price';
				output = "günstigster Beitrag";
				xml = _.orderBy(xml, function (v) {return v.price} );
				break;
			case "2.00":
				p = 'tar_punkte';
				output = "beste Leistung";
				xml = _.orderBy(xml, v => +v.tar_punkte, 'desc');
				break;
			case "3.00":
				p = 'synthetic';
				output = "Preis/Leistung";
				xml = _.sortBy(xml, v => (v.tar_punkte/v.price));
				break;
		}

		jQuery("#sortFilterValue").html(output);

		this.drawResults(xml);
	}


}

module.exports = config;