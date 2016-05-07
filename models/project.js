'use strict';

/**
 * Model dependencies
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema,
    _   = require('lodash');

/**
 * Validations
 */

/**
 * Getter
 */
var escapeProperty = function(value) {
    return _.escape(value);
};

/**
 * Schema
 */
var ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
        get: escapeProperty
    },
    created: {
        type: Date,
        default: Date.now()
    },

    start: {
        type: Date
    },
    end: {
        type: Date
    },
    users: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    measures: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Measure'
        }]
    },
    triggers: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Trigger'
        }]
    },
    imageUrl: String
});

/**
 * Virtuals
 */


/**
 * Pre-save hook
 */


/**
 * Methods
 */

module.exports = mongoose.model('Project', ProjectSchema);
