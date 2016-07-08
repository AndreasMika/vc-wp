'use strict';

const moment = require("moment");
const select = require("../types/select");
const headline = require("../types/headline");
const subheadline = require("../types/subheadline");
const input = require("../types/input");
const form = require("./form");

class config extends form {
	constructor() {
		super();

		let thisYear = moment().year();
		let nextYear = moment().add(1, 'years').year();

		var years = {};
		years[thisYear] = thisYear;
		years[nextYear] = nextYear;

		var toggleSanierung = [
			"san_d",
			"san_h",
			"san_w",
			"sanierung",
			"sanierung_speziell",
			"san_e",
			"san_k",
			"vorvers5",
			"schaeden5"
		];

		this.form = this.getForm();
		this.pages = [
			[
				new input({
					name: "w14qm",
					type: "hidden"
				}),
				new headline({
					label: "Wohngebäude- / Feuerrohbauversicherung Vergleich"
				}),
				new select({
					label : "Versicherungsschutz für",
					name  : "versicherungsschutz",
					values: {
						wg : "Wohngebäude",
						feu: "Feuerrohbau"
					},
					events: {
						change: {
							wg : {
								show  : toggleSanierung,
								custom: () => {
									let grund = document.getElementById("grund");
									grund.children[1].setAttribute("disabled", true);
									grund.value = "Wert 1914";

									let wert = document.getElementById("wert");

									wert.setAttribute("readonly", true);
									wert.value = this.wert1914();
								}
							},
							feu: {
								hide  : toggleSanierung,
								custom: function () {
									let grund = document.getElementById("grund");
									grund.children[1].removeAttribute("disabled");
									grund.value = "Neubausumme";

									let wert = document.getElementById("wert");

									wert.removeAttribute("readonly");
									wert.value = "";
								}
							}
						}
					}
				}),
				new headline({
					label: "Gebäude- Daten"
				}),
				new select({
					label : "Vertragsbeginn",
					name  : "beginn",
					values: years
				}),
				new input({
					label   : "PLZ - Risiko Ort",
					name    : "plz",
					type    : "text",
					required: true
				}),
				new select({
					label : "Gebäude",
					name  : "gebaeude",
					values: {
						"Einfamilienhaus" : "Einfamilienhaus",
						"Zweifamilienhaus": "Zweifamilienhaus",
						"Doppelhaushälfte": "Doppelhaushälfte",
						"Reihenhaus"      : "Reihenhaus",
						"Doppelhaus"      : "Doppelhaus",
						"Mehrfamilienhaus": "Mehrfamilienhaus"
					}
				}),
				new select({
					label : "Bauartklasse",
					name  : "bauart",
					values: {
						"BAK 1": "massive Bauweise mit harter Dachung (BAK I)",
						"BAK 2": "Stahl/Glas Bauweise mit harter Dachung (BAK II)",
						"FHG 1": "Fertighaus, massiv mit harter Dachung (FHG I)",
						"FHG 2": "Fertighaus, massiv mit harter Dachung (FHG II)",
						"FHG 3": "Fertighaus mit harter Dachung (FHG III)",
						"BAK 3": "Holzhaus oder Lehmfachwerk mit harter Dachung (BAK III)",
						"BAK 5": "weiche Dachung (BAK IV oder V)"
					}
				}),
				new select({
					label : "Wird das Haus selbstgenutzt?",
					name  : "Selbstgenutzt",
					values: {
						"ja"  : "Ja",
						"nein": "Nein"
					}
				}),
				new input({
					label   : "Baujahr",
					name    : "baujahr",
					type    : "text",
					required: true,
					regex   : /^\d{4}$/,
					value   : "2000"
				}),
				new subheadline({
					name : "sanierung",
					label: `Sanierung des Gebäudes
				(frei lassen wenn nicht saniert wurde)`
				}),
				new input({
					label: "Komplettsanierung Heizung im Jahr",
					name : "san_h",
					type : "text"
				}),
				new input({
					label: "Komplettsanierung Wasser,Sanitär im Jahr",
					name : "san_w",
					type : "text"
				}),
				new input({
					label: "Komplettsanierung Dach im Jahr",
					name : "san_d",
					type : "text"
				}),
				new input({
					label: "Komplettsanierung Elektro im Jahr",
					name : "san_e",
					type : "text"
				}),
				new subheadline({
					name : "sanierung_speziell",
					label: "	Spezielle Sanierungsfragen"
				}),
				new input({
					label: "Umfassende Kernsanierung (siehe Hilfe) im Jahr",
					name : "san_k",
					type : "text"
				}),
				new subheadline({
					label: "Flächenangaben zum Gebäude"
				}),
				new select({
					label : "Dachgeschoss",
					name  : "dachgeschoss",
					values: {
						"nicht ausgebaut"    : "nicht ausgebaut",
						"ausgebaut"          : "ausgebaut",
						"teilweise ausgebaut": "teilweise ausgebaut",
						"kein Dachgeschoss"  : "kein Dachgeschoss"
					},
					events: {
						change: {
							"nicht ausgebaut"    : {
								notrequire: [
									"wohnfl_dg"
								]
							},
							"kein Dachgeschoss"  : {
								notrequire: [
									"wohnfl_dg"
								]
							},
							"ausgebaut"          : {
								require: [
									"wohnfl_dg"
								]
							},
							"teilweise ausgebaut": {
								require: [
									"wohnfl_dg"
								]
							}
						}
					}
				}),
				new select({
					label : "Anzahl Geschosse",
					name  : "geschosse",
					values: {
						1 : 1,
						2 : 2,
						3 : 3,
						4 : 4,
						5 : 5,
						6 : 6,
						7 : 7,
						8 : 8,
						9 : 9,
						10: 10
					}
				}),
				new input({
					label: "Wohneinheiten",
					name : "wohneh",
					type : "number"
				}),
				new input({
					label     : "Wohnfläche Dachgeschoss",
					name      : "wohnfl_dg",
					type      : "number",
					labelAfter: "qm"
				}),
				new input({
					label: "Summe Wohnflächen Erd- und Obergeschoss(e)",
					name : "wohnfl_og",
					type : "number"
				}),
				new input({ // TODO make required if wohnfl_kg > 0
					label: "Kellerfläche (Länge x Breite)",
					name : "kellerfl",
					type : "number"
				}),
				new input({ // TODO validate wohnfl_kg <= kellerfl
					label: "Wohnfläche Kellergeschoss",
					name : "wohnfl_kg",
					type : "number"
				}),
				new input({
					label: "Gewerbefläche - falls vorhanden (eventl. Aufschläge werden nicht beachtet)",
					name : "gewerbefl",
					type : "number"
				}),
				new input({
					label: "Garagen außerhalb des Gebäudes",
					name : "Garagen",
					type : "number"
				}),
				new input({
					label: "Carports",
					name : "Carports",
					type : "number"
				}),
				new input({
					label: "Freistehende Nebengebäude BAK 1 oder 2 ohne wohnwirtschaftliche Nutzung - ohne Leitungswasser Deckung (z.B. Gartenhäuser, Bungalow o.ä. massiv gebaut, kein Holz).",
					name : "Nebengebaeude",
					type : "number"
				}),
				new select({
					label : "Berechnungsgrundlage",
					name  : "grund",
					values: {
						"Wert 1914"  : "Wert 1914 in Mark!",
						"Neubausumme": "Neubausumme 2016 in EUR"
					}
				}),
				new input({
					label: "Wert",
					name : "wert",
					regex: /^\d$/
				})
			],
			[
				new headline({
					label: "Bauausführungen"
				}),
				new input({
					label: "Wert 1914",
					name : "w14_show",
					type : "number"
				}),
				new subheadline({
					label: "Hochwertigere Bauausführung"
				}),
				new input({
					label     : "Dach",
					name      : "Dach",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Naturschieferdach, Kupferdach"
				}),
				new input({
					label     : "Außenwände",
					name      : "Aussenwaende",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Naturstein-, Keramik-, Kunststeinverkleidung, Handstrich-Klinker"
				}),
				new input({
					label     : "Decken/Wände",
					name      : "DeckenWaende",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Stuckarbeiten, Edelholzverkleidungen"
				}),
				new input({
					label     : "Fußböden",
					name      : "Fussboeden",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Natursteinböden, Parkett- oder Teppichböden in hochwertiger Qualität"
				}),
				new input({
					label     : "Fenster",
					name      : "Fenster",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Leichtmetall- oder Holzsprossenfenster"
				}),
				new input({
					label     : "Türen",
					name      : "Tueren",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Edelholz"
				}),
				new input({
					label     : "Sanitär",
					name      : "Sanitaer",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Hochwertige sanitäre Einrichtung"
				}),
				new input({
					label     : "Heizung",
					name      : "Waermepumpe",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Wärmepumpen"
				}),
				new input({
					label     : "Heizung",
					name      : "Fussbodenheizung",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Fußboden- und Deckenheizung"
				}),
				new input({
					label     : "Heizung",
					name      : "Solaranlage",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Solaranlagen"
				}),
				new input({
					label     : "Strom",
					name      : "Strom",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Photovoltaikanlagen"
				}),
				new input({
					label     : "Wellness",
					name      : "Schwimmbad",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Schwimmbäder"
				}),
				new input({
					label     : "Wellness",
					name      : "Whirlpool",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Whirlpool"
				}),
				new input({
					label     : "Wellness",
					name      : "Sauna",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Sauna"
				}),
				new subheadline({
					label: "Mindere Bauausführung"
				}),
				new input({
					label     : "Fußböden",
					name      : "Fussboeden1",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "PVC-Boden auf Estrich"
				}),
				new input({
					label     : "Fenster",
					name      : "Fenster1",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Einfaches Fensterglas"
				}),
				new input({
					label     : "Sanitär",
					name      : "Sanitaer1",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Ohne Bad / Dusche"
				}),
				new input({
					label     : "Heizung",
					name      : "Heizung1",
					type      : "checkbox",
					value     : "ja",
					labelAfter: "Ofenheizung"
				})
			],
			[
				new headline({
					label: "Versicherungsumfang"
				}),
				new subheadline({
					name : "sanierung",
					label: `Versicherte Gefahren`
				}),
				new select({
					label : "Feuerschutz",
					name  : "Feuerschutz",
					type  : "checkbox",
					values: {
						"ja"  : "ja",
						"nein": "nein"
					}
				}),
				new select({
					label : "Leitungswasser",
					name  : "Leitungswasser",
					type  : "checkbox",
					values: {
						"ja"  : "ja",
						"nein": "nein"
					}
				}),
				new select({
					label : "Sturm-Hagel",
					name  : "SturmHagel",
					type  : "checkbox",
					values: {
						"ja"  : "ja",
						"nein": "nein"
					}
				}),
				new select({
					label : "Elementarschäden",
					name  : "elementar",
					type  : "checkbox",
					value : "nein",
					values: {
						"ja"  : "ja",
						"nein": "nein"
					},
					events: {
						change: {
							"ja"  : {
								show: ["ueberschwemmung"]
							},
							"nein": {
								hide: ["ueberschwemmung"]
							}
						}
					}
				}),
				new select({
					label : "Überschwemmung einschließen",
					name  : "ueberschwemmung",
					type  : "checkbox",
					values: {
						"ja"  : "ja",
						"nein": "nein"
					}
				})
			]
		];

		this.sparte = "WG";
	};

	/**
	 *
	 * @param params
	 * @returns {*}
	 */
	wert1914_calc(params) {
		var Zeitwert = 12.3;
		var f = 0;
		var Selbstangabe = params['Wert1914selbst'];
		var WG_Art = params['WG_Art'];
		var Dachgeschoss = params['Dachgeschoss'];
		var Etagen = params['Etagen'];
		var WFL_DG = params['WFL_DG'];
		var WFL_OG = params['WFL_OG'];
		var WFL_KG = params['WFL_KG'];
		var KellerFL = params['KellerFL'];
		var GewerbeFL = params['GewerbeFL'];
		var Garagen = params['Garagen'];
		var Carports = params['Carports'];
		var Nebengeb = params['Nebengeb'];

		if (isNaN(parseFloat(KellerFL))) {
			return -1;
		}
		else if (isNaN(parseFloat(WFL_KG))) {
			return -2;
		}
		else if (parseFloat(WFL_KG) > 0 && parseFloat(KellerFL) < 1) {
			return -3;
		}
		else if (parseFloat(WFL_KG) > parseFloat(KellerFL) && KellerFL != '') {
			return -4;
		}

		if (Selbstangabe != 'ja' && WG_Art != 'feu') {
			if (Etagen == 1 && ( Dachgeschoss == 'ausgebaut' || Dachgeschoss == 'teilweise ausgebaut' )) {
				f = KellerFL > 0 ? 165 : 140;
			}
			if (Etagen == 1 && Dachgeschoss == 'nicht ausgebaut') {
				f = KellerFL > 0 ? 190 : 160;
			}
			if (Etagen == 1 && Dachgeschoss == 'kein Dachgeschoss') {
				f = KellerFL > 0 ? 190 : 160;
			}

			if (Etagen >= 2 && ( Dachgeschoss == 'ausgebaut' || Dachgeschoss == 'teilweise ausgebaut' )) {
				f = KellerFL > 0 ? 150 : 130;
			}
			if (Etagen >= 2 && Dachgeschoss == 'nicht ausgebaut') {
				f = KellerFL > 0 ? 165 : 140;
			}
			if (Etagen >= 2 && Dachgeschoss == 'kein Dachgeschoss') {
				f = KellerFL > 0 ? 190 : 160;
			}


			if (Etagen >= 3 && Dachgeschoss == 'kein Dachgeschoss') {
				if (Etagen == 3 || Etagen == 4) {
					f = 150;
				}
				if (Etagen == 5 || Etagen == 6) {
					f = 135;
				}
				if (Etagen >= 7 && Etagen <= 10) {
					f = 125;
				}
			}
			if (Etagen >= 3 && Dachgeschoss == 'nicht ausgebaut') {
				if (Etagen == 3 || Etagen == 4) {
					f = 150;
				}
				if (Etagen >= 5 && Etagen <= 10) {
					f = 130;
				}
			}
			if (Etagen >= 3 && ( Dachgeschoss == 'ausgebaut' || Dachgeschoss == 'teilweise ausgebaut' )) {
				if (Etagen == 3 || Etagen == 4) {
					f = 140;
				}
				if (Etagen == 5 || Etagen == 6) {
					f = 135;
				}
				if (Etagen >= 7 && Etagen <= 10) {
					f = 125;
				}
			}

			var w14qm = f;
			var Dach = params['Dach'];
			var Aussenwaende = params['Aussenwaende'];
			var DeckenWaende = params['DeckenWaende'];
			var Fussboeden = params['Fussboeden'];
			var Fussboeden1 = params['Fussboeden1'];
			var Fenster = params['Fenster'];
			var Fenster1 = params['Fenster1'];
			var Tueren = params['Tueren'];
			var Sanitaer = params['Sanitaer'];
			var Sanitaer1 = params['Sanitaer1'];
			var Heizung = params['Heizung']; // veraltet
			var Waermepumpe = params['Waermepumpe']; // Heizung neu
			var Solaranlage = params['Solaranlage']; // Heizung neu
			var Fussbodenheizung = params['Fussbodenheizung']; // Heizung neu
			var Heizung1 = params['Heizung1'];

			f = Dach == 'ja' ? parseFloat(f) + 4 : f;
			f = Aussenwaende == 'ja' ? parseFloat(f) + 5 : f;
			f = DeckenWaende == 'ja' ? parseFloat(f) + 6 : f;
			f = Fussboeden == 'ja' ? parseFloat(f) + 4 : f;
			f = Fussboeden1 == 'ja' ? parseFloat(f) - 3 : f;
			f = Fenster == 'ja' ? parseFloat(f) + 4 : f;
			f = Fenster1 == 'ja' ? parseFloat(f) - 3 : f;
			f = Tueren == 'ja' ? parseFloat(f) + 3 : f;
			f = Sanitaer == 'ja' ? parseFloat(f) + 6 : f;
			f = Sanitaer1 == 'ja' ? parseFloat(f) - 4 : f;
			f = ( Heizung == 'ja' || Waermepumpe == 'ja' || Solaranlage == 'ja' || Fussbodenheizung == 'ja' ) ? parseFloat(f) + 6 : f;
			f = Heizung1 == 'ja' ? parseFloat(f) - 4 : f;

			var Wert1914 = ( parseFloat(f) * (parseFloat(WFL_OG) + parseFloat(WFL_DG) + parseFloat(GewerbeFL) ) )
				+ ( parseFloat(WFL_KG) * 15 )
				+ ( parseFloat(Garagen) * 700 )
				+ ( parseFloat(Carports) * 300 )
				+ ( parseFloat(Nebengeb) * 100 );

			//console.log(f);
			//console.log(WFL_OG);
			//console.log(Garagen);
			//console.log(Wert1914);
			//console.log(Zeitwert);
			//console.log(Nebengeb);
			//console.log(Carports);

			var Grund = params['Grund'];
			var Wert = 0;
			if (Grund == 'Neubausumme') {
				Wert = Wert1914 * Zeitwert;
			}
			else {
				Wert = Math.ceil(Wert1914 / 100) * 100;
			}
			if (Wert <= 0) {
				return -5;
			}
			return [Wert, w14qm];
		}
		return 0;
	}

	wert1914() {
		var params = {
			'Grund'           : this.model.grund, /* Neubausumme|Wert1914 */
			'Wert1914selbst'  : 'nein', /* ja|nein */
			'WG_Art'          : this.model.versicherungsschutz, /* wg|feu */
			'Dachgeschoss'    : this.model.dachgeschoss, /* ausgebaut|teilweise ausgebaut|nicht ausgebaut|kein Dachgeschoss */
			'Etagen'          : this.model.geschosse || 0, /* Der Inhalt vom Feld "geschosse" */
			'WFL_DG'          : this.model.wohnfl_dg || 0, /* Der Inhalt vom Feld "wohnfl_dg" */
			'WFL_OG'          : this.model.wohnfl_og || 0, /* Der Inhalt vom Feld "wohnfl_og" */
			'WFL_KG'          : this.model.wohnfl_kg || 0, /* Der Inhalt vom Feld "wohnfl_kg" */
			'KellerFL'        : this.model.kellerfl || 0, /* Der Inhalt vom Feld "kellerfl" */
			'GewerbeFL'       : this.model.gewerbefl || 0, /* Der Inhalt vom Feld "" */
			'Garagen'         : this.model.Garagen || 0, /* Der Inhalt vom Feld "Garagen" */
			'Carports'        : this.model.Carports || 0, /* Der Inhalt vom Feld "Carports" */
			'Nebengeb'        : this.model.Nebengebaeude || 0, /* Der Inhalt vom Feld "Nebengebaeude" */
			'Dach'            : '', /* ja|nein */
			'Aussenwaende'    : '', /* ja|nein */
			'DeckenWaende'    : '', /* ja|nein */
			'Fussboeden'      : '', /* ja|nein */
			'Fussboeden1'     : '', /* ja|nein */
			'Fenster'         : '', /* ja|nein */
			'Fenster1'        : '', /* ja|nein */
			'Tueren'          : '', /* ja|nein */
			'Sanitaer'        : '', /* ja|nein */
			'Sanitaer1'       : '', /* ja|nein */
			'Heizung'         : '', /* ja|nein */
			'Waermepumpe'     : '', /* ja|nein */
			'Solaranlage'     : '', /* ja|nein */
			'Fussbodenheizung': '', /* ja|nein */
			'Heizung1'        : '' /* ja|nein */
		};


		var re = this.wert1914_calc(params);

		console.log(params);
		console.log(re);

		if (re == -1) {
			// Kellerfläche ist keine Zahl
		}
		else if (re == -2) {
			// Wohnfläche Kellergeschoss ist keine Zahl
		}
		else if (re == -3) {
			// Kellerfläche muss angegeben werden
		}
		else if (re == -4) {
			// Wohnfläche Kellergeschoss ist größer als Kellerfläche
		}
		else if (re == -5) {
			// Es konnte keine Berechungsgrundlage ermittelt werden.
			// Bitte Prüfen Sie ihre Eingaben
		}
		if (re[0] > 0) {
			//	re[ 0 ] = Berechnungsergebnis
			//	re[ 1 ] = Faktor (QM in Mark) - muss in hidden Feld "w14qm" geschrieben und an Antrag übermittelt werden
		}

		return re;
	}
}

module.exports = config;