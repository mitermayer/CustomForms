/*

Version: 0.44

bugs-fixing: 
    - On ID generation now prioritizes the re-use of ID and only uses name if 
    not ID exists.

Copyright (C) 2012 by Mitermayer Reis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---------------------------------------------------------------------------

*/
(function(a){a.fn.cstmForm=function(k){var e={customEle:"a",containerEle:"div",classPrefix:"custom-",autoHide:1,active:0,select:{active:1},radio:{active:1},checkbox:{active:1},file:{active:1,holderTxt:"Upload.."},text:{active:1,blur_color:"#777"}},i={generate_id:function(a){a=a.attr("id")||a.attr("name");return e.classPrefix+a},hide_element:function(c,d){d?c.css({opacity:"0",filter:"alpha(opacity=0)","-moz-opacity":"0","-khtml-opacity":"0",position:"absolute",top:"0px",left:"0px"}):a(c).each(function(){a(this).css({position:"absolute",
left:"-9999px"})})},sort_elements:function(c){var d=[],b=[],e=[],f=[],h=[];a(c).each(function(){a(this).is("input[type=checkbox]")?d.push(a(this)):a(this).is("input[type=radio]")?b.push(a(this)):a(this).is("input[type=text]")||a(this).is("textarea")?h.push(a(this)):a(this).is("input[type=file]")?e.push(a(this)):a(this).is("select")&&f.push(a(this))});return{checkbox:d,radio:b,file:e,select:f,text:h}},load_modules:function(a){a.checkbox.length&&l(a.checkbox);a.select.length&&m(a.select);a.text.length&&
n(a.text);a.file.length&&o(a.file);a.radio.length&&p(a.radio)}},n=function(c){if(!("placeholder"in document.createElement("input"))&&(e.text.active||e.active)){var d=[],b={};a(c).each(function(){var g=this,f=g.attr("placeholder");if(!g.val()&&f){var c=g.attr("name"),h=g.css("color");g.val(f);b[c]=f;var j=a.trim(g.val())===b[c]||""===a.trim(g.val())?e.text.blur_color:h;g.css("color",j);g.focusin(function(){a.trim(g.val())===b[c]&&(g.val(""),g.css("color",h))}).focusout(function(){""===a.trim(g.val())&&
(g.val(b[c]),g.css("color",j))});d[d.length]=g}});if(d.length){var j,f={},h=function(b){a(b).each(function(a,b){var d=b.val();b.val(d===b.attr("placeholder")?"":d)})};a(d).each(function(b,d){var e=d.closest("form"),c=e.attr("id");c||(e.attr("id","cstmForm_"+b),c=e.attr("id"));j!==c&&(f[c]=[],a("#"+c).on("submit",function(){h(f[c])}));f[c][f[c].length]=d;j=c})}}},l=function(c){if(e.checkbox.active||e.active){var d=function(a,d){a.prop("checked")?d.addClass("checked"):d.removeClass("checked")};i.hide_element(c);
a(c).each(function(){var b=this,c=i.generate_id(b);b.before(a("<"+e.customEle+"/>",{id:c,"class":e.classPrefix+"checkbox",click:function(c){c.preventDefault();a(this).hasClass("checked")?b.prop("checked",!1):b.prop("checked",!0);d(b,a(this))}}));var f=a("#"+c);b.focusin(function(){f.addClass("focus")}).focusout(function(){f.removeClass("focus")}).change(function(){d(b,f)});d(b,f);b.addClass("customForm-hidden")})}},p=function(c){if(e.radio.active||e.active){i.hide_element(c);var d=function(b,d,c){var h=
e.classPrefix+b.attr("name");a("."+h).removeClass("checked");d.addClass("checked");c.each(function(){a(this).hasClass(h)&&a(this).prop("checked",!1)});b.prop("checked",!0)};a(c).each(function(){var b=this,j=i.generate_id(b)+"-"+b.val();b.before(a("<"+e.customEle+"/>",{id:j,"class":e.classPrefix+"radio",click:function(e){e.preventDefault();d(b,a(this),a(c))}}));var f=a("#"+j);b.focusin(function(){f.addClass("focus")}).focusout(function(){f.removeClass("focus")}).change(function(){d(b,f,a(c))});f.addClass(e.classPrefix+
b.attr("name"));b.prop("checked")&&f.addClass("checked");b.addClass("customForm-hidden")})}},o=function(c){(e.file.active||e.active)&&a(c).each(function(){var d=this,b=i.generate_id(d),c=e.file.holderTxt,f=d.val().split("\\").pop(),h="#"+b+"-container",g="#"+b;i.hide_element(a(this),!0);d.before(a("<"+e.containerEle+"/>",{id:b+"-container","class":e.classPrefix+"file-container"}));a(h).css("position","relative");d.appendTo(h);a("<"+e.customEle+"/>",{"class":e.classPrefix+"file",id:b}).appendTo(h);
a(g).html(f?f:c);a(g).css({display:"block","white-space":"nowrap",overflow:"hidden","text-overflow":"ellipsis"});d.css({display:"block",height:a(h).css("height"),width:a(h).css("width"),"text-align":"left","-webkit-appearance":"none","font-size":"1px","-moz-appearance":"none"}).attr({size:parseInt(a(h).css("width"),10)-36});d.change(function(){a(g).html(d.val().split("\\").pop())}).focusin(function(){a(h).addClass("focus")}).focusout(function(){a(h).removeClass("focus")})})},m=function(c){(e.select.active||
e.active)&&a(c).each(function(){var d=i.generate_id(this),b="#"+d+"-container",c="#"+d;i.hide_element(this,!0);this.before(a("<"+e.containerEle+"/>",{id:d+"-container","class":e.classPrefix+"select-container"}));a(b).css("position","relative");this.appendTo(b);a("<"+e.customEle+"/>",{"class":e.classPrefix+"select",id:d}).appendTo(b);a(c).html(a(b+" option:selected").text());a(c).css({display:"block","white-space":"nowrap",overflow:"hidden","text-overflow":"ellipsis"});this.css({display:"block",height:a(b).css("height"),
width:a(b).css("width"),"-webkit-appearance":"none","-moz-appearance":"none"});this.change(function(){a(c).html(a(b+" option:selected").text())}).focusin(function(){a(b).addClass("focus")}).focusout(function(){a(b).removeClass("focus")})})};(function(c,d){d.length&&(e=c?a.extend({},e,c):e,d=d.is("form")?a("form").find(":input"):d,i.load_modules(i.sort_elements(d)))})(k,this)}})(jQuery);
