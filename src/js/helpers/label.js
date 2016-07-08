/**
 * Created by fribu on 17.03.16.
 */

'use strict';

class label {

	constructor(name, type, label) {
		let l = document.createElement("label");
		l.setAttribute("for", name);
		l.setAttribute("class", "label-item label-" + type);

		jQuery(l).html(label);

		return l;
	}

}

module.exports = label;