'use strict';

/**
 * Module dependencies
 */
var gcm = require('node-gcm'),
    Config = require('../models/config');

var API_KEY = '';

function getApiKey(callback) {
    if (API_KEY !== '') {
        callback(API_KEY);
    }
    Config.findOne({
            key: 'api_key'
        })
        .exec(function (err, config) {
            if (err) return next(err);
            if (!config) return callback({message: 'No API key'});

            API_KEY = config.value;
            callback(undefined, config.value);
        })
}

/**
 * Send a trigger message via GCM
 */
exports.sendTriggerMessage = function (regTokens, triggerId, measureId) {
    getApiKey(function (err, apiKey) {
        if (err) {
            return console.log(err.message);
        }
        var message = new gcm.Message();

        message.addData('triggerId', triggerId);
        message.addData('measureId', measureId);

        // Set up the sender with your API key
        var sender = new gcm.Sender(apiKey);

        // Now the sender can be used to send messages
        sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            if (err) console.error(err);
            else    console.log(response);
        });
    });
};

/**
 * Send an update message via GCM
 */
exports.sendUpdateMessage = function (regTokens, triggerId, measureId) {
    getApiKey(function (err, apiKey) {
        if (err) {
            return console.log(err.message);
        }
        var message = new gcm.Message();

        message.addData('triggerId', triggerId);
        message.addData('measureId', measureId);

        // Set up the sender with your API key
        var sender = new gcm.Sender(apiKey);

        // Now the sender can be used to send messages
        sender.send(message, {registrationTokens: regTokens}, function (err, response) {
            if (err) console.error(err);
            else    console.log(response);
        });
    });
};


