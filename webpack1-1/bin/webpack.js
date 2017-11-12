#!/usr/bin/env node

var path = require("path");
var fs = require("fs");
var argv = require("optimist")
	.usage("Usage: $0 <input> <output>")
	
	.boolean("single")
	.describe("single", "Disable Code Splitting")
	.default("single", false)
	
	.boolean("min")
	.describe("min", "Minimize it with uglifyjs")
	.default("min", false)
	
	.boolean("filenames")
	.describe("filenames", "Output Filenames Into File")
	.default("filenames", false)
	
	.string("options")
	.describe("options", "Options JSON File")
	
	.string("script-src-prefix")
	.describe("script-src-prefix", "Path Prefix For JavaScript Loading")
	
	.string("libary")
	.describe("libary", "Stores the exports into this variable")
	
	.demand(1)
	.argv;

var input = argv._[0],  //第一个参数作为要打包的入口文件的地址
	output = argv._[1];  //第二个参数作为输出文件的地址

if (input && input[0] !== '/' && input[1] !== ':') {
	input = path.join(process.cwd(), input);
}
if (output && output[0] !== '/' && input[1] !== ':') {
	output = path.join(process.cwd(), output);
}

var options = {};

// 当前版本虽然还不支持缺省地去查找 webpack.config.js 文件来读取配置，
// 但支持传入传入 --option=XXX.json 的形式引入配置文件（JSON格式）
if(argv.options) {
	options = JSON.parse(fs.readFileSync(argv.options, "utf-8"));
}

// 打包后代码块（chunks）加载路径的前缀
if(argv["script-src-prefix"]) {
	options.scriptSrcPrefix = argv["script-src-prefix"];
}

// 是否使用 Uglify 来压缩混淆文件
if(argv.min) {
	options.minimize = true;
}

// 若输入了 --filenames 参数，则将在打包后的文件里注明每个 chunk 所对应的原文件的绝对路径（以注释的形式）
if(argv.filenames) {
	options.includeFilenames = true;
}

// 可以将入口文件的 module.exports 传给自定义的全局变量
if(argv.libary) {
	options.libary = argv.libary;
}

var webpack = require("../lib/webpack.js");

if(argv.single) {
	webpack(input, options, function(err, source) {
		if(err) {
			console.error(err);
			return;
		}
		if(output) {
			fs.writeFileSync(output, source, "utf-8");
		} else {
			process.stdout.write(source);
		}
	});
} else {
	output = output || path.join(process.cwd(), "js", "web.js");
	if(!options.outputDirectory) options.outputDirectory = path.dirname(output);
	if(!options.output) options.output = path.basename(output);
	if(!options.outputPostfix) options.outputPostfix = "." + path.basename(output);
	var outExists = fs.existsSync(options.outputDirectory);
	if(!outExists) fs.mkdirSync(options.outputDirectory);
	webpack(input, options, function(err, stats) {
		if(err) {
			console.error(err);
			return;
		}
		console.log(stats);
	});
}