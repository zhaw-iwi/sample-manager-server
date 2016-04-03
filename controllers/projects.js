'use strict';

/**
 * Controller dependencies
 */
var Project = require('../models/project'),
    _ = require('lodash');

/**
 * Create project
 */
exports.create = function (req, res, next) {
    var project = new Project(req.body);

    project.save(function (err) {
        if (err) {
            return res.status(400).send(err);
        }
        res.jsonp(project);
    });
};

/**
 * Find project by id
 */
exports.project = function (req, res, next) {
    Project
        .findOne({
            _id: req.params.projectId
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.params.projectId));
            req.profile = project;
            res.jsonp(project);
        });
};
/**
 * Update a project
 */
exports.update = function (req, res, next) {
    Project.findOne({
            _id: req.body._id
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.body._id));

            project = _.extend(project, req.body);

            project.save(function (err) {
                if (err) return next(err);
                res.jsonp(project);
            });

        });

};

/**
 * Delete an project
 */
exports.destroy = function (req, res, next) {

    Project.findOne({
            _id: req.params.projectId
        })
        .exec(function (err, project) {
            if (err) return next(err);
            if (!project) return next(new Error('Failed to load Project ' + req.params.projectId));

            project.remove(function (err) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    res.jsonp(project);
                }
            });
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
