'use strict';

const type = require("./type");
const label = require("../helpers/label");

class select extends type {

	constructor(config) {
		super(config);

		this.type = "select";
	}

	/**
	 *
	 * @returns {Element}
	 */
	toString() {
		let wrapper = this.getWrapper();
		let row = this.getRow();

		this.item = document.createElement(this.type);
		this.item.setAttribute("name", this.name);
		this.item.setAttribute("id", this.name);
		
		if (this.required) {
			this.item.setAttribute("required", true);
		}

		this.bindDefaultEvents();

		// custom events
		for (let e in this.events) {

			jQuery(this.item).on(e, (event) => {

				if (this.events[e][event.target.value]) {
					if(this.events[e][event.target.value].custom) {
						this.events[e][event.target.value].custom(event);
					}

					// hide elements
					if (this.events[e][event.target.value].hide) {

						for (let hideId in this.events[e][event.target.value].hide) {

							let id = this.events[e][event.target.value].hide[hideId];

							let elementToHide = document.getElementById(id + "-wrapper");
							if (elementToHide)
								elementToHide.style = "display: none;";
						}

					}

					// show elements
					if (this.events[e][event.target.value].show) {

						for (let hideId in this.events[e][event.target.value].show) {

							let id = this.events[e][event.target.value].show[hideId];

							let elementToShow = document.getElementById(id + "-wrapper");
							if (elementToShow)
								elementToShow.style = "display: block;";

						}

					}

					// set as required
					if (this.events[e][event.target.value].require) {

						for (let hideId in this.events[e][event.target.value].require) {

							let id = this.events[e][event.target.value].require[hideId];

							let elementToRequire = document.getElementById(id);
							if (elementToRequire)
								elementToRequire.setAttribute("required", true);

						}

					}

					// set as not required
					if (this.events[e][event.target.value].notrequire) {

						for (let hideId in this.events[e][event.target.value].notrequire) {

							let id = this.events[e][event.target.value].notrequire[hideId];

							let elementToRequire = document.getElementById(id);
							if (elementToRequire)
								elementToRequire.removeAttribute("required");

						}

					}
				}

			})

		}

		for (let i in this.values) {
			let optionItem = document.createElement("option");
			optionItem.setAttribute("value", i);

			if (this.value) {
				if (i == this.value) {
					optionItem.setAttribute("selected", true);
					this.onChange(i);
				}
			}

			jQuery(optionItem).html(this.values[i]);
			//optionItem.innerText = this.values[i];

			this.item.appendChild(optionItem);
		}

		wrapper.appendChild(new label(this.name, this.type, this.label));


		if (this.tooltip)
			wrapper.appendChild(this.getTooltip());
		wrapper.appendChild(this.item);
		wrapper.appendChild(this.getAfter());

		this.item.dispatchEvent(this.event);
		//debugger;


		row.appendChild(wrapper);

		return row;
	}

}

module.exports = select;