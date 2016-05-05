'use strict';

/**
 * Model dependencies
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    crypto    = require('crypto'),
    _   = require('lodash');

/**
 * Validations
 */
var validatePresenceOf = function(value) {
    // If you are authenticating by any of the oauth strategies, don't validate.
    return (this.provider && this.provider !== 'local') || (value && value.length);
};

var validateUniqueEmail = function(value, callback) {
    var User = mongoose.model('User');
    User.find({
        $and: [{
            email: value
        }, {
            _id: {
                $ne: this._id
            }
        }]
    }, function(err, user) {
        callback(err || user.length === 0);
    });
};

var validateUniqueUsername = function(value, callback) {
    var User = mongoose.model('User');
    User.find({
        $and: [{
            username: value
        }, {
            _id: {
                $ne: this._id
            }
        }]
    }, function(err, user) {
        callback(err || user.length === 0);
    });
};

/**
 * Getter
 */
var escapeProperty = function(value) {
    return _.escape(value);
};

/**
 * Schema
 */
var UserSchema = new Schema({
    name: {
        type: String,
        required: false,
        get: escapeProperty
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Bitte geben Sie eine gültige E-mail Adresse ein.'],
        validate: [validateUniqueEmail, 'E-mail Addresse wird bereits benutzt!']
    },
    username: {
        type: String,
        required: false,
        get: escapeProperty,
        validate: [validateUniqueUsername, 'Username wird bereits benutzt!']
    },
    projects: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }]
    },
    gcmToken: String,
    roles: {
        type: Array,
        default: ['authenticated', 'anonymous']
    },
    hashed_password: {
        type: String,
        validate: [validatePresenceOf, 'Passwort darf nicht leer sein!']
    },
    provider: {
        type: String,
        default: 'local'
    },
    salt: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

/**
 * Virtuals
 */
UserSchema.virtual('password').set(function(password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.hashPassword(password);
}).get(function() {
    return this._password;
});

/**
 * Pre-save hook
 */
UserSchema.pre('save', function(next) {
    if (this.isNew && this.provider === 'local' && this.password && !this.password.length)
        return next(new Error('Ungültiges Passwort'));
    next();
});

/**
 * Methods
 */

/**
 * HasRole - check if the user has required role
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.hasRole = function(role) {
    var roles = this.roles;
    return roles.indexOf('admin') !== -1 || roles.indexOf(role) !== -1;
};

/**
 * IsAdmin - check if the user is an administrator
 *
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.isAdmin = function() {
    return this.roles.indexOf('admin') !== -1;
};

/**
 * IsAdmin - check if the user is an administrator
 *
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.isSuperAdmin = function() {
    return this.roles.indexOf('superadministrator') !== -1;
};

/**
 * Authenticate - check if the passwords are the same
 *
 * @param {String} plainText
 * @return {Boolean}
 * @api public
 */
UserSchema.methods.authenticate = function(plainText) {
    return this.hashPassword(plainText) === this.hashed_password;
};

/**
 * Make salt
 *
 * @return {String}
 * @api public
 */
UserSchema.methods.makeSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};

/**
 * Hash password
 *
 * @param {String} password
 * @return {String}
 * @api public
 */
UserSchema.methods.hashPassword = function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
};

/**
 * Hide security sensitive fields
 *
 * @returns {*|Array|Binary|Object}
 */
UserSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.hashed_password;
    delete obj.salt;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);
