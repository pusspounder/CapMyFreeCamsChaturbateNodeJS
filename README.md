mfc-node
==========

mfc-node lets you follow and archive your favorite models' shows on myfreecams.com

This is an attempt to create a script similar to [capturbate-node](https://github.com/SN4T14/capturebate-node) based on different pieces of code found in the Internet.

Credits:
	* [capturbate-node](https://github.com/SN4T14/capturebate-node)

	* [Sembiance/get_mfc_video_url.js](https://gist.github.com/Sembiance/df151de0006a0bf8ae54)

Requirements
==========
(Debian 7, minimum)

[Node.js](https://nodejs.org/download/) used to run mfc-node, hence the name.

[ffmpeg](https://www.ffmpeg.org/download.html)

Setup
===========

Install requirements, run `npm install` in the same folder as main.js is.

Edit `config.yml` file and add your favorite models:

* `models` -  here will be ids of your favorite models, if you know model's id you should add it here (check YAML specification for collections)
* `includeModels` - if you don't know id of the model, you can add her name here, the next time the model goes online her id will be added to "models" automatically
* `excludeModels` - if you don't want to capture the model anymore, but you don't know her id, you can add her name here the next time the model goes online her id will be removed from "models" automatically

Please note, the script reads config only ones at start. If you want to add or remove model when the script is running, you should use `updates.yml` file. The script looks for changes in this file every cycle (`modelScanInterval`).

Be mindful when capturing many streams at once to have plenty of space on disk and the bandwidth available or you'll end up dropping a lot of frames and the files will be useless.

Running & Output
===========

To start capturing streams you need to run `node main.js` I recommend you do this in [screen](https://www.gnu.org/software/screen/) as that'll keep running if you lose connection to the machine or otherwise close your shell.
