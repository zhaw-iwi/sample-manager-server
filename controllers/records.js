'use strict';

/**
 * Controller dependencies
 */
var Record = require('../models/record'),
    Measure = require('../models/measure'),
    Util = require('../util');

/**
 * Create record
 */
exports.create = function (req, res, next) {
    var record = new Record(req.body);
    record.created = Date.now();

    record.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        res.jsonp(record);
    });
};

/**
 * Find record by id
 */
exports.record = function (req, res, next) {
    Record.findById(req.params.recordId)
        .exec(function (err, record) {
            if (err) return next(err);
            if (!record) return next(new Error('Failed to load Record ' + req.params.recordId));
            res.jsonp(record);
        });
};
/**
 * Update a record
 */
exports.update = function (req, res, next) {
    Record.findOneAndUpdate({
            _id: req.body._id
        },
        req.body)
        .exec(function (err, record) {
            if (err) return next(err);
            if (!record) return next(new Error('Failed to load Record ' + req.body._id));
            res.jsonp(record);
        });
};

/**
 * Delete a record
 */
exports.destroy = function (req, res, next) {
    Record.findByIdAndRemove(req.params.recordId)
        .exec(function (err, record) {
            if (err) return next(err);
            if (!record) return next(new Error('Failed to load Record ' + req.params.recordId));
            res.jsonp(record);
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

///////////////////////////////////////////////////////

/**
 * List of Records by project
 */
exports.recordsByProject = function (req, res) {
    Measure.find({project: req.params.projectId})
        .sort('-created')
        .exec(function (err, measures) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {

                var result = [];
                for (var i = 0; i < measures.length; i++) {
                    (function(innerI) {
                        Record.find({measure: '57461a3628df4ce82525d1e5'}).populate('user').sort('-created')
                            .exec(function (err, records) {
                                if (err) {
                                    res.render('error', {
                                        status: 500
                                    });
                                } else {
                                    result.push({
                                        _id: measures[innerI]._id,
                                        alias: measures[innerI].alias,
                                        records: records
                                    })
                                }
                                if (innerI >= measures.length - 1) {
                                    res.jsonp(result);
                                }
                            });
                    }(i));
                }
            }
    });

};