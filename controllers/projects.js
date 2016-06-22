'use strict';

/**
 * Controller dependencies
 */
var Project = require('../models/project'),
    User = require('../models/user'),
    TriggerInstance = require('../models/triggerInstance'),
    GCM = require('../modules/gcm'),
    Util = require('../util'),
    _   = require('lodash');

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
            path: 'triggers measures users'
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
 * List of Projects for joining on mobile
 */
exports.mobileProjects = function (req, res) {
    Project.find().sort('-created').exec(function (err, projects) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            var result = [];
            for (var i = 0; i < projects.length; i++) {
                result.push({
                    _id: projects[i]._id,
                    name: projects[i].name,
                    users: projects[i].users,
                    imageUrl: projects[i].imageUrl,
                    checkedIn: projects[i].users.indexOf(req.params.userId) > -1
                })
            }
            res.jsonp(result);
        }
    });
};

/**
 * Update user subscriptions
 */
exports.subscribe = function (req, res) {

    res.jsonp({});

    subscribeAsyncLoop(0, req.body.projects, req.body.userId, function(err) {

    });
};

function subscribeAsyncLoop(i, projects, userId, callback) {
    if (i < projects.length) {
        var updateProject = projects[i];
        Project.findOne({_id: projects[i].projectId})
            .exec(function (err, project) {

                User.findById(userId)
                    .exec(function (err, user) {
                        // Add or remove from project
                        var hasChanges = false;
                        if (updateProject.checkedIn) {
                            if (!_.find(project.users, function(user_id) {
                                    return user_id.id === user._id.id;
                                })) {
                                project.users.push(user);
                                console.log('user ' + userId + ' subscribe to project ' + project._id);
                                hasChanges = true;
                            }
                        } else {
                            var userIndex = _.findIndex(project.users, function (user_id) {
                                return user_id.id === user._id.id;
                            });
                            if (userIndex > -1) {
                                project.users.splice(userIndex, 1);
                                console.log('user ' + userId + ' unsubscribe from project ' + project._id);
                                hasChanges = true;
                            }
                        }

                        if (hasChanges) {
                            Project.findOneAndUpdate({
                                    _id: project._id
                                },
                                project)
                                .exec(function (err, project) {
                                    subscribeAsyncLoop(++i, projects, userId, callback);
                                });
                        } else {
                            subscribeAsyncLoop(++i, projects, userId, callback);
                        }
                    });
        });
    } else {
        callback();
    }
}