[![Build Status](https://travis-ci.org/mitermayer/CustomForms.png?branch=refactor)](https://travis-ci.org/mitermayer/CustomForms)

# Customformsjs ##

After 2 long years **version 1.0** is now released, the goal of customforms was to provide an
easy and customizeble way to implement form fields. 

The goal was not only make it work but also
build it on top of **software engineering best practices and principles**.

All code is **Unit Tested** and **Cross Browser Tested** with the **lastest jquery** version and the **oldest supported version** at **every commit**.


Future **releases**, **bugs** and **ehancement** can all be found on the trello board. All issues created on github will have a trello card associated with it.


## Modules
* **Text** - _Cross browser support to placeholders_.
* **Select** - _Custom select box_ 
* **File** - _Custom input file_
* **Checkbox** - _Custom checkboxes_
* **Radio** - _Custom radio_

## Browser support
* **Internet**: Explorer 7+
* **Firefox**: 3.5+
* **Google**: Chrome 5+
* **Safari**: 4+

## Smart phones support
* **Android**: 1.5+
* **Iphone**: 3+

## Requirements
* **jQuery**: 1.6+
* **jQuery**: 2.0+

## Defaults
```javascript
{
    customEle      : 'a',
    containerEle   : 'div',
    classPrefix    : 'custom-',
    autoHide       : 1, // Auto hide the stylized elements
    active         : 0, // Load all custom form modules
    select: {
        active: 1
    },
    radio: {
        active: 1
    },
    checkbox: {
        active: 1
    },
    file: {
        active: 1,
        holderTxt: "Upload.."
    },
    text: {
        active: 1,
        blur_color: "#777"
    }
}
```

## Usage
```javascript

  // You can overwrite defaults by passing an object with some options
  var options = { customEle: 'span' };

  // All Form elements
  $('form').cstmForm( options ) 

  // target a certain group of element 
  $('input[type=file]').cstmForm( options )
 
  // You can target specific groups of elements
  $('input[type=radio], input[type=checkbox], select').cstmForm( options )
```


## Submiting new custom modules ##

Feel free to submit new modules as pull requests. All module must have proper jsdoc syntax comments and related unit testing in order to be merged. After having made any pull request you will be able to join the trello board.

A module will need to extend class ```app/lib/BaseField.js``` and implement ```moduleName.blueprint```






