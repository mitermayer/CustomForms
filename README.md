[![Build Status](https://travis-ci.org/mitermayer/CustomForms.png?branch=refactor)](https://travis-ci.org/mitermayer/CustomForms)

# Customformsjs ##

After 2 long years **version 1.0** is now released, the goal of customforms was to provide an
easy and customizeble way to implement form fields. 

The goal was not only make it work but also
build it on top of **software engineering best practices and principles**.

All code is **Unit Tested** and **Cross Browser Tested** with the **lastest jquery** version and the **oldest supported version** at **every commit**.


Future **releases**, **bugs** and **ehancement** can all be found on the trello board. All issues created on github will have a trello card associated with it.

###[Documentation Page](http://customformsjs.com/doc/ "Documentation page")### 


[![Travis](http://customformsjs.com/demo/img/small_travis.jpg)](https://travis-ci.org/mitermayer/CustomForms)
Continuous integration testing

[![Trello](http://customformsjs.com/demo/img/small_trello.jpg)](https://trello.com/board/customformsjs/513e7cce79afc2ab3f000c7f)
Agile board


## Modules
* **Text** - _Cross browser support to placeholders_.
* **Select** - _Custom select box_ 
* **File** - _Custom input file_
* **Checkbox** - _Custom checkboxes_
* **Radio** - _Custom radio_

## Browser support
![Browser support](http://customformsjs.com/demo/img/small_browsers.jpg)

* **Google**: Chrome 5+
* **Firefox**: 3.5+
* **Opera**: 7+
* **Safari**: 4+
* **Internet**: Explorer 7+


## Smart phones support
![Smart phones support](http://customformsjs.com/demo/img/small_mobile.jpg)

* **Android**: 1.5+
* **Iphone**: 3+

## Requirements
* **jQuery**: 1.6+
* **jQuery**: 2.0+

## Defaults
Options and defaults can be found on the documentation page for each individual module.


* [**Module Text**](http://customformsjs.com/doc/Text.html "Documentation Text module")
* [**Module Checkbox**](http://customformsjs.com/doc/Checkbox.html "Documentation Text module")
* [**Module Radio**](http://customformsjs.com/doc/Radio.html "Documentation Text module")
* [**Module File**](http://customformsjs.com/doc/File.html "Documentation Text module")
* [**Module Select**](http://customformsjs.com/doc/Select.html "Documentation Text module")



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
