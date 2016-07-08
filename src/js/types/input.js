'use strict';

const type = require("./type");
const label = require("../helpers/label");

class input extends type {

	constructor(config) {
		super(config);

		this.type = config.type || "text";
	}

	/**
	 *
	 * @returns {Element}
	 */
	toString() {
		let row = this.getRow();

		this.item = document.createElement("input");
		this.item.setAttribute("type", this.type);
		this.item.setAttribute("name", this.name);
		this.item.setAttribute("id", this.name);

		if(this.value) {
			this.item.setAttribute("value", this.value);
			this.onChange(this.value);
		}

		if (this.required) {
			this.item.setAttribute("required", true);
		}
		if (this.checked) {
			this.item.setAttribute("checked", 'checked');
		}
		if (this.maxlength) {
			this.item.setAttribute("maxlength", this.maxlength);
		}


		this.bindDefaultEvents();


		if (this.type == 'checkbox') {
			for (let e in this.events) {

				jQuery(this.item).on(e, (event) => {

					let state = jQuery(this.item).is(':checked') ? 'checked' : 'unchecked';

					if ((this.events[e][state] )) {

						// hide elements
						if (this.events[e][state].hide) {
							for (let hideId in this.events[e][state].hide) {
								let id = this.events[e][state].hide[hideId];
								let elementToHide = document.getElementById(id + "-wrapper");
								if (elementToHide) 
									elementToHide.style = "display: none;";
							}
						}
	
						// show elements
						if (this.events[e][state].show) {
							for (let hideId in this.events[e][state].show) {
								let id = this.events[e][state].show[hideId];
								let elementToShow = document.getElementById(id + "-wrapper");
								if (elementToShow)
									elementToShow.style = "display: block;";
							}
						}

						if(this.events[e][state].custom) {
							this.events[e][state].custom(event);
						}


						// set as required
						// if (this.events[e][event.target.value].require) {
						//
						// 	for (let hideId in this.events[e][event.target.value].require) {
						//
						// 		let id = this.events[e][event.target.value].require[hideId];
						//
						// 		let elementToRequire = document.getElementById(id);
						// 		if (elementToRequire)
						// 			elementToRequire.setAttribute("required", true);
						//
						// 	}
						//
						// }
	
						// set as not required
						// if (this.events[e][event.target.value].notrequire) {
						//
						// 	for (let hideId in this.events[e][event.target.value].notrequire) {
						//
						// 		let id = this.events[e][event.target.value].notrequire[hideId];
						//
						// 		let elementToRequire = document.getElementById(id);
						// 		if (elementToRequire)
						// 			elementToRequire.removeAttribute("required");
						//
						// 	}
						//
						// }
					}

					if ((this.events[e].default )) {
						if(this.events[e].default.custom) {
							this.events[e].default.custom(event);
						}
					}
			})

			}
		}

		if (this.type === "hidden") {
			row.appendChild(this.item);
		} else {
			let wrapper = this.getWrapper();

			wrapper.appendChild(new label(this.name, this.type, this.label));

			if (this.tooltip) {
				wrapper.appendChild(this.getTooltip());
			}
			wrapper.appendChild(this.item);
			wrapper.appendChild(this.getAfter());

			row.appendChild(wrapper);
		}

		return row;
	}

}

module.exports = input;