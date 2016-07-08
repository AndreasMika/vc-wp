# TODO

- bind events with default values
- output validation errors
- define validation for all fields
- add ajax to form
- css tooltips

# Notes

- we use jQuery for selectors, event binding and ajax requests
- use html and css that can work in older browsers
- use js validation in stead of html validation
- clean code ;)

# Where to start?

you have sass, npm and gulp installed

run with

> npm install

> gulp watch

then open the index.html in your local server.

# how to config a form?

every form has an internal variable **this.pages** this is an array of arrays

```javascript
this.pages = [[], [], []...]
```

each array contains a definition of a page.

There are currently 4 types you can use:

- headline
- subheadline
- input
- select


# types
## input 

input can take addition attribute **type**, so you can create checkbox or datepicker etc.

## select

takes a *values* attribute, this is an object of key value pairs, so you can config choices.

```javascript

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
								show: toggleSanierung
							},
							feu: {
								hide: toggleSanierung
							}
						}
					}
				}),

```


# attributes

list of possible attributes you can pass to each class

## regex

each type can take a param **regex** thats containing a regex pattern 
 
```javascript

new input({
					label   : "Baujahr",
					name    : "baujahr",
					type    : "text",
					required: true,
					regex   : /^\d{4}$/,
					value   : "2000"
				}),

```
 
## required

true, false by default

## name

defines the name AND the id of the element

## label

defines the text defore the input/select element

## afterLabel

defines the text after the input/select element

## value

set default value for input or select

TODO: if you set the default value, let the custom events trigger, currently not working

## events

you can use default html events in this simple syntax

```javascript

events: {
						**change**: {
							wg : {
								show: ["id1", "id2"]
							},
							feu: {
								hide: toggleSanierung
							}
						}
					}

```

the name of the event is **change** if the value is **wg** you can **hide** or **show** items.
items is an array of stings with ids of elements to hide or to show. You can also **require** elements.

```javascript

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

```

## tooltip

defines tooltip text


# form

```
class form {
	constructor(target) {

		this.model = {}; // contains data of fields
		this.target = target || null;
		this.pageObjects = []; // object of nodes (fields etc)
		this.pageErrors = []; // object of errors, if there are any
	}
  
}
```