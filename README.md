# CustomForms - 0.5 

## This branch is under development and it is using travis to do automated continuous integration testing ##

[![Build Status](https://travis-ci.org/mitermayer/CustomForms.png?branch=refactor)](https://travis-ci.org/mitermayer/CustomForms)

## Support features
* Placeholders
* Select element
* File uploader
* Checkbox
* Radio

## Browser support
* Internet Explorer 6+
* Firefox 3.5+
* Google Chrome 5+
* Safari 4+

## Requirements
jQuery 1.6+

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
