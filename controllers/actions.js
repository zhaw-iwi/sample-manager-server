'use strict';

/**
 * Controller dependencies
 */
var GCM = require('../modules/gcm'),
    Project = require('../models/project'),
    TriggerInstance = require('../models/triggerInstance'),
    Measure = require('../models/measure'),
    Util = require('../util');
/**
 * Start a project
 */
exports.start = function (req, res) {
    Project.findById(req.params.projectId)
        .populate({
            path: 'measures users'
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.body.project._id));

            project.start = Date.now();
            project.save(function (err) {
                if (err) {
                    return res.status(400).send(Util.easifyErrors(err));
                }
                res.jsonp(project);
            });

            var triggerInstances = [];
            for (var i = 0; i < project.users.length; i++) {
                for (var j = 0; j < project.measures.length; j++) {
                    if ( project.measures[j].trigger) {
                        var triggerInstance = new TriggerInstance();
                        triggerInstance.user = project.users[i]._id;
                        triggerInstance.measure = project.measures[j]._id;
                        triggerInstance.trigger = project.measures[j].trigger;
                        if (triggerInstance.trigger.type === 'random') {
                            triggerInstance.triggersLeft = triggerInstance.measure.timeSpan.repeats;
                        }
                        triggerInstances.push(triggerInstance);
                    }
                }
            }
            TriggerInstance.insertMany(triggerInstances);

            GCM.sendProjectStartMessage(project.users, project._id);
        });
};

/**
 * Restart a project (just send message)
 */
exports.restart = function (req, res) {
    Project.findById(req.params.projectId)
        .populate({
            path: 'users'
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.params.projectId));

            GCM.sendProjectStartMessage(project.users, project._id);

            res.jsonp(project);
        });
};

/**
 * Trigger a measure manually
 */
exports.triggerManual = function (req, res) {
    Measure.findById(req.params.measureId)
        .populate({
            path: 'project',
            populate: {
                path: 'users',
                model: 'User'
            }
        })
        .exec(function (err, measure) {
            if (err) return next(err);
            if (!measure) return next(new Error('Failed to load Measure ' + req.params.measureId));

            var users = req.users || measure.project.users;
            GCM.sendManualTriggerMessage(users, measure._id);

            res.jsonp(measure);
        });
};