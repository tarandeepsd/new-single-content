(function($){'use strict';var
doc=$(document),$val=$.fn.val,namespace='.nui',actions=window.navigator['pointerEnabled']?{start:'pointerdown',move:'pointermove',end:'pointerup'}:window.navigator['msPointerEnabled']?{start:'MSPointerDown',move:'MSPointerMove',end:'MSPointerUp'}:{start:'mousedown touchstart',move:'mousemove touchmove',end:'mouseup touchend'},Classes=['noUi-target','noUi-base','noUi-origin','noUi-handle','noUi-horizontal','noUi-vertical','noUi-background','noUi-connect','noUi-ltr','noUi-rtl','noUi-dragable','','noUi-state-drag','','noUi-state-tap','noUi-active','noUi-extended','noUi-stacking'];function limit(a){return Math.max(Math.min(a,100),0);}
function closest(value,to){return Math.round(value/to)*to;}
function subRangeRatio(pa,pb){return(100/(pb-pa));}
function isNumeric(a){return typeof a==='number'&&!isNaN(a)&&isFinite(a);}
function asArray(a){return $.isArray(a)?a:[a];}
function addClassFor(element,className,duration){element.addClass(className);setTimeout(function(){element.removeClass(className);},duration);}
function fromPercentage(range,value){return(value*100)/(range[1]-range[0]);}
function toPercentage(range,value){return fromPercentage(range,range[0]<0?value+Math.abs(range[0]):value-range[0]);}
function isPercentage(range,value){return((value*(range[1]-range[0]))/100)+range[0];}
function toStepping(options,value){if(value>=options.xVal.slice(-1)[0]){return 100;}
var j=1,va,vb,pa,pb;while(value>=options.xVal[j]){j++;}
va=options.xVal[j-1];vb=options.xVal[j];pa=options.xPct[j-1];pb=options.xPct[j];return pa+(toPercentage([va,vb],value)/subRangeRatio(pa,pb));}
function fromStepping(options,value){if(value>=100){return options.xVal.slice(-1)[0];}
var j=1,va,vb,pa,pb;while(value>=options.xPct[j]){j++;}
va=options.xVal[j-1];vb=options.xVal[j];pa=options.xPct[j-1];pb=options.xPct[j];return isPercentage([va,vb],(value-pa)*subRangeRatio(pa,pb));}
function getStep(options,value){var j=1,a,b;while((options.dir?(100-value):value)>=options.xPct[j]){j++;}
if(options.snap){a=options.xPct[j-1];b=options.xPct[j];if((value-a)>((b-a)/2)){return b;}
return a;}
if(!options.xSteps[j-1]){return value;}
return options.xPct[j-1]+closest(value-options.xPct[j-1],options.xSteps[j-1]);}
function fixEvent(e){e.preventDefault();var touch=e.type.indexOf('touch')===0,mouse=e.type.indexOf('mouse')===0,pointer=e.type.indexOf('pointer')===0,x,y,event=e;if(e.type.indexOf('MSPointer')===0){pointer=true;}
if(e.originalEvent){e=e.originalEvent;}
if(touch){x=e.changedTouches[0].pageX;y=e.changedTouches[0].pageY;}
if(mouse||pointer){if(!pointer&&window.pageXOffset===undefined){window.pageXOffset=document.documentElement.scrollLeft;window.pageYOffset=document.documentElement.scrollTop;}
x=e.clientX+window.pageXOffset;y=e.clientY+window.pageYOffset;}
event.points=[x,y];event.cursor=mouse;return event;}
function testStep(parsed,entry){if(!isNumeric(entry)){throw new Error("noUiSlider: 'step' is not numeric.");}
parsed.xSteps[0]=entry;}
function testRange(parsed,entry){if(typeof entry!=='object'||$.isArray(entry)){throw new Error("noUiSlider: 'range' is not an object.");}
if(entry['min']===undefined||entry['max']===undefined){throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");}
$.each(entry,function(index,value){var percentage;if(typeof value==="number"){value=[value];}
if(!$.isArray(value)){throw new Error("noUiSlider: 'range' contains invalid value.");}
if(index==='min'){percentage=0;}else if(index==='max'){percentage=100;}else{percentage=parseFloat(index);}
if(!isNumeric(percentage)||!isNumeric(value[0])){throw new Error("noUiSlider: 'range' value isn't numeric.");}
parsed.xPct.push(percentage);parsed.xVal.push(value[0]);if(!percentage){if(!isNaN(value[1])){parsed.xSteps[0]=value[1];}}else{parsed.xSteps.push(isNaN(value[1])?false:value[1]);}});$.each(parsed.xSteps,function(i,n){if(!n){return true;}
parsed.xSteps[i]=fromPercentage([parsed.xVal[i],parsed.xVal[i+1]],n)/subRangeRatio(parsed.xPct[i],parsed.xPct[i+1]);});}
function testStart(parsed,entry){if(typeof entry==="number"){entry=[entry];}
if(!$.isArray(entry)||!entry.length||entry.length>2){throw new Error("noUiSlider: 'start' option is incorrect.");}
parsed.handles=entry.length;parsed.start=entry;}
function testSnap(parsed,entry){parsed.snap=entry;if(typeof entry!=='boolean'){throw new Error("noUiSlider: 'snap' option must be a boolean.");}}
function testConnect(parsed,entry){if(entry==='lower'&&parsed.handles===1){parsed.connect=1;}else if(entry==='upper'&&parsed.handles===1){parsed.connect=2;}else if(entry===true&&parsed.handles===2){parsed.connect=3;}else if(entry===false){parsed.connect=0;}else{throw new Error("noUiSlider: 'connect' option doesn't match handle count.");}}
function testOrientation(parsed,entry){switch(entry){case'horizontal':parsed.ort=0;break;case'vertical':parsed.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.");}}
function testMargin(parsed,entry){if(parsed.xPct.length>2){throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.");}
parsed.margin=fromPercentage(parsed.xVal,entry);if(!isNumeric(entry)){throw new Error("noUiSlider: 'margin' option must be numeric.");}}
function testDirection(parsed,entry){switch(entry){case'ltr':parsed.dir=0;break;case'rtl':parsed.dir=1;parsed.connect=[0,2,1,3][parsed.connect];break;default:throw new Error("noUiSlider: 'direction' option was not recognized.");}}
function testBehaviour(parsed,entry){if(typeof entry!=='string'){throw new Error("noUiSlider: 'behaviour' must be a string containing options.");}
var tap=entry.indexOf('tap')>=0,extend=entry.indexOf('extend')>=0,drag=entry.indexOf('drag')>=0,fixed=entry.indexOf('fixed')>=0,snap=entry.indexOf('snap')>=0;parsed.events={tap:tap||snap,extend:extend,drag:drag,fixed:fixed,snap:snap};}
function testSerialization(parsed,entry,sliders){parsed.ser=[entry['lower'],entry['upper']];parsed.formatting=entry['format'];$.each(parsed.ser,function(index,linkInstances){if(!$.isArray(linkInstances)){throw new Error("noUiSlider: 'serialization."+(!index?'lower':'upper')+"' must be an array.");}
$.each(linkInstances,function(){if(!(this instanceof $.Link)){throw new Error("noUiSlider: 'serialization."+(!index?'lower':'upper')+"' can only contain Link instances.");}
this.setIndex(index);this.setObject(sliders);this.setFormatting(entry['format']);});});if(parsed.dir&&parsed.handles>1){parsed.ser.reverse();}}
function test(options,sliders){var parsed={xPct:[],xVal:[],xSteps:[false],margin:0},tests;tests={'step':{r:false,t:testStep},'start':{r:true,t:testStart},'connect':{r:true,t:testConnect},'direction':{r:true,t:testDirection},'range':{r:true,t:testRange},'snap':{r:false,t:testSnap},'orientation':{r:false,t:testOrientation},'margin':{r:false,t:testMargin},'behaviour':{r:true,t:testBehaviour},'serialization':{r:true,t:testSerialization}};options=$.extend({'connect':false,'direction':'ltr','behaviour':'tap','orientation':'horizontal'},options);options['serialization']=$.extend({'lower':[],'upper':[],'format':{}},options['serialization']);$.each(tests,function(name,test){if(options[name]===undefined){if(test.r){throw new Error("noUiSlider: '"+name+"' is required.");}
return true;}
test.t(parsed,options[name],sliders);});parsed.style=parsed.ort?'top':'left';return parsed;}
function addHandle(options,index){var handle=$('<div><div/></div>').addClass(Classes[2]),additions=['-lower','-upper'];if(options.dir){additions.reverse();}
handle.children().addClass(Classes[3]+" "+Classes[3]+additions[index]);return handle;}
function addElement(handle,link){if(link.el){link=new $.Link({'target':$(link.el).clone().appendTo(handle),'method':link.method,'format':link.formatting},true);}
return link;}
function addElements(elements,handle,formatting){var index,list=[],standard=new $.Link({},true);standard.setFormatting(formatting);list.push(standard);for(index=0;index<elements.length;index++){list.push(addElement(handle,elements[index]));}
return list;}
function addLinks(options,handles){var index,links=[];for(index=0;index<options.handles;index++){links[index]=addElements(options.ser[index],handles[index].children(),options.formatting);}
return links;}
function addConnection(connect,target,handles){switch(connect){case 1:target.addClass(Classes[7]);handles[0].addClass(Classes[6]);break;case 3:handles[1].addClass(Classes[6]);case 2:handles[0].addClass(Classes[7]);case 0:target.addClass(Classes[6]);break;}}
function addHandles(options,base){var index,handles=[];for(index=0;index<options.handles;index++){handles.push(addHandle(options,index).appendTo(base));}
return handles;}
function addSlider(options,target){target.addClass([Classes[0],Classes[8+options.dir],Classes[4+options.ort]].join(' '));return $('<div/>').appendTo(target).addClass(Classes[1]);}
function closure(target,options,originalOptions){var $Target=$(target),$Locations=[-1,-1],$Base,$Serialization,$Handles;function baseSize(){return $Base[['width','height'][options.ort]]();}
function fireEvents(events){var index,values=[$Target.val()];for(index=0;index<events.length;index++){$Target.trigger(events[index],values);}}
function setHandle(handle,to,delimit){var n=handle[0]!==$Handles[0][0]?1:0,lower=$Locations[0]+options.margin,upper=$Locations[1]-options.margin;if(delimit&&$Handles.length>1){to=n?Math.max(to,lower):Math.min(to,upper);}
if(to<100){to=getStep(options,to);}
to=limit(parseFloat(to.toFixed(7)));if(to===$Locations[n]){if($Handles.length===1){return false;}
return(to===lower||to===upper)?0:false;}
handle.css(options.style,to+'%');if(handle.is(':first-child')){handle.toggleClass(Classes[17],to>50);}
$Locations[n]=to;if(options.dir){to=100-to;}
$($Serialization[n]).each(function(){this.write(fromStepping(options,to),handle.children(),$Target);});return true;}
function getPositions(a,b,delimit){var c=a+b[0],d=a+b[1];if(delimit){if(c<0){d+=Math.abs(c);}
if(d>100){c-=(d-100);}
return[limit(c),limit(d)];}
return[c,d];}
function jump(handle,to,instant){if(!instant){addClassFor($Target,Classes[14],300);}
setHandle(handle,to,false);fireEvents(['slide','set','change']);}
function attach(events,element,callback,data){events=events.replace(/\s/g,namespace+' ')+namespace;return element.on(events,function(e){var disabled=$Target.attr('disabled');disabled=!(disabled===undefined||disabled===null);if($Target.hasClass(Classes[14])||disabled){return false;}
e=fixEvent(e);e.calcPoint=e.points[options.ort];callback(e,data);});}
function move(event,data){var handles=data.handles||$Handles,positions,state=false,proposal=((event.calcPoint-data.start)*100)/baseSize(),h=handles[0][0]!==$Handles[0][0]?1:0;positions=getPositions(proposal,data.positions,handles.length>1);state=setHandle(handles[0],positions[h],handles.length===1);if(handles.length>1){state=setHandle(handles[1],positions[h?0:1],false)||state;}
if(state){fireEvents(['slide']);}}
function end(event){$('.'+Classes[15]).removeClass(Classes[15]);if(event.cursor){$('body').css('cursor','').off(namespace);}
doc.off(namespace);$Target.removeClass(Classes[12]);fireEvents(['set','change']);}
function start(event,data){if(data.handles.length===1){data.handles[0].children().addClass(Classes[15]);}
event.stopPropagation();attach(actions.move,doc,move,{start:event.calcPoint,handles:data.handles,positions:[$Locations[0],$Locations[$Handles.length-1]]});attach(actions.end,doc,end,null);if(event.cursor){$('body').css('cursor',$(event.target).css('cursor'));if($Handles.length>1){$Target.addClass(Classes[12]);}
$('body').on('selectstart'+namespace,false);}}
function tap(event){var location=event.calcPoint,total=0,to;event.stopPropagation();$.each($Handles,function(){total+=this.offset()[options.style];});total=(location<total/2||$Handles.length===1)?0:1;location-=$Base.offset()[options.style];to=(location*100)/baseSize();jump($Handles[total],to,options.events.snap);if(options.events.snap){start(event,{handles:[$Handles[total]]});}}
function edge(event){var i=event.calcPoint<$Base.offset()[options.style],to=i?0:100;i=i?0:$Handles.length-1;jump($Handles[i],to,false);}
function events(behaviour){var i,drag;if(!behaviour.fixed){for(i=0;i<$Handles.length;i++){attach(actions.start,$Handles[i].children(),start,{handles:[$Handles[i]]});}}
if(behaviour.tap){attach(actions.start,$Base,tap,{handles:$Handles});}
if(behaviour.extend){$Target.addClass(Classes[16]);if(behaviour.tap){attach(actions.start,$Target,edge,{handles:$Handles});}}
if(behaviour.drag){drag=$Base.find('.'+Classes[7]).addClass(Classes[10]);if(behaviour.fixed){drag=drag.add($Base.children().not(drag).children());}
attach(actions.start,drag,start,{handles:$Handles});}}
if($Target.hasClass(Classes[0])){throw new Error('Slider was already initialized.');}
$Base=addSlider(options,$Target);$Handles=addHandles(options,$Base);$Serialization=addLinks(options,$Handles);addConnection(options.connect,$Target,$Handles);events(options.events);target.vSet=function(){var args=Array.prototype.slice.call(arguments,0),callback,link,update,animate,i,count,actual,to,values=asArray(args[0]);if(typeof args[1]==='object'){callback=args[1]['set'];link=args[1]['link'];update=args[1]['update'];animate=args[1]['animate'];}else if(args[1]===true){callback=true;}
if(options.dir&&options.handles>1){values.reverse();}
if(animate){addClassFor($Target,Classes[14],300);}
count=$Handles.length>1?3:1;if(values.length===1){count=1;}
for(i=0;i<count;i++){to=link||$Serialization[i%2][0];to=to.getValue(values[i%2]);if(to===false){continue;}
to=toStepping(options,to);if(options.dir){to=100-to;}
if(setHandle($Handles[i%2],to,true)===true){continue;}
$($Serialization[i%2]).each(function(index){if(!index){actual=this.actual;return true;}
this.write(actual,$Handles[i%2].children(),$Target,update);});}
if(callback===true){fireEvents(['set']);}
return this;};target.vGet=function(){var i,retour=[];for(i=0;i<options.handles;i++){retour[i]=$Serialization[i][0].saved;}
if(retour.length===1){return retour[0];}
if(options.dir){return retour.reverse();}
return retour;};target.destroy=function(){$.each($Serialization,function(){$.each(this,function(){if(this.target){this.target.off(namespace);}});});$(this).off(namespace).removeClass(Classes.join(' ')).empty();return originalOptions;};$Target.val(options.start);}
function initialize(originalOptions){if(!this.length){throw new Error("noUiSlider: Can't initialize slider on empty selection.");}
var options=test(originalOptions,this);return this.each(function(){closure(this,options,originalOptions);});}
function rebuild(options){return this.each(function(){var values=$(this).val(),originalOptions=this.destroy(),newOptions=$.extend({},originalOptions,options);$(this).noUiSlider(newOptions);if(originalOptions.start===newOptions.start){$(this).val(values);}});}
function value(){return this[0][!arguments.length?'vGet':'vSet'].apply(this[0],arguments);}
$.fn.val=function(){function valMethod(a){return a.hasClass(Classes[0])?value:$val;}
var args=arguments,first=$(this[0]);if(!arguments.length){return valMethod(first).call(first);}
return this.each(function(){valMethod($(this)).apply($(this),args);});};$.noUiSlider={'Link':$.Link};$.fn.noUiSlider=function(options,re){return(re?rebuild:initialize).call(this,options);};}(window['jQuery']||window['Zepto']));