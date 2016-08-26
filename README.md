CapMyFreeCamsNodeJS (CapMFCNodeJS) (`mfc-node` with a better name and `readme.md`!)
==========

### Credit ###

This is a fork of [mfc-node](https://github.com/sstativa/mfc-node), just with a better name and `readme.md` and `FFMPEG.exe` included!

`mfc-node` is based on [capturbate-node](https://github.com/SN4T14/capturebate-node).


### About ###

CapMyFreeCamsNodeJS will automatically record MyFreeCams.com streams.

CapMFCNodeJS is a Node.JS application that should run on all platforms that can run Node.JS, e.g. Windows, Linux, Mac.

This instructions are for *Windows*!

Setup
==========

* [Node.JS](https://nodejs.org/download/)
	>Basically you need to have `node.exe` and `npm.cmd` in your `PATH`. I recommend using `Cmder`, downloading `node-v6.4.0-win-x64.zip` and putting it in your `PATH`. You don't even have to *"install"* anything, it's portable.

* `FFMPEG.exe`
	>Included!

* CapMFCodeJS
	>On GitHub, click `Clone or download`, `Download ZIP`.

* Via `Command Prompt` or `Cmder`
    	```
    	cd CapMyFreeCamsNodeJS # change to the package directory
    	npm install # install package
		```

Config
===========

Sample `config.yml`

```
# Folder for streams in progress.
captureDirectory: '%CD%\capturing'

# Folder for finished streams.
completeDirectory: '%CD%\captured'

# How often to check for new models in seconds.
modelScanInterval: 300

debug: true

# Model ID.
# To get Model ID, go to model's profile (e.g. http://profiles.myfreecams.com/GoddessDeedee), "View Page Source", search for "nProfileUserId"
models:
  - 20249367
  - 17030607
  - 20346887
  - 10272360
  - 14554856
  - 15406039
  - 16915028
  - 2530502
  - 5526194
  - 8339561
  - 8450555
  - 9759444
  - 9798847
  - 20346887
  - 10876762
  - 15042071
  - 21090122
  - 11549213
  - 21578748
  - 21948600

# The next time the model comes online, her Model ID will be ADDED to "models" above.
includeModels:
  - AURA_HEHMSOTH

# The next time the model comes online, her Model ID will be REMOVED from "models"
excludeModels: []
```
**NOTE:** `config.yml` is read only once, at start. If you want to add or remove a model while the package is running, use `updates.yml`.

Run
===========

Via `Command Prompt` or `Cmder` (recommended):

```
  cd CapMyFreeCamsNodeJS # change to the package directory
  node main.js # run package
```

Convert *.TS files to *.MKV
===========

Run `runConvert.bat`.

**NOTE:** `runConvert.bat` will delete all `*.TS` files under 50 MB. You can adjust this number in `mainconvert.bat`