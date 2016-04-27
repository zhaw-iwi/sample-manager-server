'use strict';

/**
 * Controller dependencies
 */
var TriggerInstance = require('../models/triggerInstance'),
    Util = require('../util');

/**
 * Create triggerInstance
 */
exports.create = function (req, res, next) {
    var triggerInstance = new TriggerInstance(req.body);

    triggerInstance.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        res.jsonp(triggerInstance);
    });
};

/**
 * Find triggerInstance by id
 */
exports.triggerInstance = function (req, res, next) {
    TriggerInstance.findById(req.params.triggerInstanceId)
        .exec(function (err, triggerInstance) {
            if (err) return next(err);
            if (!triggerInstance) return next(new Error('Failed to load TriggerInstance ' + req.params.triggerInstanceId));
            res.jsonp(triggerInstance);
        });
};
/**
 * Update a triggerInstance
 */
exports.update = function (req, res, next) {
    TriggerInstance.findOneAndUpdate({
            _id: req.body._id
        },
        req.body)
        .exec(function (err, triggerInstance) {
            if (err) return next(err);
            if (!triggerInstance) return next(new Error('Failed to update TriggerInstance ' + req.body._id));
            res.jsonp(triggerInstance);
        });
};

/**
 * Delete an triggerInstance
 */
exports.destroy = function (req, res, next) {
    TriggerInstance.findByIdAndRemove(req.params.triggerInstanceId)
        .exec(function (err, triggerInstance) {
            if (err) return next(err);
            if (!triggerInstance) return next(new Error('Failed to delete TriggerInstance ' + req.params.triggerInstanceId));
            res.jsonp(triggerInstance);
        })
};

/**
 * List of TriggerInstances
 */
exports.all = function (req, res) {
    TriggerInstance.find().sort('-created').exec(function (err, triggerInstances) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(triggerInstances);
        }
    });
};
