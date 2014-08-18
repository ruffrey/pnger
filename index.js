'use strict';

var fs = require('fs');
var path = require('path');
var execFile = require('child_process').execFile;

var platform_folder = process.platform + (process.platform === 'linux' ? "/" + process.arch : "");

var pngquant = path.join(__dirname, 'pngquant', platform_folder, process.platform === 'win32' ? 'pngquant.exe' : 'pngquant');
var optipng = path.join(__dirname, 'optipng', platform_folder, process.platform === 'win32' ? 'optipng.exe' : 'optipng');

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
	if (!(settings.buffer instanceof Buffer)) {
		return callback(new Error("pnger settings.buffer is missing or invalid"));
	}
	if (typeof settings.output !== 'string') {
		return callback(new Error("pnger settings.output is not a string"));
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

	var twoMinutes = 2 * 60 * 1000;
	var cpOptions = {
		timeout: twoMinutes
	};

	var pngbase64Buffer = settings.buffer;
	var outputPath = settings.output;

	var tempPath = outputPath.replace('.png', '-tmp.png');
	var minifiedPath = outputPath.replace('.png', '-min.png');

	var next = function (err, arg) {
		if (!queue.length) {
			callback(err, arg);
			removeTemp(handleErr);
			removeMin(handleErr);
			return;
		}
		var fn = queue.shift();
		fn(next);
	};

	var queue = [
		function writeTemp(cb) {
			fs.writeFile(tempPath, pngbase64Buffer, cb);
		},
		function minify(cb) {
			var fullArgs = args_pngquant.concat(['-f', '-o', minifiedPath, tempPath]);
			execFile(pngquant, fullArgs, cpOptions, cb);
		},
		function optimize(cb) {
			var fullArgs = args_optipng.concat(['-out', outputPath, minifiedPath]);
			execFile(optipng, fullArgs, cpOptions, cb);
		}
	];

	function removeTemp(cb) {
		fs.unlink(tempPath, cb);
	}

	function removeMin(cb) {
		fs.unlink(minifiedPath, cb);
	}

	function handleErr(err) {
		if (err) {
			console.error(err);
		}
	}

	next();

}
exports = module.exports = pnger;
