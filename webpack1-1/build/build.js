/******/var vajoy=
/******/(function(document, undefined) {
/******/	return function(modules) {
/******/		var installedModules = {};
/******/		function require(moduleId) {
/******/			if(installedModules[moduleId])
/******/				return installedModules[moduleId];
/******/			var module = installedModules[moduleId] = {
/******/				exports: {}
/******/			};
/******/			modules[moduleId](module, module.exports, require);
/******/			return module.exports;
/******/		}
/******/		require.ensure = function(chunkId, callback) {
/******/			callback(require);
/******/		};
/******/		return require(0);
/******/	}
/******/})(document)
/******/({
/******/0: function(module, exports, require) {

var a = require(2);
var b = require(1);
require.ensure(1, function(require) {
    require(1).xyz();
    var d = require(4);
});

module.exports = {
    test: function(){console.log(123)}
};

/******/},
/******/
/******/1: function(module, exports, require) {

exports.xyz = function(){
    console.log(1234)
};

/******/},
/******/
/******/2: function(module, exports, require) {

// module a

/******/},
/******/
/******/3: function(module, exports, require) {

// module c

/******/},
/******/
/******/4: function(module, exports, require) {

// module d

/******/},
/******/
/******/})