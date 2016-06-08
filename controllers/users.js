'use strict';

/**
 * Controller dependencies
 */
var User = require('../models/user'),
    Project = require('../models/project'),
    Util = require('../util');


/**
 * Create user
 */
exports.create = function (req, res, next) {
    var user = new User(req.body);
    user.username = req.body.email;
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
    // Hard coded for now. Will address this with the user permissions system
    user.roles = ['authenticated'];
    //user.roles = req.body.roles;
    user.save(function (err) {
        if (err) {
            return res.status(400).send(Util.easifyErrors(err));
        }
        res.jsonp(user);
    });
};

/**
 * Create user
 */
exports.createForProject = function (req, res, next) {
    Project.findById(req.body[0].projects[0])
        .exec(function (err, project) {
            var users = [];
            for (var i = 0; i < req.body.length; i++) {
                var user = new User(req.body[i]);
                user.username = user.email;
                user.provider = 'local';
                user.password = 'svendroid';
                //user.password = generatePassword();
                // Hard coded for now. Will address this with the user permissions system
                user.roles = ['authenticated'];

                users.push(user);
                project.users.push(user);
            }
            User.insertMany(users);

            project.save(function (err) {
                if (err) {
                    return res.status(400).send(Util.easifyErrors(err));
                }
                res.jsonp(users);
            });
        });
};

function generatePassword() {
    var text = "";
    var possible = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
        'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    for (var i = 0; i < 8; i++) {
        text += possible[Math.floor(Math.random() * possible.length)];
    }

    return text;
}

/**
 * Find user by id
 */
exports.user = function (req, res, next) {
    User.findById(req.params.userId)
        .populate('projects')
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + req.params.userId));
            res.jsonp(user);
        });
};
/**
 * Update a user
 */
exports.update = function (req, res, next) {
    User.findOneAndUpdate({
            _id: req.body._id
        },
        req.body)
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to update User ' + req.body._id));
            res.jsonp(user);
        });
};

/**
 * Delete a user
 */
exports.destroy = function (req, res, next) {
    User.findByIdAndRemove(req.params.userId)
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to delete User ' + req.params.userId));
            res.jsonp(user);
        })
};

/**
 * List of Users
 */
exports.all = function (req, res) {
    User.find().sort('-created').populate('projects').exec(function (err, users) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(users);
        }
    });
};

/**
 * Authorize
 */
exports.authorize = function (req, res, next) {
    if (req.session.user && req.session.user.roles.indexOf('authenticated') > -1) {
        User.findById(req.session.user._id)
            .populate('projects')
            .exec(function (err, user) {
                if (err) return next(err);
                if (!user) return next(new Error('Failed to load User ' + req.params.userId));
                req.session.user = user;
                res.jsonp(req.session.user);
            });

    } else {
        res.status(401).send({error: 'Bitte loggen Sie sich ein.'});
    }
};

/**
 * Login
 */
exports.login = function (req, res, next) {
    User.findOne({
            $or: [{
                email: req.body.login
            }, {
                username: req.body.login
            }]
        })
        .exec(function (err, user) {
            if (err) return next(err);
            if (!user) return res.status(400).send({error: 'Falscher Benutzer oder Passwort'});

            if (user.authenticate(req.body.password)) {
                req.session.user = user;
                res.jsonp(user);
            } else {
                res.status(400).send({error: 'Falscher Benutzer oder Passwort'});
            }
        })
};

/**
 * Logout
 */
exports.logout = function (req, res, next) {
    var user = req.session.user;
    req.session.destroy();
    res.jsonp(user);
};

/**
 * Register/refresh Google Cloud Messaging (GCM) token
 */
exports.token = function (req, res, next) {

    var user = new User();
    user.email = 'user_' + (Math.random() * 999999999);
    user.username = user.email;
    user.provider = 'local';
    user.password = 'svendroid';
    //user.password = generatePassword();
    // Hard coded for now. Will address this with the user permissions system
    user.roles = ['authenticated'];
    user.gcmToken = req.body.token;

    user.save(function (err) {
        if (err) return next(err);
            res.jsonp(user);
    });


};

/**
 * List of non-admin users of project
 */
exports.projectUserList = function (req, res, next) {
    User.find({roles: {$not: /admin/}, project: req.params.projectId})
        .sort('email')
        .exec(function (err, users) {
            if (err) return next(err);
            if (!users) return next(new Error('Failed to load Users for Project ' + req.params.projectId));

            res.jsonp(users);

        });
};
