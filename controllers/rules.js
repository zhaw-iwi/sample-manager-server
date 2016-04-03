'use strict';

/**
 * Controller dependencies
 */
var Rule = require('../models/rule'),
    _ = require('lodash');

/**
 * Create rule
 */
exports.create = function (req, res, next) {
    var rule = new Rule(req.body);

    rule.save(function (err) {
        if (err) {
            return res.status(400).send(err);
        }
        res.jsonp(rule);
    });
};

/**
 * Find rule by id
 */
exports.rule = function (req, res, next) {
    Rule
        .findOne({
            _id: req.params.ruleId
        })
        .exec(function (err, rule) {
            if (err) return next(err);
            if (!rule) return next(new Error('Failed to load Rule ' + req.params.ruleId));
            req.profile = rule;
            res.jsonp(rule);
        });
};
/**
 * Update a rule
 */
exports.update = function (req, res, next) {
    Rule.findOne({
            _id: req.body._id
        })
        .exec(function (err, rule) {
            if (err) return next(err);
            if (!rule) return next(new Error('Failed to load Rule ' + req.body._id));

            rule = _.extend(rule, req.body);

            rule.save(function (err) {
                if (err) return next(err);
                res.jsonp(rule);
            });

        });

};

/**
 * Delete an rule
 */
exports.destroy = function (req, res, next) {

    Rule.findOne({
            _id: req.params.ruleId
        })
        .exec(function (err, rule) {
            if (err) return next(err);
            if (!rule) return next(new Error('Failed to load Rule ' + req.params.ruleId));

            rule.remove(function (err) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    res.jsonp(rule);
                }
            });
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
