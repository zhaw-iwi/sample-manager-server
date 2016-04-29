'use strict';

/**
 * Controller dependencies
 */
var Project = require('../models/project'),
    User = require('../models/user'),
    Util = require('../util');

/**
 * Create project
 */
exports.create = function (req, res, next) {
    var project = new Project(req.body);
    var randomColor = (0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
    if (!project.imageUrl) {
        project.imageUrl = 'http://dummyimage.com/300x100/' + /*'64B5F6'*/ randomColor + '/000d.png&text=+';
    }
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

/**
 * Find project by id
 */
exports.project = function (req, res, next) {
    Project.findById(req.params.projectId)
        .populate({
            path: 'measures',
            populate: { path: 'triggers' }
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