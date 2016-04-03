'use strict';

/**
 * Controller dependencies
 */
var Measure = require('../models/measure'),
    _ = require('lodash');

/**
 * Create measure
 */
exports.create = function (req, res, next) {
    var measure = new Measure(req.body);

    measure.save(function (err) {
        if (err) {
            return res.status(400).send(err);
        }
        res.jsonp(measure);
    });
};

/**
 * Find measure by id
 */
exports.measure = function (req, res, next) {
    Measure.findById(req.params.measureId)
        .exec(function (err, measure) {
            if (err) return next(err);
            if (!measure) return next(new Error('Failed to load Measure ' + req.params.measureId));
            req.profile = measure;
            res.jsonp(measure);
        });
};

/**
 * Update a measure
 */
exports.update = function (req, res, next) {
    Measure.findOneAndUpdate({
            _id: req.body._id
        })
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
