'use strict';

/**
 * Controller dependencies
 */
var Measure = require('../models/measure'),
    Project = require('../models/project'),
    Trigger = require('../models/trigger'),
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

            // Insert triggers
            var triggers = [];
            for (var i = 0; i < req.body.triggers.length; i++) {
                req.body.triggers[i].measure = measure._id;
                triggers.push(new Trigger(req.body.triggers[i]));
            }
            Trigger.insertMany(triggers);
            measure.triggers = triggers;
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
        .populate({ path: 'triggers project' })
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

    // Update or Inert triggers?
    var triggersToInsert = [];
    for (var i = 0; i < req.body.triggers.length; i++) {
        if (req.body.triggers[i]._id) {
            Trigger.findOneAndUpdate({
                    _id: req.body.triggers[i]._id
                }, req.body.triggers[i], {upsert: true})
                .exec(function (err, trigger) {
                    if (err) return next(err);
                    if (!trigger) return next(new Error('Failed to load Trigger'));
                });
        } else {
            req.body.triggers[i] = new Trigger(req.body.triggers[i]);
            triggersToInsert.push(req.body.triggers[i]);
        }
    }
    // Insert new triggers
    if (triggersToInsert.length > 0) {
        Trigger.insertMany(triggersToInsert);
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
