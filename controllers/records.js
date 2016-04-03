'use strict';

/**
 * Controller dependencies
 */
var Record = require('../models/record'),
    _ = require('lodash');

/**
 * Create record
 */
exports.create = function (req, res, next) {
    var record = new Record(req.body);

    record.save(function (err) {
        if (err) {
            return res.status(400).send(err);
        }
        res.jsonp(record);
    });
};

/**
 * Find record by id
 */
exports.record = function (req, res, next) {
    Record
        .findOne({
            _id: req.params.recordId
        })
        .exec(function (err, record) {
            if (err) return next(err);
            if (!record) return next(new Error('Failed to load Record ' + req.params.recordId));
            req.profile = record;
            res.jsonp(record);
        });
};
/**
 * Update a record
 */
exports.update = function (req, res, next) {
    Record.findOne({
            _id: req.body._id
        })
        .exec(function (err, record) {
            if (err) return next(err);
            if (!record) return next(new Error('Failed to load Record ' + req.body._id));

            record = _.extend(record, req.body);

            record.save(function (err) {
                if (err) return next(err);
                res.jsonp(record);
            });

        });

};

/**
 * Delete an record
 */
exports.destroy = function (req, res, next) {

    Record.findOne({
            _id: req.params.recordId
        })
        .exec(function (err, record) {
            if (err) return next(err);
            if (!record) return next(new Error('Failed to load Record ' + req.params.recordId));

            record.remove(function (err) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    res.jsonp(record);
                }
            });
        })
};

/**
 * List of Records
 */
exports.all = function (req, res) {
    Record.find().sort('-created').exec(function (err, records) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(records);
        }
    });
};
