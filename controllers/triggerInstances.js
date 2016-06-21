'use strict';

/**
 * Controller dependencies
 */
var TriggerInstance = require('../models/triggerInstance'),
    Project = require('../models/project'),
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
    TriggerInstance.find().sort('-created')
        .populate('user measure trigger')
        .exec(function (err, triggerInstances) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(triggerInstances);
        }
    });
};

/**
 * List of TriggerInstances by user
 */
exports.allByProject = function (req, res, next) {
    Project.findById(req.params.projectId)
        .populate({
            path: 'measures',
            populate: {
                path: 'trigger'
            }
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.body.project._id));

            project.start = Date.now();
            project.save(function (err) {
                if (err) {
                    return res.status(400).send(Util.easifyErrors(err));
                }
                //res.jsonp(project);
            });

            var triggerInstances = [];
            //for (var i = 0; i < project.users.length; i++) {
                for (var j = 0; j < project.measures.length; j++) {
                    if ( project.measures[j].trigger) {
                        var triggerInstance = {};
                        //triggerInstance.user = project.users[i]._id;
                        triggerInstance.measure = project.measures[j];
                        delete triggerInstance.measure.trigger;
                        triggerInstance.trigger = project.measures[j].trigger;
                        if (triggerInstance.trigger.type === 'random') {
                            triggerInstance.triggersLeft = triggerInstance.trigger.timeSpan.repeats;
                        }
                        triggerInstances.push(triggerInstance);
                    }
                }
            //}
            //TriggerInstance.insertMany(triggerInstances);
            res.jsonp(triggerInstances);
        });
/*
    TriggerInstance.find({user: req.params.userId})
        .sort('trigger')
        .populate('measure trigger')
        .exec(function (err, triggerInstances) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                
                res.jsonp(triggerInstances);
            }
        });
*/
};
