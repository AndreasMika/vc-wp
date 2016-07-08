'use strict';

class type {
	constructor(config) {
		this.type = config.type || "text";
		this.label = config.label || "";
		this.labelAfter = config.labelAfter || null;
		this.name = config.name || "";
		this.values = config.values || {};
		this.value = config.value || "";
		this.required = config.required || false;
		this.checked = config.checked || false;
		this.maxlength = config.maxlength || false;
		this.events = config.events || {};
		this.tooltip = config.tooltip || null;

		/**
		 *
		 * @type Array|null
		 */
		this.model = null;
		/**
		 *
		 * @type form
		 */
		this.form = null;
		/**
		 *
		 * @type HTMLElement
		 */
		this.item = null;

		this.regex = config.regex || null;

		/**
		 * custom render event, needed to indicate item was fully rendered
		 * TODO verify it is working
		 *
		 * @type {CustomEvent}
		 */
		this.event = new CustomEvent('render');

		return this;
	}

	bindDefaultEvents() {
		jQuery(this.item).on("change", (event) => {
			if (event.target.value != this.model) {

				this.model = event.target.value;
				this.onChange(this.model);

			}
		});

		jQuery(this.item).on("keyup", (event) => {
			if (event.target.value != this.model) {

				this.model = event.target.value;
				this.onChange(this.model);

			}
		});

		jQuery(this.item).on("render", (event) => {
			this.model = event.target.value;
			this.onChange(this.model);
		});
	}

	onChange(value) {
		this.model = value;
		this.form.model[this.name] = value;
	}

	/**
	 *
	 * @returns {Element}
	 */
	getWrapper() {
		let wrapper = document.createElement("div");
		wrapper.setAttribute("id", this.name + "-wrapper");
		wrapper.setAttribute("class", "input-field col s12");

		return wrapper;
	}

	/**
	 *
	 * @returns {Element}
	 */
	getRow() {
		let row = document.createElement("div");
		row.setAttribute("class", "row");

		return row;
	}

	/**
	 *
	 * @returns {Element}
	 */
	getAfter() {
		let after = document.createElement("span");

		let $after = jQuery(after);
		$after.addClass("label-after");
		$after.html(this.labelAfter);

		return after;
	}

	/**
	 *
	 * @returns {Element}
	 */
	getTooltip() {
		let div = document.createElement("div");
		div.setAttribute("class", "tooltipblock");
		div.setAttribute("data-tooltip", this.tooltip);

		jQuery(div).html('');
		// jQuery(div).html('');this.tooltip

		return div;
	}
}

module.exports = type;