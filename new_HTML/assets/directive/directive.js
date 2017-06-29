angular.module('shoutModule')
.directive('activeFunction',function(){
	return {link:function(scope,element,attrs){
		element.bind('click',function(e){
				console.log("element:",element);
			});
		}
	};
})
