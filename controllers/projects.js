'use strict';

/**
 * Controller dependencies
 */
var Project = require('../models/project'),
    Util = require('../util');

/**
 * Create project
 */
exports.create = function (req, res, next) {
    var project = new Project(req.body);

    project.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        res.jsonp(project);
    });
};

/**
 * Find project by id
 */
exports.project = function (req, res, next) {
    Project.findById(req.params.projectId)
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
        })
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