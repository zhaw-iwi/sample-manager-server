'use strict';

/**
 * Controller dependencies
 */
var Project = require('../models/project'),
    User = require('../models/user'),
    TriggerInstance = require('../models/triggerInstance'),
    GCM = require('../modules/gcm'),
    Util = require('../util');

/**
 * Create project
 */
exports.create = function (req, res, next) {
    var project = new Project(req.body);

    project.imageUrl = generateRandomColorImage();
    project.users = [req.session.user];
    project.questions = [];
    project.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        req.session.user.projects ? req.session.user.projects.push(project) : req.session.user.projects = [project];

        User.findOneAndUpdate({
                _id: req.session.user._id
            },
            req.session.user)
            .exec(function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to update User ' + req.session.user._id));
                res.jsonp(project);
            });
    });
};

function generateRandomColorImage() {
    var randomColor = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    return 'http://dummyimage.com/300x100/' + /*'64B5F6'*/ randomColor + '/000d.png&text=+'
}
/**
 * Find project by id
 */
exports.project = function (req, res, next) {
    Project.findById(req.params.projectId)
        .populate({
            path: 'triggers measures'
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.params.projectId));
            res.jsonp(project);
        });
};

/**
 * Update a project
 */
exports.update = function (req, res, next) {
    Project.findOneAndUpdate({
            _id: req.body._id
        },
        req.body)
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to update Project ' + req.body._id));
            res.jsonp(project);
        });
};

/**
 * Delete a project
 */
exports.destroy = function (req, res, next) {
    Project.findByIdAndRemove(req.params.projectId)
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.params.projectId));
            res.jsonp(project);
        });
};

/**
 * List of Projects
 */
exports.all = function (req, res) {
    Project.find().sort('-created').populate('users').exec(function (err, projects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(projects);
        }
    });
};

/**
 * List of Projects of User
 */
exports.userProjects = function (req, res) {
    Project.find({
        _id: req.session.user._id
    }).sort('-created').populate('users').exec(function (err, projects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(projects);
        }
    });
};

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
            if (!project) return next(new Error('Failed to load Project ' + req.body.project._id));

            GCM.sendProjectStartMessage(project.users, project._id);

            res.jsonp(project);
        });
};