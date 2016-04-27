'use strict';

/**
 * Controller dependencies
 */
var Measure = require('../models/measure'),
    Project = require('../models/project'),
    Rule = require('../models/rule'),
    Util = require('../util');

/**
 * Create measure
 */
exports.create = function (req, res, next) {
    var measure = new Measure(req.body);
    req.body.project.measures = req.body.project.measures || [];
    req.body.project.measures.push(measure);
    Project.findOneAndUpdate({
            _id: req.body.project._id
        }, req.body.project)
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.body.project._id));

            // Insert rules
            var rules = [];
            for (var i = 0; i < req.body.rules.length; i++) {
                req.body.rules[i].measure = measure._id;
                rules.push(new Rule(req.body.rules[i]));
            }
            Rule.insertMany(rules);
            measure.rules = rules;
            measure.save(function (err) {
                if (err) {
                    return res.status(400).send(Util.easifyErrors(err));
                }
                res.jsonp(measure);
            });
        });
};

/**
 * Find measure by id
 */
exports.measure = function (req, res, next) {
    Measure.findById(req.params.measureId)
        .populate({ path: 'rules project' })
        .exec(function (err, measure) {
            if (err) return next(err);
            if (!measure) return next(new Error('Failed to load Measure ' + req.params.measureId));
            res.jsonp(measure);
        });
};

/**
 * Update a measure
 */
exports.update = function (req, res, next) {

    // Update or Inert rules?
    var rulesToInsert = [];
    for (var i = 0; i < req.body.rules.length; i++) {
        if (req.body.rules[i]._id) {
            Rule.findOneAndUpdate({
                    _id: req.body.rules[i]._id
                }, req.body.rules[i], {upsert: true})
                .exec(function (err, rule) {
                    if (err) return next(err);
                    if (!rule) return next(new Error('Failed to load Rule'));
                });
        } else {
            req.body.rules[i] = new Rule(req.body.rules[i]);
            rulesToInsert.push(req.body.rules[i]);
        }
    }
    // Insert new rules
    if (rulesToInsert.length > 0) {
        Rule.insertMany(rulesToInsert);
    }

    Measure.findOneAndUpdate({
            _id: req.body._id
        }, req.body)
        .exec(function (err, measure) {
            if (err) return next(err);
            if (!measure) return next(new Error('Failed to load Measure ' + req.body._id));
            res.jsonp(measure);
        });
};

/**
 * Delete an measure
 */
exports.destroy = function (req, res, next) {
    Measure.findByIdAndRemove(req.params.measureId)
        .exec(function (err, measure) {
            if (err) return next(err);
            if (!measure) return next(new Error('Failed to load Measure ' + req.params.measureId));
            res.jsonp(measure);
        })
};

/**
 * List of Measures
 */
exports.all = function (req, res) {
    Measure.find().sort('-created').exec(function (err, measures) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(measures);
        }
    });
};
