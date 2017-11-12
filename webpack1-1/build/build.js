var vajoy =   // 可以在客户端执行 vajoy.test() 试试
    (function (document, undefined) {
        return function (modules) {
            var installedModules = {};
            // 定义 require 方法
            function require(moduleId) {
                if (installedModules[moduleId])
                    return installedModules[moduleId].exports;
                // 客户端是没有 Node 侧的 module/module.exports 的，
                // 因此需要初始化一个 module 对象，扔给各模块内部去加工
                var module = installedModules[moduleId] = {
                    exports: {}
                };
                //将上面初始化的 module 对象扔进去并执行对应模块代码
                modules[moduleId](module, module.exports, require);
                // 返回模块对外接口
                return module.exports;
            }
            // 定义 require.ensure 方法
            require.ensure = function (chunkId, callback) {
                callback(require);
            };
            return require(0);
        }
    })(document)
    ({
        0: function (module, exports, require) {

            var a = require(1);
            var b = require(2);
            require.ensure(1, function (require) {
                require(2).xyz();
                var d = require(4);
            });

            module.exports = {
                test: function () {
                    console.log(123)
                }
            };

        },

        1: function (module, exports, require) {

            console.log('a');

        },

        2: function (module, exports, require) {

            exports.xyz = function () {
                console.log('b module output')
            };

        },

        3: function (module, exports, require) {

            console.log('c');

        },

        4: function (module, exports, require) {

            console.log('d');

        },

    })