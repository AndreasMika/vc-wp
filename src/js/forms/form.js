'use strict';
const xml2json = require("../helpers/xml2json.js");
const _ = require("lodash");

class form {
	constructor(target) {
		//HTMLElement.prototype.realAddEventListener = HTMLElement.prototype.addEventListener;
		////HTMLElement.prototype.addEventListener = function (a, b, c) {
		////	//this.realAddEventListener(a, reportIn, c);
		////
		////	//console.log({a, b, c})
		////	this.realAddEventListener(a, b, c);
		////	if (!this.lastListenerInfo) {
		////		this.lastListenerInfo = [];
		////	}
		////
		////	this.lastListenerInfo.push({a, b, c});
		////};

		/**
		 *
		 * @type {{}}
		 */
		this.getLogoData();
		this.model = {};
		this.form = null;
		this.result = null;
		this.filter = null;
		this.target = "mrmoney-" + target || null;
		//this.action = "bw24-tarifrechner/php/proxy.php";
		this.pageObjects = [];
		/**
		 *
		 * @type {Array}
		 */
		this.inputItems = [];
		this.formClass = "";
		this.sp_lang = "";
		// this.currentPaymentFilter = 0; // need for correct price calculation
		this.pageErrors = [];
		this.selectedTarife = [];
		this.showLocalError = function (i,m) {
			jQuery(i).parent().find('.local-error').remove();
			if (m) {jQuery(i).parent().append('<span class="local-error">'+m+'</span>');}
		}
	}

	/**
	 *
	 * @returns {Element}
	 */
	getForm() {
		this.form = document.createElement("form");
		this.form.setAttribute("method", "post");
		//form.setAttribute("action", "/php/proxy.php");
		this.form.setAttribute("class", "vcheck-form col s12 " + this.formClass);

		let id = document.createElement("input");
		id.setAttribute("name", "id");
		id.setAttribute("type", "hidden");
		id.setAttribute("value", window.mrmoney.partner_id);

		let ac = document.createElement("input");
		ac.setAttribute("name", "action");
		ac.setAttribute("type", "hidden");
		ac.setAttribute("value", this.action);

		//let pa = document.createElement("input");
		//pa.setAttribute("name", "pa");
		//pa.setAttribute("type", "hidden");
		//pa.setAttribute("value", "herstellerx");


		let sparte = document.createElement("input");
		sparte.setAttribute("name", "sp");
		sparte.setAttribute("type", "hidden");
		sparte.setAttribute("value", this.sparte);

		//let userip = document.createElement("input");
		//userip.setAttribute("name", "IP_USER");
		//userip.setAttribute("type", "hidden");
		//userip.setAttribute("value", this.sparte);

		this.form.appendChild(ac);
		this.form.appendChild(id);
		//form.appendChild(pa);
		this.form.appendChild(sparte);
		//form.appendChild(userip);

		return this.form;
	}

	/**
	 *
	 * @returns {Element}
	 */
	getButton(text, type) {

		text = text || "Absenden";
		type = type || "submit";

		let submitButton = document.createElement("button");
		submitButton.setAttribute("type", type);

		jQuery(submitButton).html(text);

		return submitButton;
	}

	/**
	 *
	 * @returns {boolean}
	 */
	isPageValid() {
		this.pageErrors = [];

		let addError = (it, pit, message) => {

			message = message || "ist ein Pflichtfeld";

			this.pageErrors.push({
				error  : it.name,
				message: `${it.label} ${message}`,
				block  : pit
			});

			pit.className = "error " + pit.className;
		};

		for (let p in this.pageObjects) {

			if (this.pageObjects[p].className.indexOf("active") !== -1) {

				for (let i in this.pages[p]) {

					let item = this.pages[p][i];

					if (item.item) {

						let parentItem = item.item.parentElement;

						//remove error class first
						if (parentItem.className.indexOf("error") !== -1) {
							parentItem.className = parentItem.className.replace("error ", "");
						}

						if (item.regex) {
							let pattern = new RegExp(item.regex);
							let res = pattern.test(item.item.value);

							if (!res) {
								addError(item, parentItem, "hat falsches Format oder entspricht nicht der Vorgaben!");
							}
						}

						if (item.required && (item.model === null || item.model === "")) {

							addError(item, parentItem);

						}
					}

				}

				break;
			}
		}

		//console.log(this.pageErrors);

		return this.pageErrors.length === 0;
	}

	getLogoData(){
		jQuery.ajax({
			url     : window.mrmoney.path + "php/img.php",
			dataType: "json",
			success : (data) => {
				this.logoData = data;
			}
		});
	}
	showLoader() {
		if (jQuery('#loader').length<1) {
			jQuery('body').append('<div id="loader"><div><div></div></div></div>');
		}
		jQuery('#loader').fadeIn();
	}
	hideLoader(){
		jQuery('#loader').fadeOut();
	}
	

	bindEvent() {
		jQuery(this.form).on("submit", (e) => {
			e.preventDefault();

			if (this.isPageValid()) {
				this.showLoader();

				jQuery.ajax({
					url     : window.mrmoney.path + "php/proxy.php",
					data    : jQuery(this.form).serializeArray(),
					dataType: "xml",
					method  : "get",
					success : (data) => {
						this.tarife = xml2json.convertToJson(data);

						_.map(this.tarife, function(i){
							i.vs = i.vs.replace(/\./g, '');
							let q = Math.round(parseFloat(i.beitrag) / 12 * 100) / 100;
							i.price = +q.toFixed(2);

							return i;
						});

						this.tarife = this.setTarife(this.tarife);

						this.drawResults(this.tarife);
						this.drawFilter(this.tarife);
					},
					complete : (data) => {
						this.hideLoader();
					}
				});
			} else {

				jQuery('html, body').animate({
					scrollTop: jQuery('.error', this.form).eq(0).offset().top-50
				}, 400); 

			}
		});

		jQuery(document).on('click', 'a.ajax-link', function (e) {
			e.preventDefault();
			var href = jQuery(this).attr('href')+'&ajax=1';
			jQuery.colorbox({iframe:true, innerWidth:"600px", height:"95%", href:href, onComplete: false, fixed:true });
			return false;
		});

		jQuery(document).on('click', '.rating', function (e) {
			e.preventDefault();
			var href = jQuery(this).data('href');
			jQuery.colorbox({iframe:false, width:"95%", maxWidth:'480px', href:href, onComplete: false, fixed:true });
			return false;
		});

		jQuery(document).on('click', '#compare', (e) => {

			if (this.selectedTarife.length>0) {
				let data = {
					id: window.mrmoney.partner_id,
					sp: this.sparte,
					IP_USER: '',
					sp_lang: this.sp_lang,
					vergleichen: 'Leistungsvergleich'
				};

				for (var i in this.selectedTarife) {
					let y = _.find(this.tarife, {tarifnr: i})
					if (y!='undefined') {
						data['tarif_'+y.tarifnrtemp] = y.antrag;
						data.IP_USER = y.antrag.match(/IP_USER=([0-9\.-]*)/)[1];
					}
				}

				let href = window.mrmoney.url+'/?page_id='+window.mrmoney.checkout+'&'+Object.keys(data).map(function(key) {return key+'='+data[key];}).join('&')+'&ajax=1';
				jQuery.colorbox({iframe:true, width:'95%', height:"95%", href:href, onComplete: false, fixed:true });
			}

		// id
			// ip_user
			// sp
			// sp_lang
			// vergleichen=Leistungsvergleich
            //
			// tariff_xxxx

			return false;
		});



		jQuery('[data-tooltip!=""]').qtip({content: {attr: 'data-tooltip'}});

	}

	drawFilter (xml) {}

	resortXml (xml) {
		let el1 = _.findKey(xml, function (item) { return item["TIP"] != "0" });
		if (typeof el1 != 'undefined') {el1 = xml.splice(el1, 1);}

		let el2 = _.findKey(xml, function (item) { return item["TIP"] != "0" });
		if (typeof el2 != 'undefined') {el2 = xml.splice(el2, 1);}

		if (typeof el1 != 'undefined') { xml = el1.concat(xml); }
		if (typeof el2 != 'undefined') { xml = el2.concat(xml); }

		return xml;
	}

	drawResults(xml) {

		xml = this.resortXml(xml);

		// console.log(xml);

		if(!this.result) {
			this.result = document.createElement("div");
			this.result.setAttribute("class", "result-page " + this.formClass);
			jQuery(this.form).hide();
			jQuery(this.form).after(this.result);
		}

		let $result = jQuery(this.result);

		$result.html(`
			<button id="compare">Leistungsvergleich</button>
			<div class="row headline">
				<div class="cell cell-1">Anbieter</div>
				<div class="cell cell-2">Tarifumfang</div>
				<div class="cell cell-3">Leistung</div>
				<div class="cell cell-4">Preis</div>
				<div class="cell cell-5"></div>
				<div class="clearfix"></div>
			</div>
		`);

		let maxPunkte = 0;

		for (let i in xml) {
			let item = xml[i];
			if (typeof  item == "object") {
				let punkte = item["tar_punkte"];
				if(parseInt(punkte) > parseInt(maxPunkte)) maxPunkte = punkte;
			}
		}

		for (let i in xml) {
			let item = xml[i];
// console.log(item);
			if (typeof  item == "object") {
				let row = document.createElement("div");

				let cell1 = document.createElement("div");
				cell1.setAttribute("class", "cell cell-1 first " + this.formClass);
				let cell2 = document.createElement("div");
				cell2.setAttribute("class", "cell cell-2 " + this.formClass);
				let cell3 = document.createElement("div");
				cell3.setAttribute("class", "cell cell-3 " + this.formClass);
				let cell4 = document.createElement("div");
				cell4.setAttribute("class", "cell cell-4 " + this.formClass);
				let cell5 = document.createElement("div");
				cell5.setAttribute("class", "cell cell-5 last " + this.formClass);

				let clearfix = document.createElement("div");
				clearfix.setAttribute("class", "clearfix");

				let price = item['price'].toString().replace(".", ",");

				let company = item["ges"];
				let companyShort = item["ges_kurz"];
				let laufzeit = item["laufzeit"];
				let versicherungssumme = item["vs"];
				let ausfall = item["ausfall"];
				let sb = item["sb"];
				let alter = item["alter"];
				let punkte = item["tar_punkte"];
				let tarifnr = item["tarifnr"];
				let tarifname = item["tar"];
				let antrag = item["antrag"].replace(/~/g, "&").replace('IhreID', window.mrmoney.partner_id);

				let logoName = item['tar'].toLowerCase().replace(/-.*/,'');
				logoName = logoName.replace(/ü/g,'ue');
				logoName = logoName.replace(/ä/g,'ae');
				logoName = logoName.replace(/ö/g,'oe');
				logoName = logoName.replace(/ß/g,'ss');

				let tmp = {
					"lv": "lv1871",
					"max": "maxpool",
					"medien": "medienversicherung",
					"sy24": "syncro24",
					"syncro": "syncro24",
					"muenchener": "muenchner",
					"hanse": "hansemerkur",
					"slp": "swiss_life",
					"cif": "conceptif",
					"volkswohl": "volkswohlbund",
					"geld.de_hauskasko": "geldde_hauskasko",
					"geld.de_exklusiv": "geldde_exklusiv",
					"unfalltarif24.de": "unfalltarif24de",
					"geld.de": "geldde"
				};
				if (typeof tmp[logoName]!='undefined') {
					logoName = tmp[logoName];
				}

				let logo = '<div style="background-image:url('+this.logoData.logoimage+');'+this.logoData.lp[logoName]+'"></div>';

				let rv = item['ges_bewsterne'];

				let getStarClass = function (i, rv) {
					let r = '';
					if (rv >= i+.5) {r='half';}
					if (rv >= i+1)  {r='full';}
					return r;
				}

				let rating = '<div class="rating" data-href="'+window.mrmoney.path+'php/rates.php?t='+company+'">' +
					'<div class="onestar '+getStarClass(0,rv)+'"></div>' +
					'<div class="onestar '+getStarClass(1,rv)+'"></div>' +
					'<div class="onestar '+getStarClass(2,rv)+'"></div>' +
					'<div class="onestar '+getStarClass(3,rv)+'"></div>' +
					'<div class="onestar '+getStarClass(4,rv)+'"></div>' +
				'</div>';


				row.setAttribute("class", "row tarif-" + tarifnr + " row-" + this.formClass + ' rownum-'+i);
				row.setAttribute("data-tarifnr", tarifnr);

				jQuery(cell1).html(logo + '<div class="tarifname">'+tarifname+'</div>' + rating);

				jQuery(cell2).html(
					`<span class="optitle">Leufzeit:</span> <span class="opvalue">${laufzeit} Jahr</span>
						<span class="clr"></span>
						<span class="optitle">Vers.summe:</span> <span class="opvalue">${versicherungssumme} €</span>
						<span class="clr"></span>
						<span class="optitle">Ausfalldeckung:</span> <span class="opvalue">${ausfall}</span>
						<span class="clr"></span>
						<span class="optitle">Kinder < 7 Jahre:</span> <span class="opvalue"></span>
						<span class="clr"></span>
						<span class="optitle">Selbstbeteiligung:</span> <span class="opvalue">${sb} €</span>
						<span class="clr"></span>`
				);

				let persent = maxPunkte / 100 * punkte;
				
				jQuery(cell3).html(
					`<span class="balken">
						<span class="balke b1 ${persent > 100/6 ? 'active': ''}"></span>
						<span class="balke b2 ${persent > 100/6 * 2 ? 'active': ''}"></span>
						<span class="balke b3 ${persent > 100/6 * 3 ? 'active': ''}"></span>
						<span class="balke b4 ${persent > 100/6 * 4 ? 'active': ''}"></span>
						<span class="balke b5 ${persent > 100/6 * 5 ? 'active': ''}"></span>
						<span class="balke b6 ${persent > 100/6 * 6 ? 'active': ''}"></span>
						<span class="clearfix"></span>
					</span>
					<div class="clr"></div>
					${punkte} von ${maxPunkte} Punkten`
				);

				jQuery(cell4).html(
					`<b class="price">${price} €</b><br>
					monatlich <br>
					
					<a href="${window.mrmoney.url}/?page_id=${window.mrmoney.angebot}&${antrag}&g_price=${price}&g_tarifname=${tarifname}&g_firm=${company}&g_sparte=${this.sparte}" class="ajax-link">Angebot anfordern</a> <br>
						
					<a href="${window.mrmoney.url}/?page_id=${window.mrmoney.checkout}&act=antrag&${antrag}" class="ajax-link">Antrag</a>`
				);

				jQuery(cell5).html(
					`<input type="checkbox" name="compare-tarif" id="checkbox-tarif-${tarifnr}" value="${tarifnr}"/>`
				);

				jQuery(document).on("change", `#checkbox-tarif-${tarifnr}`, (data) => {
					if (data.target.checked) {
						this.selectedTarife[data.target.value] = true;
					} else {
						delete this.selectedTarife[data.target.value];
					}

				});


				
				row.appendChild(cell1);
				row.appendChild(cell2);
				row.appendChild(cell3);
				row.appendChild(cell4);
				row.appendChild(cell5);
				row.appendChild(clearfix);

				this.result.appendChild(row);
			}
		}
	}

	toString() {
		this.pages.forEach((pageItems, key) => {
			let page = document.createElement("div");
			page.setAttribute("id", "page-" + key);
			page.setAttribute("class", "vcheck-page " + (key == 0 ? "active" : ""));

			pageItems.forEach((item) => {
				item.form = this;
				page.appendChild(item.toString());
				this.inputItems.push(item);
			});

			// create back and next buttons
			if (this.pages.length > 1) {

				// zurück utton
				if (key > 0) {
					let backButton = this.getButton("Zurück");
					page.appendChild(backButton);

					jQuery(backButton).on("click", (event) => {

						event.preventDefault();

						for (let p in this.pageObjects) {

							if (this.pageObjects[p].className.indexOf("active") !== -1) {
								this.pageObjects[p].className = "vcheck-page";
								this.pageObjects[parseInt(p) - 1].className = "vcheck-page active";

								break;
							}
						}

					});
				}

				// weiter button

				if (key < pageItems.length) {

					let nextButton = this.getButton("Weiter");
					page.appendChild(nextButton);
					jQuery(nextButton).on("click", (event) => {

						event.preventDefault();

						if (this.isPageValid()) {
							for (let p in this.pageObjects) {

								if (this.pageObjects[p].className.indexOf("active") !== -1) {
									this.pageObjects[p].className = "vcheck-page";
									this.pageObjects[parseInt(p) + 1].className = "vcheck-page active";

									break;
								}
							}
						} else {

						}


					});
				}
			}

			this.pageObjects.push(page);

			this.form.appendChild(page);
		});

		let submitButton = this.getButton();

		this.form.appendChild(submitButton);

		//if (this.target === null) {
		//	document.body.appendChild(this.form);
		//}
		//else {
		//
		//	console.log(this.target);
		//
			document.getElementById("mrmoney-form").appendChild(this.form);
		//}

		//let $formOutput = jQuery("#mrmoney-form");
		//let type = $formOutput.data("type");







		var isEmptyObject = function(obj) {
			for (var i in obj) {
				if (obj.hasOwnProperty(i)) {
					return false;
				}
			}
			return true;
		}


		/**
		 * call all custom binded events, to indicate default state
		 */
		this.inputItems.forEach(function (item) {

			if (!isEmptyObject(item.events)) {
				_.map (item.events, function (ev, evname){
					jQuery(item.item).trigger(evname);
				})
			}

			if (item.item) {
				for (let c in item.item.lastListenerInfo) {
					item.item.lastListenerInfo[c].b({
						target: item.item
					});
				}
			}
		});

		this.bindEvent();
	}

	/**
	 *
	 * @param {json} data
	 */
	setTarife(data) {
		_.each(data, function(item) {
			if(item["zw_erlaubt"]) {
				item["zw_erlaubt"] = item["zw_erlaubt"].split("").reverse().join(";");
			}

			if(item["zw_aufschlag"]) {

			}

			return item;
		});

		return data;
	}
}

module.exports = form;