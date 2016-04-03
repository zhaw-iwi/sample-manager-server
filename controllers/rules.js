'use strict';

/**
 * Controller dependencies
 */
var Rule = require('../models/rule'),
    Util = require('../util');

/**
 * Create rule
 */
exports.create = function (req, res, next) {
    var rule = new Rule(req.body);

    rule.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        res.jsonp(rule);
    });
};

/**
 * Find rule by id
 */
exports.rule = function (req, res, next) {
    Rule.findById(req.params.ruleId)
        .exec(function (err, rule) {
            if (err) return next(err);
            if (!rule) return next(new Error('Failed to load Rule ' + req.params.ruleId));
            res.jsonp(rule);
        });
};
/**
 * Update a rule
 */
exports.update = function (req, res, next) {
    Rule.findOneAndUpdate({
            _id: req.body._id
        },
        req.body)
        .exec(function (err, rule) {
            if (err) return next(err);
            if (!rule) return next(new Error('Failed to update Rule ' + req.body._id));
            res.jsonp(rule);
        });
};

/**
 * Delete an rule
 */
exports.destroy = function (req, res, next) {
    Rule.findByIdAndRemove(req.params.ruleId)
        .exec(function (err, rule) {
            if (err) return next(err);
            if (!rule) return next(new Error('Failed to delete Rule ' + req.params.ruleId));
            res.jsonp(rule);
        })
};

/**
 * List of Rules
 */
exports.all = function (req, res) {
    Rule.find().sort('-created').exec(function (err, rules) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(rules);
        }
    });
};
