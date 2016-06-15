'use strict';

/**
 * Module dependencies
 */
var gcm = require('node-gcm'),
    Config = require('../models/config'),
    _ = require('lodash');

var API_KEY = '';

/**
 * Send external trigger message via GCM
 */
exports.sendExternalTriggerMessage = function (users, triggerId) {

    var message = new gcm.Message();
    message.addData('action', 'external_trigger');
    message.addData('triggerId', triggerId);

    sendMessage(message, users);
};

/**
 * Send manual trigger message via GCM
 */
exports.sendManualTriggerMessage = function (projectId, measureId) {

    var message = new gcm.Message();
    message.addData('action', 'manual_trigger');
    message.addData('measureId', measureId);

    sendMessage(message, projectId);
};

/**
 * Send a trigger update message via GCM
 */
exports.sendTriggerUpdateMessage = function (users, triggerId) {

    var message = new gcm.Message();
    message.addData('action', 'trigger_update');
    message.addData('triggerId', triggerId);

    sendMessage(message, users);
};

/**
 * Send a measure update message via GCM
 */
exports.sendMeasureUpdateMessage = function (users, measureId) {

    var message = new gcm.Message();
    message.addData('action', 'measure_update');
    message.addData('measureId', measureId);

    sendMessage(message, users);
};

/**
 * Send a project start message via GCM
 */
exports.sendProjectStartMessage = function (projectId) {

    var message = new gcm.Message();
    message.addData('action', 'project_start');
    message.addData('projectId', projectId);

    sendMessage(message, projectId);
};

/**
 * Send a project end message via GCM
 */
exports.sendProjectEndMessage = function (projectId) {

    var message = new gcm.Message();
    message.addData('action', 'project_end');
    message.addData('projectId', projectId);

    sendMessage(message, projectId);
};

/**
 * Get API key from cache or config
 * @param callback
 */
function getApiKey(callback) {
    if (API_KEY !== '') {
        callback(null, API_KEY);
    }
    Config.findOne({
            key: 'api_key'
        })
        .exec(function (err, config) {
            if (err) return next(err);
            if (!config) return callback({message: 'No API key'});

            API_KEY = config.value;
            callback(null, config.value);
        })
}

/**
 * Send message to reqTokens
 * @param message
 * @param to
 */
function sendMessage(message, to) {
    getApiKey(function (err, apiKey) {
        if (err) {
            return console.log(err.message);
        }
        // Set up the sender with API key
        var sender = new gcm.Sender(apiKey);

        var target = {};
        if (Array.isArray(to)) {
            to = _.filter(to, function(user) {
                return user.gcmToken !== undefined;
            });

            target.registrationTokens = _.map(to, function(user) {
                return user.gcmToken;
            });

        } else {
            target.topic = to;
        }


        sender.send(message, target, function (err, response) {
            if (err) console.error(err);
            else    console.log(response);
        });
    });
}