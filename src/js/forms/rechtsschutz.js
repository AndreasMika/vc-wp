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

        this.formClass = "rechtsschutz";
        // this.sp_lang = 'haftpflicht';
        this.form = this.getForm();

        var setValueOf_rs_and_ohneberuf = function(){
            var chk_privat 				= jQuery('#tarif_privat').is(':checked');
            var chk_beruf				= jQuery('#tarif_beruf').is(':checked');
            var chk_verkehr_familie		= jQuery('#tarif_verkehr_familie').is(':checked');
            var chk_miete				= jQuery('#tarif_miete').is(':checked');
            var chk_verkehr				= jQuery('#tarif_verkehr').is(':checked');
            var ohne_beruf 				= '';
            var rs_tarif 				= 'ungültige Kombination';
            var chk_vermieter = (jQuery('#vermiet').val() != '0')? true: false;

            if(chk_privat == true && chk_beruf == true && chk_verkehr == false && chk_miete == false && chk_verkehr_familie == false){
                rs_tarif = 'Privat- und Berufs RS';
            }
            else if(chk_privat == true && chk_beruf == false && chk_verkehr == false && chk_miete == false && chk_verkehr_familie == false){
                rs_tarif = 'Privat- und Berufs RS';
                ohne_beruf = 'ja';
            }
            else if(chk_privat == true && chk_beruf == true && chk_verkehr == false && chk_miete == true && chk_verkehr_familie == false){
                rs_tarif = 'Privat- und Berufs, Eigentum und Miet RS';
            }
            else if(chk_privat == true && chk_beruf == false && chk_verkehr == false && chk_miete == true && chk_verkehr_familie == false){
                rs_tarif = 'Privat- und Berufs, Eigentum und Miet RS';
                ohne_beruf = 'ja';
            }
            else if(chk_privat == true && chk_beruf == true && chk_verkehr == false && chk_miete == false && chk_verkehr_familie == true){
                rs_tarif =  'Privat- und Berufs und Verkehrs RS';
            }
            else if(chk_privat == true && chk_beruf == false && chk_verkehr == false && chk_miete == false && chk_verkehr_familie == true){
                rs_tarif =  'Privat- und Berufs und Verkehrs RS';
                ohne_beruf = 'ja';
            }
            else if(chk_privat == true && chk_beruf == true && chk_verkehr == false && chk_miete == true && chk_verkehr_familie == true){
                rs_tarif = 'Privat- und Berufs, Verkehrs, Eigentum und Miet RS';
            }
            else if(chk_privat == true && chk_beruf == false && chk_verkehr == false && chk_miete == true && chk_verkehr_familie == true){
                rs_tarif = 'Privat- und Berufs, Verkehrs, Eigentum und Miet RS';
                ohne_beruf = 'ja';
            }
            else if(chk_privat == false && chk_beruf == false && chk_verkehr == true && chk_miete == false && chk_verkehr_familie == false){
                rs_tarif = 'Verkehrs Rechtsschutz';
            }
            else if(chk_privat == false && chk_beruf == false && chk_verkehr == false && chk_miete == false && chk_verkehr_familie == true){
                rs_tarif = 'Verkehrs Rechtsschutz für die Familie';
            }
            else if(chk_privat == false && chk_beruf == false && chk_verkehr == false && chk_miete == false && chk_verkehr_familie == false && chk_vermieter == true){
                rs_tarif = 'Vermieter RS (privat)';
            }

            jQuery('#ohneberuf').val(ohne_beruf);
            jQuery('#rs').val(rs_tarif);

            setVisibilityOf_vermiet();
        }
        var setVisibilityOf_vermiet = function (){
            var chk_privat 				= jQuery('#tarif_privat').is(':checked');
            var chk_beruf				= jQuery('#tarif_beruf').is(':checked');
            var chk_verkehr_familie		= jQuery('#tarif_verkehr_familie').is(':checked');
            var chk_miete				= jQuery('#tarif_miete').is(':checked');
            var chk_verkehr				= jQuery('#tarif_verkehr').is(':checked');

            var vis = true;
            if (chk_verkehr) {vis = false;}
            if (chk_verkehr_familie && !chk_privat && !chk_miete && !chk_beruf) {vis = false;}

            if (vis) {jQuery('#vermiet-wrapper').show();} else {jQuery('#vermiet-wrapper').hide();}
        }

        this.pages = [
            [
                new headline({label: "Rechtsschutzversicherung Vergleich"}),
                new subheadline ({label: 'Was möchten Sie versichern?'}),

                new input({
                    label   : "Privat-RS",
                    tooltip : 'Versichert sind: <br>- Alle Familienangehörige im privaten Bereich.',
                    name    : "tarif_privat",
                    type    : "checkbox",
                    value   : "1",
                    checked : true,
                    events: {
                        change: {
                            checked : {
                                // show: ['vermiet'],
                                custom: function (ev) {
                                    jQuery('#tarif_verkehr').attr('checked', false);
                                    jQuery('#tarif_verkehr').trigger('change');
                                    jQuery('#rs').val('Privat- und Berufs und Verkehrs RS');
                                    jQuery('#ohneberuf').val('ja');
                                }
                            },
                            unchecked : {
                                // hide: ['vermiet'],
                                custom: (ev) => {

                                    if (jQuery('#tarif_beruf').is(':checked')) {
                                        jQuery(ev.target).attr('checked', true);
                                        jQuery(ev.target).trigger('change');
                                        this.showLocalError(ev.target, 'Für "Berufs-RS" benötigt!');
                                       
                                    } else if (jQuery('#tarif_miete').is(':checked')) {
                                        jQuery(ev.target).attr('checked', true);
                                        jQuery(ev.target).trigger('change');
                                        this.showLocalError(ev.target, 'Für "Eigentums- und Mieter-RS" benötigt!');
                                    } else  {
                                        this.showLocalError(ev.target, false);
                                    }
                                }
                            },
                            default: {
                                custom: function (ev){setValueOf_rs_and_ohneberuf();}
                            }
                        }
                    }

                }),
                new input({
                    name    : "rs",
                    type    : "hidden",
                    value   : "Privat- und Berufs und Verkehrs RS"
                }),
                new input({
                    name    : "ohneberuf",
                    type    : "hidden",
                    value   : "ja"
                }),

                new input({
                    label   : "Berufs-RS",
                    tooltip : 'Versichert sind: <br>- Alle Familienangehörige im beruflichen Bereich',
                    labelAfter: 'nur zusammen mit "Privat-RS"',
                    name    : "tarif_beruf",
                    type    : "checkbox",
                    value   : "1",
                    checked : true,

                    events  : {
                        change: {
                            checked : {
                                custom: function (ev) {
                                    jQuery('#tarif_privat').attr('checked', true);
                                    jQuery('#tarif_privat').trigger('change');
                                }
                            },
                            unchecked : {
                                custom: function (ev) {}
                            },
                            default: {
                                custom: function (ev){setValueOf_rs_and_ohneberuf();}
                            }
                        }
                    }
                }),

                new input({
                    label   : "Verkehrs-RS Familie (für alle KFZ)",
                    tooltip : 'Versichert sind: <br>- Alle KFZs die auf die Familie zugelassen sind (KFZ der Kinder nur unter bestimmten Voraussetzungen)<br>- Alle Familienangehörige als Fahrer eigener und fremder Fahrzeuge<br>- Alle fremden Fahrer der Fahrzeuge der Familie',
                    name    : "tarif_verkehr_familie",
                    type    : "checkbox",
                    value   : "1",
                    checked : true,
                    events  : {
                        change: {
                            checked : {
                                hide: ['vermiet'],
                                custom: function (ev) {
                                    jQuery('#vermiet').val(0);
                                    jQuery('#vermiet').trigger('change');
                                    jQuery('#tarif_verkehr').attr('checked', false);
                                    jQuery('#tarif_verkehr').trigger('change');
                                }
                            },
                            unchecked: {
                                show: ['vermiet'],
                                custom: function () {}
                            },
                            default: {
                                custom: function (ev){setValueOf_rs_and_ohneberuf();}
                            }

                        }
                    }
                }),
                new input({
                    label   : "Eigentums- und Mieter-RS",
                    tooltip : 'Versichert sind: <br>- Eigene oder gemietete Wohnung, Eigenheim, eigenes oder gemietetes Grundstück; <strong>ACHTUNG:</strong> keine vermieteten Wohneinheiten! (Extra Beitrag notwendig)',
                    labelAfter: 'nur zusammen mit "Privat-RS"',
                    name    : "tarif_miete",
                    type    : "checkbox",
                    value   : "1",
                    checked : false,
                    events  : {
                        change: {
                            checked : {
                                custom: function (ev) {
                                    jQuery('#tarif_privat').attr('checked', true);
                                    jQuery('#tarif_privat').trigger('change');
                                }
                            },
                            unchecked : {
                                custom: function (ev) {}
                            },
                            default: {
                                custom: function (ev){setValueOf_rs_and_ohneberuf();}
                            }

                        }
                    }
                }),
                new input({
                    label   : "Verkehrs-RS nur für den VN",
                    tooltip : 'Versichert sind: <br>- Die im Antrag genannten KFZ, müssen auf den VN zugelassen sein<br>- Versicherungsnehmer (VN) als Fahrer der eigenen und auch fremder Fahrzeuge<br>- Alle Fahrer der versicherten Fahrzeuge',
                    labelAfter : 'nur einzeln versicherbar',
                    name    : "tarif_verkehr",
                    type    : "checkbox",
                    value   : "1",
                    checked : false,
                    events  : {
                        change: {
                            checked : {
                                custom: function (ev) {
                                    jQuery('#tarif_miete').attr('checked', false);
                                    jQuery('#tarif_miete').trigger('change');
                                    jQuery('#tarif_verkehr_familie').attr('checked', false);
                                    jQuery('#tarif_verkehr_familie').trigger('change');
                                    jQuery('#tarif_beruf').attr('checked', false);
                                    jQuery('#tarif_beruf').trigger('change');
                                    jQuery('#tarif_privat').attr('checked', false);
                                    jQuery('#tarif_privat').trigger('change');
                                    jQuery('#vermiet').val(0);
                                    jQuery('#vermiet').trigger('change');
                                }
                            },
                            unchecked : {
                                show: ['vermiet'],
                                custom: function (ev) {}
                            }

                        }
                    }
                }),
                new select({
                    label : "VERMIETETE Wohneinheiten",
                    tooltip: 'Die vermietete WE kann nur versichert werden, wenn sich diese NICHT im eigenen Haus befindet. Sonst MUSS zusätzlich der Eigentum- und Miet RS für das eigene Haus mitversichert werden.',
                    name  : "vermiet",
                    values: {
                        "0": "nein",
                        "1"  : "1 vermietete WE",
                        "2"  : "2 vermietete WEs",
                        "3"  : "3 vermietete WEs",
                        "4"  : "4 vermietete WEs",
                        "5"  : "5 vermietete WEs",
                        "6"  : "6 vermietete WEs"
                    },
                    value: '0',
                    events  : {
                        change: {
                            0 : {
                                hide: ['OB1','OB2','OB3','OB4','OB5','OB6'],
                                custom: function () {
                                    jQuery('#OB1, #OB2, #OB3, #OB4, #OB5, #OB6').val('');
                                }
                            },
                            1 : {
                                hide: ['OB2','OB3','OB4','OB5','OB6'],
                                show: ['OB1'],
                                custom: function () {
                                    jQuery('#OB2, #OB3, #OB4, #OB5, #OB6').val('');
                                }
                            },
                            2 : {
                                hide: ['OB3','OB4','OB5','OB6'],
                                show: ['OB1','OB2'],
                                custom: function () {
                                    jQuery('#OB3, #OB4, #OB5, #OB6').val('');
                                }
                            },
                            3 : {
                                hide: ['OB4','OB5','OB6'],
                                show: ['OB1','OB2','OB3'],
                                custom: function () {
                                    jQuery('#OB4, #OB5, #OB6').val('');
                                }
                            },
                            4 : {
                                hide: ['OB5','OB6'],
                                show: ['OB1','OB2','OB3','OB4'],
                                custom: function () {
                                    jQuery('#OB5, #OB6').val('');
                                }
                            },
                            5 : {
                                hide: ['OB6'],
                                show: ['OB1','OB2','OB3','OB4','OB5'],
                                custom: function () {
                                    jQuery('#OB6').val('');
                                }
                            },
                            6 : {
                                show: ['OB1','OB2','OB3','OB4','OB5','OB6'],
                                custom: function () {
                                    jQuery('#OB1, #OB2, #OB3, #OB4, #OB5, #OB6').val('');
                                }
                            },

                        }
                    }
                }),
                new input({
                    label   : "WE 1 Jahresbruttomiete EUR",
                    name    : "OB1",
                }),
                new input({
                    label   : "WE 2 Jahresbruttomiete EUR",
                    name    : "OB2",
                }),
                new input({
                    label   : "WE 3 Jahresbruttomiete EUR",
                    name    : "OB3",
                }),
                new input({
                    label   : "WE 4 Jahresbruttomiete EUR",
                    name    : "OB4",
                }),
                new input({
                    label   : "WE 5 Jahresbruttomiete EUR",
                    name    : "OB5",
                }),
                new input({
                    label   : "WE 6 Jahresbruttomiete EUR",
                    name    : "OB6",
                }),




                new subheadline ({label: 'Weitere Angaben'}),

                new input({
                    label   : "Sind Sie verheiratet oder leben in einer eheähnlichen Gemeinschaft?",
                    tooltip: 'Ihre Kinder sind in der Regel bereits mitversichert. Wenn Sie Ihren Ehe-/Lebenspartner zusätzlich mit versichern möchten, setzen Sie die Auswahl.',
                    name    : "ehepartner",
                    type    : "checkbox",
                    value   : "ja",
                    checked : true,
                    events  : {
                        change: {
                            checked : {
                                show: ['alterpartner']
                            },
                            unchecked : {
                                hide: ['alterpartner']
                            }

                        }
                    }
                }),

                new input({
                    label   : "Alter des Versicherungsnehmers",
                    name    : "alter",
                    type    : "text",
                    value   : "30",
                    maxlength  : 2,
                    required: true
                }),

                new input({
                    label   : "Alter des Ehe- oder Lebenspartners",
                    name    : "alterpartner",
                    type    : "text",
                    value   : "30",
                    maxlength  : 2,
                    required: true
                }),

                new select({
                    label : "Aktuelle Tätigkeit",
                    name  : "anag",
                    values: {
                        "Arbeitnehmer": "Arbeitnehmer",
                        "ohne berufliche Tätigkeit"  : "ohne berufliche Tätigkeit",
                        "öffentl. Dienst"  : "öffentl. Dienst",
                        "Selbständig"  : "Selbstständig",
                        "auf Dauer nicht mehr erwerbstätig"  : "auf Dauer nicht mehr erwerbstätig"
                    },
                    value: 'Arbeitnehmer',
                    events  : {
                        change: {
                            Arbeitnehmer : { hide: ['umsatzselbst'] },
                            'ohne berufliche Tätigkeit' : { hide: ['umsatzselbst'] },
                            'öffentl. Dienst' : { hide: ['umsatzselbst'] },
                            Selbständig : { show: ['umsatzselbst'] },
                            'auf Dauer nicht mehr erwerbstätig' : { hide: ['umsatzselbst'] }
                        }
                    }
                }),

                new select({
                    label : "Jahresumsatz",
                    tooltip: 'Geben Sie hier bitte Ihren Jahresumsatz Ihrer gesamten Selbständigkeit an. Beachten Sie aber, daß grundsätzlich immer nur der Private Bereich versichert ist. Für den gewerblichen Bereich gibt es keinen Versicherungsschutz.',
                    name  : "umsatzselbst",
                    values: {
                        "10000": "1 - 10.000 EUR",
                        "15000": "10.001 - 15.000 EUR",
                        "20000": "15.001 - 20.000 EUR",
                        "50000": "20.001 - 50.000 EUR",
                        "9999999": "ab 50.001 EUR"
                    },
                    value: '10000'
                }),


                new subheadline ({label: 'Rabattrelevante Angaben'}),

                new select({
                    label : "Laufzeit",
                    tooltip: 'Einige Gesellschaften bieten mehrjährige Verträge an mit einem Laufzeitrabatt.',
                    name  : "laufzeit",
                    values: {
                        "1": "1 Jahr",
                        "3": "3 Jahre"
                    },
                    value: '3'
                }),

                new select({
                    label : "Wie lange bestehen oder bestanden für den Antragsteller und/oder den mitversicherten Lebenspartner Vorversicherungen?",
                    title : 'Bei einigen Versicherungen gibt es eine günstigere Selbstbeteiligungs-Einstufung, wenn Sie einen Vertrag hatten, der schadenfrei lief.',
                    name  : "vorvers5",
                    required: true,
                    values: {
                        "-": "-- Bitte wählen --",
                        "keine Vorversicherung": "keine Vorversicherung",
                        "weniger als 2 Jahre": "weniger als 2 Jahre",
                        "mind. 2 Jahre": "mind. 2 Jahre",
                        "mind. 3 Jahre": "mind. 3 Jahre",
                        "mind. 4 Jahre": "mind. 4 Jahre",
                        "mind. 5 Jahre": "mind. 5 Jahre"
                    },
                    value: '-'
                }),

                new select({
                    label : "Wann wurde der letzte Schaden gemeldet?",
                    name  : "wannschaden",
                    values: {
                        "-": "-- Bitte wählen --",
                        "vor mehr als 5 Jahren oder schadenfrei": "vor mehr als 5 Jahren oder schadenfrei",
                        "innerhalb der letzten 2 Jahre": "innerhalb der letzten 2 Jahre",
                        "vor mehr als 2 Jahren": "vor mehr als 2 Jahren",
                        "vor mehr als 3 Jahren": "vor mehr als 3 Jahren",
                        "vor mehr als 4 Jahren": "vor mehr als 4 Jahren"
                    },
                    value: '-'
                }),

                new select({
                    label : "Kombirabatte mit berechnen?",
                    tooltip: 'Welche Verträge haben Sie schon oder haben vor, sie zu versichern? Je mehr Verträge Sie bei einer Gesellschaft haben, umso günstiger wird der Preis.',
                    name  : "kombirabatte",
                    values: {
                        "nein": "nein",
                        "ja": "ja"
                    },
                    value: 'nein',
                    events: {
                        change: {
                            ja : {
                                show  : ['KrPHV','KrTIE','KrHUG','KrOEL','KrWG','KrWGGLS','KrHR','KrHRGLS','KrUNF','KrRS','kombirabattehl','kombirabattesubhl'],
                                custom: () => {}
                            },
                            nein : {
                                hide  : ['KrPHV','KrTIE','KrHUG','KrOEL','KrWG','KrWGGLS','KrHR','KrHRGLS','KrUNF','KrRS','kombirabattehl','kombirabattesubhl'],
                                custom: () => {}
                            }
                        }
                    }
                }),

                new headline({
                    label: "Kombirabatte für folgende Sparten-Kombinationen berücksichtigen",
                    name: 'kombirabattehl'
                }),
                new subheadline ({
                    label: 'Kombirabatte - Je mehr Verträge bei einer Gesellschaft, um so günstigere Preise. Welche Verträge haben Sie schon oder haben vor, sie zu versichern?',
                    name: 'kombirabattesubhl'
                }),

                new input({
                    label   : "Privathaftpflicht",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrPHV",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Tierhalterhaftpflicht",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrTIE",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Haus-Grundbesitzer Haftpflicht",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrHUG",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Gewässerschaden/Öltank",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrOEL",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Wohngebäude",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrWG",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Wohngebäude-Glas",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrWGGLS",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Hausrat",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrHR",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Hausrat-Glas",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrHRGLS",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Unfall",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrUNF",
                    type    : "checkbox",
                    value   : "1"
                }),
                new input({
                    label   : "Rechtsschutz",
                    tooltip: 'Klicken Sie hier, wenn Sie diese Versicherung schon besitzen oder diese neu beantragen möchten.',
                    name    : "KrRS",
                    type    : "checkbox",
                    value   : "1",
                    checked : true
                })





            // <input type="hidden" name="w14qm" value=""><input type="hidden" name="id" value="mrmo">
            // <input type="hidden" name="c_id" value="">
            // <input type="hidden" name="subid" value="">
            // <input type="hidden" name="partnerdir" value="http://www.mr-money.de/vergleichen">
            // <input type="hidden" name="cssurl" value="">
            // <input type="hidden" name="IP_USER" value="188.163.65.135-20830">
            // <input type="hidden" name="sp_lang" value="rechtsschutz">
            // <input type="hidden" name="sp" value="RS">
            // <input type="hidden" name="v_id" value="">
            // <input type="hidden" name="cv" value="">
            // <input type="hidden" name="a_id" value="">
            // <input type="hidden" name="t_id" value="">
            // <input type="hidden" name="ma_iD" value="">
            // <input type="hidden" name="tt_iD" value="">
            // <input type="hidden" name="ur_iD" value="">
            // <input type="hidden" name="KrSp" value="">
            // <input type="hidden" name="REF77" value="" id="REF77">
            // <input type="hidden" name="daco" value="" id="daco">










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