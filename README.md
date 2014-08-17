# pgner

PNG compression and optimization for Node.js, from a base64 buffer, on windows, linux, mac.

## Installing

	npm install pnger

## Usage
	
	var pnger = require('pnger');
	var saveFilePath = __dirname + '/myfile.png';
	
	var options = {
		// required
		buffer: myBase64Utf8PngBuffer,
		output: saveFilePath

		// optional
		quality: '60-80', // '0-100'
		speed: '5', // between 0 and 10
		optimize: '3' // between 1 and 7
	};

	pnger(options, function (err) {
		if (err) {
			console.error(err);
		}
		// your file is saved at saveFilePath
	});

## Options

See [source jsdoc on settings](/blob/master/index.js).

## nodewebkit support

Tested cross platform on nodewebkit.

## Build platform

pnger builds on any platform, runs on any platform. Some png libraries must be built on the deployment platform.


## License

All included software is copyrighted and protected by the respective developers.

This project is licensed under the **MIT license**, copyright (c) Jeff Parrish:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
