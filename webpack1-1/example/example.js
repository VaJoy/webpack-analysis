var a = require("a");
var b = require("b");
require.ensure(["c"], function(require) {
    require("b").xyz();
    var d = require("d");
});

module.exports = {
    test: function(){console.log(123)}
};