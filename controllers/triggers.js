'use strict';

/**
 * Controller dependencies
 */
var Trigger = require('../models/trigger'),
    Util = require('../util');

/**
 * Create trigger
 */
exports.create = function (req, res, next) {
    var trigger = new Trigger(req.body);

    trigger.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        res.jsonp(trigger);
    });
};

/**
 * Find trigger by id
 */
exports.trigger = function (req, res, next) {
    Trigger.findById(req.params.triggerId)
        .exec(function (err, trigger) {
            if (err) return next(err);
            if (!trigger) return next(new Error('Failed to load Trigger ' + req.params.triggerId));
            res.jsonp(trigger);
        });
};
/**
 * Update a trigger
 */
exports.update = function (req, res, next) {
    Trigger.findOneAndUpdate({
            _id: req.body._id
        },
        req.body)
        .exec(function (err, trigger) {
            if (err) return next(err);
            if (!trigger) return next(new Error('Failed to update Trigger ' + req.body._id));
            res.jsonp(trigger);
        });
};

/**
 * Delete an trigger
 */
exports.destroy = function (req, res, next) {
    Trigger.findByIdAndRemove(req.params.triggerId)
        .exec(function (err, trigger) {
            if (err) return next(err);
            if (!trigger) return next(new Error('Failed to delete Trigger ' + req.params.triggerId));
            res.jsonp(trigger);
        })
};

/**
 * List of Triggers
 */
exports.all = function (req, res) {
    Trigger.find().sort('-created').exec(function (err, triggers) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(triggers);
        }
    });
};
