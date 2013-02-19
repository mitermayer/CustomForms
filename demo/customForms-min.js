/*

Version: 0.46

Copyright (C) 2012 by Mitermayer Reis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.$("option").css("

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---------------------------------------------------------------------------

*/
(function(a){a.fn.cstmForm=function(n){var c={customEle:"a",containerEle:"div",classPrefix:"custom-",autoHide:1,active:0,select:{active:1},radio:{active:1},checkbox:{active:1},file:{active:1,holderTxt:"Upload.."},text:{active:1,blur_color:"#777"}},g={generate_id:function(a){a=a.attr("id")||a.attr("name");return c.classPrefix+a},hide_element:function(c,h){h?c.css({opacity:"0",filter:"alpha(opacity=0)","-moz-opacity":"0","-khtml-opacity":"0",position:"absolute",top:"0px",left:"0px"}):a(c).each(function(){a(this).css({position:"absolute",
left:"-9999px"})})},sort_elements:function(c){var h=[],g=[],l=[],m=[],f=[];a(c).each(function(){a(this).is("input[type=checkbox]")?h.push(a(this)):a(this).is("input[type=radio]")?g.push(a(this)):a(this).is("input[type=text]")||a(this).is("textarea")||a(this).is("input[type=search]")||a(this).is("input[type=search]")||a(this).is("input[type=url]")||a(this).is("input[type=tel]")||a(this).is("input[type=email]")||a(this).is("input[type=password]")?f.push(a(this)):a(this).is("input[type=file]")?l.push(a(this)):
a(this).is("select")&&m.push(a(this))});return{checkbox:h,radio:g,file:l,select:m,text:f}},load_modules:function(k){if(k.checkbox.length){var h=k.checkbox;if(c.checkbox.active||c.active){var f=function(a,c){a.prop("checked")?c.addClass("checked"):c.removeClass("checked")};g.hide_element(h);a(h).each(function(){var b=this,e=g.generate_id(b);b.before(a("<"+c.customEle+"/>",{id:e,"class":c.classPrefix+"checkbox",click:function(c){c.preventDefault();a(this).hasClass("checked")?b.prop("checked",!1):b.prop("checked",
!0);f(b,a(this))}}));var d=a("#"+e);b.focusin(function(){d.addClass("focus")}).focusout(function(){d.removeClass("focus")}).change(function(){f(b,d)});f(b,d);b.addClass("customForm-hidden")})}}k.select.length&&(c.select.active||c.active)&&a(k.select).each(function(){var b=g.generate_id(this),e="#"+b+"-container",d="#"+b;g.hide_element(this,!0);this.before(a("<"+c.containerEle+"/>",{id:b+"-container","class":c.classPrefix+"select-container"}));a(e).css("position","relative");this.appendTo(e);a("<"+
c.customEle+"/>",{"class":c.classPrefix+"select",id:b}).appendTo(e);a(d).html(a(e+" option:selected").text());a(d).css({display:"block","white-space":"nowrap",overflow:"hidden","text-overflow":"ellipsis"});this.css({display:"block",height:a(e).css("height"),width:a(e).css("width"),"-webkit-appearance":"none","-moz-appearance":"none"});this.change(function(){a(d).html(a(e+" option:selected").text())}).focusin(function(){a(e).addClass("focus")}).focusout(function(){a(e).removeClass("focus")})});if(k.text.length&&
(h=k.text,!("placeholder"in document.createElement("input"))&&(c.text.active||c.active))){var l=[],m={};a(h).each(function(){var b=this,e=b.attr("placeholder");if(!b.val()&&e){var d=b.attr("name"),j=b.css("color");b.val(e);m[d]=e;var g=a.trim(b.val())===m[d]||""===a.trim(b.val())?c.text.blur_color:j;b.css("color",g);b.focusin(function(){a.trim(b.val())===m[d]&&(b.val(""),b.css("color",j))}).focusout(function(){""===a.trim(b.val())&&(b.val(m[d]),b.css("color",g))});l[l.length]=b}});if(l.length){var n,
p={};a(l).each(function(b,c){var d=c.closest("form"),j=d.attr("id");j||(d.attr("id","cstmForm_"+b),j=d.attr("id"));n!==j&&(p[j]=[],a("#"+j).on("submit",function(){a(p[j]).each(function(a,b){var c=b.val();b.val(c===b.attr("placeholder")?"":c)})}));p[j][p[j].length]=c;n=j})}}k.file.length&&(h=k.file,(c.file.active||c.active)&&a(h).each(function(){var b=this,e=g.generate_id(b),d=c.file.holderTxt,j=b.val().split("\\").pop(),f="#"+e+"-container",h="#"+e;g.hide_element(a(this),!0);b.before(a("<"+c.containerEle+
"/>",{id:e+"-container","class":c.classPrefix+"file-container"}));a(f).css("position","relative");b.appendTo(f);a("<"+c.customEle+"/>",{"class":c.classPrefix+"file",id:e}).appendTo(f);a(h).html(j?j:d);a(h).css({display:"block","white-space":"nowrap",overflow:"hidden","text-overflow":"ellipsis"});b.css({display:"block",height:a(f).css("height"),width:a(f).css("width"),"text-align":"left","-webkit-appearance":"none","font-size":"1px","-moz-appearance":"none"}).attr({size:parseInt(a(f).css("width"),
10)-36});b.change(function(){a(h).html(b.val().split("\\").pop())}).focusin(function(){a(f).addClass("focus")}).focusout(function(){a(f).removeClass("focus")})}));if(k.radio.length&&(c.radio.active||c.active)){var q=k.radio;g.hide_element(q);var r=function(b,e,d){var f=c.classPrefix+b.attr("name");a("."+f).removeClass("checked");e.addClass("checked");d.each(function(){a(this).hasClass(f)&&a(this).prop("checked",!1)});b.prop("checked",!0)};a(q).each(function(){var b=this,e=g.generate_id(b)+"-"+b.val();
b.before(a("<"+c.customEle+"/>",{id:e,"class":c.classPrefix+"radio",click:function(c){c.preventDefault();r(b,a(this),a(q))}}));var d=a("#"+e);b.focusin(function(){d.addClass("focus")}).focusout(function(){d.removeClass("focus")}).change(function(){r(b,d,a(q))});d.addClass(c.classPrefix+b.attr("name"));b.prop("checked")&&d.addClass("checked");b.addClass("customForm-hidden")})}}},f=this;f.length&&(c=n?a.extend({},c,n):c,f=f.is("form")?a("form").find(":input"):f,g.load_modules(g.sort_elements(f)))}})(jQuery);
