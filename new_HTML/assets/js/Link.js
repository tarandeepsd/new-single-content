(function($){'use strict';function throwEqualError(F,a,b){if((F[a]||F[b])&&(F[a]===F[b])){throw new Error("(Link) '"+a+"' can't match '"+b+"'.'");}}
function isInstance(a){return a instanceof $||($['zepto']&&$['zepto']['isZ'](a));}
var
Formatting=['decimals','mark','thousand','prefix','postfix','encoder','decoder','negative','negativeBefore','to','from'],FormatDefaults=[2,'.','','','',function(a){return a;},function(a){return a;},'-','',function(a){return a;},function(a){return a;}];function Format(options){if(options===undefined){options={};}
if(typeof options!=='object'){throw new Error("(Format) 'format' option must be an object.");}
var settings={};$(Formatting).each(function(i,val){if(options[val]===undefined){settings[val]=FormatDefaults[i];}else if((typeof options[val])===(typeof FormatDefaults[i])){if(val==='decimals'){if(options[val]<0||options[val]>7){throw new Error("(Format) 'format.decimals' option must be between 0 and 7.");}}
settings[val]=options[val];}else{throw new Error("(Format) 'format."+val+"' must be a "+typeof FormatDefaults[i]+".");}});throwEqualError(settings,'mark','thousand');throwEqualError(settings,'prefix','negative');throwEqualError(settings,'prefix','negativeBefore');this.settings=settings;}
Format.prototype.v=function(a){return this.settings[a];};Format.prototype.to=function(number){function reverse(a){return a.split('').reverse().join('');}
number=this.v('encoder')(number);var decimals=this.v('decimals'),negative='',preNegative='',base='',mark='';if(parseFloat(number.toFixed(decimals))===0){number='0';}
if(number<0){negative=this.v('negative');preNegative=this.v('negativeBefore');}
number=Math.abs(number).toFixed(decimals).toString();number=number.split('.');if(this.v('thousand')){base=reverse(number[0]).match(/.{1,3}/g);base=reverse(base.join(reverse(this.v('thousand'))));}else{base=number[0];}
if(this.v('mark')&&number.length>1){mark=this.v('mark')+number[1];}
return this.v('to')(preNegative+this.v('prefix')+negative+base+mark+this.v('postfix'));};Format.prototype.from=function(input){function esc(s){return s.replace(/[\-\/\\\^$*+?.()|\[\]{}]/g,'\\$&');}
var isNeg;if(input===null||input===undefined){return false;}
input=this.v('from')(input);input=input.toString();isNeg=input.replace(new RegExp('^'+esc(this.v('negativeBefore'))),'');if(input!==isNeg){input=isNeg;isNeg='-';}else{isNeg='';}
input=input.replace(new RegExp('^'+esc(this.v('prefix'))),'');if(this.v('negative')){isNeg='';input=input.replace(new RegExp('^'+esc(this.v('negative'))),'-');}
input=input.replace(new RegExp(esc(this.v('postfix'))+'$'),'').replace(new RegExp(esc(this.v('thousand')),'g'),'').replace(this.v('mark'),'.');input=this.v('decoder')(parseFloat(isNeg+input));if(isNaN(input)){return false;}
return input;};function Link(entry,update){if(typeof entry!=="object"){$.error("(Link) Initialize with an object.");}
return new Link.prototype.init(entry['target']||function(){},entry['method'],entry['format']||{},update);}
Link.prototype.setTooltip=function(target,method){this.method=method||'html';this.el=$(target.replace('-tooltip-','')||'<div/>')[0];};Link.prototype.setHidden=function(target){this.method='val';this.el=document.createElement('input');this.el.name=target;this.el.type='hidden';};Link.prototype.setField=function(target){function at(a,b,c){return[c?a:b,c?b:a];}
var that=this;this.method='val';this.target=target.on('change',function(e){that.obj.val(at(null,$(e.target).val(),that.N),{'link':that,'set':true});});};Link.prototype.init=function(target,method,format,update){this.formatting=format;this.update=!update;if(typeof target==='string'&&target.indexOf('-tooltip-')===0){this.setTooltip(target,method);return;}
if(typeof target==='string'&&target.indexOf('-')!==0){this.setHidden(target);return;}
if(typeof target==='function'){this.target=false;this.method=target;return;}
if(isInstance(target)){if(!method){if(target.is('input, select, textarea')){this.setField(target);return;}
method='html';}
if(typeof method==='function'||(typeof method==='string'&&target[method])){this.method=method;this.target=target;return;}}
throw new RangeError("(Link) Invalid Link.");};Link.prototype.write=function(value,handle,slider,update){if(this.update&&update===false){return;}
this.actual=value;value=this.format(value);this.saved=value;if(typeof this.method==='function'){this.method.call(this.target[0]||slider[0],value,handle,slider);}else{this.target[this.method](value,handle,slider);}};Link.prototype.setFormatting=function(options){this.formatting=new Format($.extend({},options,this.formatting instanceof Format?this.formatting.settings:this.formatting));};Link.prototype.setObject=function(obj){this.obj=obj;};Link.prototype.setIndex=function(index){this.N=index;};Link.prototype.format=function(a){return this.formatting.to(a);};Link.prototype.getValue=function(a){return this.formatting.from(a);};Link.prototype.init.prototype=Link.prototype;$.Link=Link;}(window['jQuery']||window['Zepto']));