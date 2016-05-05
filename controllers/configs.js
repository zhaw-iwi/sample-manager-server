'use strict';

/**
 * Controller dependencies
 */
var Config = require('../models/config'),
    User = require('../models/user'),
    Util = require('../util');

function authorize(login, password, callback) {
    User.findOne({
            $or: [{
                email: login
            }, {
                username: login
            }]
        })
        .exec(function (err, user) {
            if (err) return callback(err);
            if (!user) return callback({message: 'Falscher Benutzer oder Passwort'});

            if (user.authenticate(password) && user.isSuperAdmin()) {
                callback()
            } else {
                callback({message: 'Falscher Benutzer oder Passwort'});
            }
        });
}

/**
 * Create config
 */
exports.create = function (req, res, next) {
    authorize(req.login, req.password, function(err) {
        if (err) return next(err);
        var config = new Config();

        config.key = req.body.key;
        config.value = req.body.value;

        config.save(function (err) {
            if (err) {
                return res.status(400).send(Util.easifyErrors(err));
            }
            res.jsonp(config);
        });

    });
};

/**
 * Find config by id
 */
exports.config = function (req, res, next) {
    authorize(req.login, req.password, function(err) {
        if (err) return next(err);
        Config.findById(req.params.configId)
            .exec(function (err, config) {
                if (err) return next(err);
                if (!config) return next(new Error('Failed to load Config ' + req.params.configId));
                res.jsonp(config);
            });
    });
};
/**
 * Update a config
 */
exports.update = function (req, res, next) {
    authorize(req.login, req.password, function(err) {
        if (err) return next(err);
        Config.findOneAndUpdate({
                _id: req.body._id
            },
            req.body)
            .exec(function (err, config) {
                if (err) return next(err);
                if (!config) return next(new Error('Failed to update Config ' + req.body._id));
                res.jsonp(config);
            });
    });
};

/**
 * Delete an config
 */
exports.destroy = function (req, res, next) {
    authorize(req.login, req.password, function(err) {
        if (err) return next(err);
        Config.findByIdAndRemove(req.params.configId)
            .exec(function (err, config) {
                if (err) return next(err);
                if (!config) return next(new Error('Failed to delete Config ' + req.params.configId));
                res.jsonp(config);
            })
    });
};

/**
 * List of Configs
 */
exports.all = function (req, res) {
    authorize(req.login, req.password, function(err) {
        if (err) return next(err);
        Config.find().sort('key').exec(function (err, configs) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(configs);
            }
        });
    });
};
