'use strict';
var Promise = require('bluebird');
var fs = require('fs');
var yaml = require('js-yaml');
var moment = require('moment');
var mkdirp = require('mkdirp');
var S = require('string');
var WebSocketClient = require('websocket').client;
var http = require('http');
var colors = require('colors');
var _ = require('underscore');
var childProcess = require('child_process');
var path = require('path');

function getCurrentDateTime() {
  return moment().format('YYYY-MM-DDTHHmmss'); // The only true way of writing out dates and times, ISO 8601
};

function printMsg(msg) {
  console.log(colors.blue('[' + getCurrentDateTime() + ']'), msg);
}

function printErrorMsg(msg) {
  console.log(colors.blue('[' + getCurrentDateTime() + ']'), colors.red('[ERROR]'), msg);
}

function printDebugMsg(msg) {
  if (config.debug && msg) {
    console.log(colors.blue('[' + getCurrentDateTime() + ']'), colors.yellow('[DEBUG]'), msg);
  }
}

function getFileno() {
  return new Promise(function(resolve, reject) {
    var client = new WebSocketClient();

    client.on('connectFailed', function(err) {
      reject(err);
    });

    client.on('connect', function(connection) {

      connection.on('error', function(err) {
        reject(err);
      });

      connection.on('message', function(message) {
        if (message.type === 'utf8') {
          var parts = /\{%22fileno%22:%22([0-9_]*)%22\}/.exec(message.utf8Data);

          if (parts && parts[1]) {
            printDebugMsg('fileno = ' + parts[1]);

            connection.close();
            resolve(parts[1]);
          }
        }
      });

      connection.sendUTF("hello fcserver\n\0");
      connection.sendUTF("1 0 0 20071025 0 guest:guest\n\0");
    });

    client.connect('ws://xchat20.myfreecams.com:8080/fcsl', '', 'http://xchat20.myfreecams.com:8080', {Cookie: 'company_id=3149; guest_welcome=1; history=7411522,5375294'});
  }).timeout(30000); // 30 secs
}

function getOnlineModels(fileno) {
  return new Promise(function(resolve, reject) {
    var url = 'http://www.myfreecams.com/mfc2/php/mobj.php?f=' + fileno + '&s=xchat20';

    printDebugMsg(url);

    http.get(url, function(response) {
      var rawHTML = '';

      response.on('data', function(data) {
        rawHTML += data;
      });

      response.on('end', function() {
        rawHTML = rawHTML.toString('utf8');
        rawHTML = rawHTML.substring(rawHTML.indexOf('{'), rawHTML.indexOf("\n") - 1);
        rawHTML = rawHTML.replace(/[^\x20-\x7E]+/g, '');

        var data = JSON.parse(rawHTML);

        var onlineModels = [];

        for (var key in data) {
          if (data.hasOwnProperty(key) && typeof data[key].nm != 'undefined' && typeof data[key].uid != 'undefined') {
            onlineModels.push({
              nm: data[key].nm,
              uid: data[key].uid,
              vs: data[key].vs,
              camserv: data[key].u.camserv,
              camscore: data[key].m.camscore,
              new_model: data[key].m.new_model
            });
          }
        }

        printMsg(onlineModels.length  + ' model(s) online');

        resolve(onlineModels);
      });
    });
  }).timeout(30000); // 30 secs
}

function selectMyModels(onlineModels) {
  return Promise
    .try(function() {
      printDebugMsg(config.models.length + ' model(s) in config');

      var dirty = false;
      var stats = fs.statSync('updates.yml');

      if (stats.isFile()) {
        var updates = yaml.safeLoad(fs.readFileSync('updates.yml', 'utf8'));

        if (!updates.includeModels) {
          updates.includeModels = [];
        }

        if (!updates.excludeModels) {
          updates.excludeModels = [];
        }

        // first we push changes to main config
        if (updates.includeModels.length > 0) {
          printMsg(updates.includeModels.length + ' model(s) to include');

          config.includeModels = _.union(config.includeModels, updates.includeModels);
          dirty = true;
        }

        if (updates.excludeModels.length > 0) {
          printMsg(updates.excludeModels.length + ' model(s) to exclude');

          config.excludeModels = _.union(config.excludeModels, updates.excludeModels);
          dirty = true;
        }

        // if there were some updates, then we reset updates.yml
        if (dirty) {
          updates.includeModels = [];
          updates.excludeModels = [];

          fs.writeFileSync('updates.yml', yaml.safeDump(updates), 0, 'utf8');
        }
      }

      config.includeModels = _.reject(config.includeModels, function(nm) {
        // if we managed to find id of the model in the collection of online models
        // we add her id in models and remove he from includeModels
        var model = _.findWhere(onlineModels, {nm: nm});

        if (!model) {
          return false;
        } else {
          config.models.push(model.uid);
          dirty = true;
          return true;
        }
      });

      config.excludeModels = _.reject(config.excludeModels, function(nm) {
        // if we managed to find id of the model in the collection of online models
        // we remove her id in models and remove he from excludeModels
        var model = _.findWhere(onlineModels, {nm: nm});

        if (!model) {
          return false;
        } else {
          config.models = _.without(config.models, model.uid);
          dirty = true;
          return true;
        }
      });

      if (dirty) {
        fs.writeFileSync('config.yml', yaml.safeDump(config), 0, 'utf8');
      }

      var myModels = [];

      _.each(config.models, function(uid) {
        var model = _.findWhere(onlineModels, {uid: uid});

        if (model) {
          if (model.vs === 0) {
            myModels.push(model);
          } else {
            printMsg(colors.magenta(model.nm) + ' is away or in a private');
          }
        }
      });

      printDebugMsg(myModels.length  + ' model(s) to capture');

      return myModels;
    });
}

function createCaptureProcess(model) {
  if (modelsCurrentlyCapturing.indexOf(model.uid) != -1) {
    printDebugMsg(colors.green(model.nm) + ' is already capturing');
    return; // resolve immediately
  }

  printMsg(colors.green(model.nm) + ' is now online, starting capturing process');

  return Promise
    .try(function() {
      var filename = model.nm + '_' + getCurrentDateTime() + '.ts';

      var spawnArguments = [
        '-hide_banner',
        '-v',
        'fatal',
        '-i',
        'http://video' + (model.camserv - 500) + '.myfreecams.com:1935/NxServer/ngrp:mfc_' + (100000000 + model.uid) + '.f4v_mobile/playlist.m3u8?nc=1423603882490',
        // 'http://video' + (model.camserv - 500) + '.myfreecams.com:1935/NxServer/mfc_' + (100000000 + model.uid) + '.f4v_aac/playlist.m3u8?nc=1423603882490',
        '-c',
        'copy',
        config.captureDirectory + '/' + filename
      ];

      var captureProcess = childProcess.spawn('ffmpeg', spawnArguments);

      captureProcess.stdout.on('data', function(data) {
        printMsg(data.toString);
      });

      captureProcess.stderr.on('data', function(data) {
        printMsg(data.toString);
      });

      captureProcess.on('close', function(code) {
        printMsg(colors.green(model.nm) + ' stopped streaming');

        var modelIndex = modelsCurrentlyCapturing.indexOf(model.uid);

        if (modelIndex !== -1) {
          modelsCurrentlyCapturing.splice(modelIndex, 1);
        }

        fs.stat(config.captureDirectory + '/' + filename, function(err, stats) {
          if (err) {
            if (err.code == 'ENOENT') {
              // do nothing, file does not exists
            } else {
              printErrorMsg('[' + colors.green(model.nm) + '] ' + err.toString());
            }
          } else if (stats.size === 0) {
            fs.unlink(config.captureDirectory + '/' + filename);
          } else {
            fs.rename(config.captureDirectory + '/' + filename, config.completeDirectory + '/' + filename, function(err) {
              if (err) {
                printErrorMsg('[' + colors.green(model.nm) + '] ' + err.toString());
              }
            });
          }
        });
      });

      if (!!captureProcess.pid) {
        modelsCurrentlyCapturing.push(model.uid);
      }
    })
    .catch(function(err) {
      printErrorMsg('[' + colors.green(model.nm) + '] ' + err.toString());
    });
}

function mainLoop() {
  printDebugMsg('Start searching for new models');

  Promise
    .try(function() {
      return getFileno();
    })
    .then(function(fileno) {
      return getOnlineModels(fileno);
    })
    .then(function(onlineModels) {
      return selectMyModels(onlineModels);
    })
    .then(function(myModels) {
      return Promise.all(myModels.map(createCaptureProcess));
    })
    .catch(function(err) {
      printErrorMsg(err);
    })
    .finally(function() {
      printMsg('Done, will search for new models in ' + config.modelScanInterval + ' second(s).');
      setTimeout(mainLoop, config.modelScanInterval * 1000);
    });
}

var modelsCurrentlyCapturing = new Array();

var config = yaml.safeLoad(fs.readFileSync('config.yml', 'utf8'));

config.captureDirectory = path.resolve(config.captureDirectory);
config.completeDirectory = path.resolve(config.completeDirectory);

mkdirp(config.captureDirectory, function(err) {
  if (err) {
    printErrorMsg(err);
    process.exit(1);
  }
});

mkdirp(config.completeDirectory, function(err) {
  if (err) {
    printErrorMsg(err);
    process.exit(1);
  }
});

mainLoop();
