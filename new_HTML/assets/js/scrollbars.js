!function(){"use strict";function o(){this.defaults={scrollButtons:{enable:!0},callbacks:{whileScrolling:function(){var o=this.mcs.topPct;o>1&&100>o&&($("div .mCustomScrollBox").removeClass("scrolltop"),$("div .mCustomScrollBox").removeClass("scrollbottom"),$("div .mCustomScrollBox").addClass("scrollbox")),1>o&&($("div .mCustomScrollBox").removeClass("scrolltop"),$("div .mCustomScrollBox").removeClass("scrollbox"),$("div .mCustomScrollBox").addClass("scrollbottom")),o>99&&($("div .mCustomScrollBox").removeClass("scrollbottom"),$("div .mCustomScrollBox").removeClass("scrollbox"),$("div .mCustomScrollBox").addClass("scrolltop"))}},advanced:{updateOnBrowserResize:!0,updateOnContentResize:!0},axis:"yx"},$.mCustomScrollbar.defaults.scrollButtons=this.defaults.scrollButtons,$.mCustomScrollbar.defaults.axis=this.defaults.axis,this.$get=function(){return{defaults:this.defaults}}}function l(o,l,s,r){s.mCustomScrollbar("destroy");var t={};r.ngScrollbarsConfig&&(t=r.ngScrollbarsConfig);for(var a in o)if(o.hasOwnProperty(a))switch(a){case"scrollButtons":t.hasOwnProperty(a)||(l.scrollButtons=o[a]);break;case"axis":t.hasOwnProperty(a)||(l.axis=o[a]);break;default:t.hasOwnProperty(a)||(t[a]=o[a])}s.mCustomScrollbar(t),angular.element("div .mCustomScrollBox").addClass("scrollbottom")}function s(o){return{scope:{ngScrollbarsConfig:"=?",ngScrollbarsUpdate:"=?",element:"=?"},link:function(s,r,t){s.elem=r;var a=o.defaults,c=$.mCustomScrollbar.defaults;s.ngScrollbarsUpdate=function(){r.mCustomScrollbar.apply(r,arguments)},s.$watch("ngScrollbarsConfig",function(o,t){void 0!==o&&l(a,c,r,s)}),l(a,c,r,s)}}}angular.module("ngScrollbars",[]).provider("ScrollBars",o).directive("ngScrollbars",s),o.$inject=[],s.$inject=["ScrollBars"]}();