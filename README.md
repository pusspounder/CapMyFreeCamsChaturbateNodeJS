CapMyFreeCamsNodeJS (CapMFCNodeJS) (`mfc-node` with a better name and `readme.md`!)
==========

### About ###

CapMyFreeCamsNodeJS will automatically record MyFreeCams.com streams.

CapMFCNodeJS is a Node.JS application that should run on all platforms that can run Node.JS, e.g. Windows, Linux, Mac.

https://gitlab.com/pusspounder (All of my work)

https://github.com/pusspounder (Some of my work that requires GitHub)

**The following instructions are for *Windows* only!**

### Credit ###

This is a fork of [mfc-node](https://github.com/sstativa/mfc-node), just with a better name, better `readme.md` and `FFMPEG.exe` included!

`mfc-node` is based on [capturbate-node](https://github.com/SN4T14/capturebate-node).

Download/Setup
==========

* [Node.JS](https://nodejs.org/download/)
  >Basically you need to have `node.exe` and `npm.cmd` in your `PATH`. I recommend using `Cmder`, downloading `node-v6.4.0-win-x64.zip` and putting it in your `PATH`. You don't even have to *"install"* anything, it's portable.

* CapMyFreeCamsNodeJS
  >Download from either GitLab or GitHub:
  >https://github.com/pusspounder/CapMyFreeCamsNodeJS/archive/master.zip
  >https://gitlab.com/pusspounder/CapMyFreeCamsNodeJS/repository/archive.zip

* Via `Command Prompt` or `Cmder`
    > cd CapMyFreeCamsNodeJS # change to the package directory

    > npm install # install package

Config
===========

Sample `config.yml`:

```
# Folder for streams in progress.
captureDirectory: 'capturing'

# Folder for finished streams.
completeDirectory: 'captured'

# How often to check for new models in seconds.
modelScanInterval: 300

debug: true

# MyFreeCams Model ID.
# To get Model ID, go to model's profile, "View Page Source", search for "nProfileUserId". In Chrome/Chromium "view-source:http://profiles.myfreecams.com/target"
models:
- 10272360 # XViciousLoveX
- 15406039 # StunningAna
- 16915028 # AriannaSecret
- 5526194 # KATEELIFE
- 8450555 # AlisOnFire
- 9759444 # Geniva_
- 9798847 # B_E_L_L_E_
- 20346887 # BaeGotBooty
- 21948600 # TwerkAndChill

# The next time the model comes online, her Model ID will be ADDED to "models" above.
includeModels:
  - MODELNAMETOSTARTCAPTURING

# The next time the model comes online, her Model ID will be REMOVED from "models"
excludeModels:
  - MODELNAMETOSTOPCAPTURING
```
**NOTE:** `config.yml` is read only once, at start. If you want to add or remove a model while the package is running, use `updates.yml`.

Run
===========

Via `Command Prompt` or `Cmder`:

```
  cd CapMyFreeCamsNodeJS # change to the package directory
  node main32 # 32 bit
  or
  node main64 # 64 bit
```

Convert *.TS files to *.MKV
===========

Run `runConvert*.bat`.

**NOTE:** `runConvert*.bat` will delete all `*.TS` files under 50 MB. You can adjust this number in `mainconvert.bat`