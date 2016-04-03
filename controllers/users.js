'use strict';

/**
 * Controller dependencies
 */
var User = require('../models/user'),
    _ = require('lodash');

/**
 * Create user
 */
exports.create = function (req, res, next) {
    var user = new User(req.body);
    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    /*
     req.assert('email', 'Sie müssen eine gültige E-mail Adresse angeben').isEmail();
     req.assert('password', 'Passwort muss zwischen 8-20 Zeichen lang sein').len(8, 20);
     req.assert('username', 'Username kann nich länger als 20 Zeichen sein').len(1, 20);
     req.assert('confirmPassword', 'Passwörter sind nicht gleich').equals(req.body.password);

     var errors = req.validationErrors();
     console.log(errors);
     if (errors) {
     return res.status(400).send(errors);
     }
     */
    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    //user.roles = ['authenticated'];
    user.roles = req.body.roles;
    user.save(function (err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    res.status(400).send('Username bereits vergeben');
                    break;
                default:
                    res.status(400).send('Bitte alle Felder ausfüllen');
            }

            return res.status(400);
        }
        res.jsonp(user);
    });
};

/**
 * Find user by id
 */
exports.user = function (req, res, next) {
    User
        .findOne({
            _id: req.params.userId
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + req.params.userId));
            req.profile = user;
            res.jsonp(user);
            //next();
        });
};
/**
 * Update a user
 */
exports.update = function (req, res, next) {
    User.findOne({
            _id: req.body._id
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + req.body._id));

            user = _.extend(user, req.body);

            user.save(function (err) {
                if (err) return next(err);
                res.jsonp(user);
            });

        });

};

/**
 * Delete an user
 */
exports.destroy = function (req, res, next) {

    User.findOne({
            _id: req.params.userId
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + req.param('userId')));

            user.remove(function (err) {
                if (err) {
                    res.render('error', {
                        status: 500
                    });
                } else {
                    res.jsonp(user);
                }
            });
        })
};

/**
 * List of Users
 */
exports.all = function (req, res) {
    User.find().sort('-created').populate('user', 'name username').exec(function (err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
};
