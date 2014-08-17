'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('exec');
var async = require('async');

var pngquant = "";
var optipng = "";


var platform_folder = process.platform + (process.platform === 'linux' ? "/" + process.arch : "");

pngquant = path.join(__dirname, 'pngquant', platform_folder, process.platform === 'win32' ? 'pngquant.exe' : 'pngquant');
optipng = path.join(__dirname, 'optipng', platform_folder, process.platform === 'win32' ? 'optipng.exe' : 'optipng');

args_pngquant.unshift(pngquant);
args_optipng.unshift(optipng);

/**
 * # pnger
 * 
 * Cross platform lossy compression and optimization for PNG images.
 * 
 * Regarding the `optimize` setting:
 * 
 * 		1 - 1 trial
 *		2 - 8 trials
 *		3 - 16 trials
 *		4 - 24 trials
 *		5 - 48 trials
 *		6 - 120 trials
 *		7 - 240 trials
 * 
 * Further reading:
 * 
 * 		* http://pngquant.org/#manual
 *		* https://github.com/kevva/imagemin-optipng#optimizationlevel
 *		* http://optipng.sourceforge.net/optipng-0.7.5.man.pdf
 * 	
 * 
 * @param {object} settings
 * @param {string} settings.buffer - Required. A base64 UTF8 buffer of the PNG image.
 * @param {string} settings.output - Required. File path with filename where the image will be saved.
 * @param {string} settings.quality='60-80' - Optional. Range `'0-100'` of output png quality. Give it a spread of at least `15`.
 * @param {number} settings.speed=5 - Optional. Number `0` through `10` where `10` is fastest and reduces quality.
 * @param {number} settings.optimize=3 - Optional. Number `1` through `7` where `7` is insanely slow.
 * @param {function} callback - With a single `err` argument indicating if an error occurred.
 * 
 */
function pnger(settings, callback) {
	if (typeof settings !== 'object') {
		return callback(new Error("pnger settings not an object"));
	}
	if (typeof settings.buffer !== 'string') {
		return callback(new Error("pnger settings.buffer is missing"));
	}
	if (typeof settings.output !== 'string') {
		return callback(new Error("pnger settings.output is missing"));
	}

	var args_pngquant = [
		'--quality', settings.quality || '60-80', // quality
		'--speed', settings.speed || 5 // speed
	];
	var args_optipng = [
		'-strip', 'all', 
		'-quiet', 
		'-clobber',
		'-o', settings.optimize || 3 // optimize
	];

	var pngbase64Buffer = settings.buffer;
	var outputPath = settings.output;

	var tempPath = outputPath.replace('.png', '-tmp.png');
	var minifiedPath = outputPath.replace('.png', '-min.png');


	async.waterfall([
		function writeTemp(cb) {
			fs.writeFile(tempPath, pngbase64Buffer, cb);
		},
		function minify(cb) {
			exec(args_pngquant.concat(['-f', '-o', minifiedPath, tempPath]), function (err, out, code) {
				cb(err);
			});
		},
		function removeTemp(cb) {
			fs.unlink(tempPath, cb);
		},
		function optimize(cb) {
			exec(args_optipng.concat(['-out', outputPath, minifiedPath]), function (err, out, code) {
				cb(err);
			});
		},
		function removeMin(cb) {
			fs.unlink(minifiedPath, cb);
		}
	], callback);

}
exports = module.exports = pnger;
