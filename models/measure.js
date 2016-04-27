'use strict';

/**
 * Model dependencies
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    _ = require('lodash');

/**
 * Validations
 */

/**
 * Getter
 */
var escapeProperty = function (value) {
    return _.escape(value);
};

/**
 * Schema
 */
var MeasureSchema = new Schema({
    alias: {
        type: String,
        get: escapeProperty
    },
    text: {
        type: String,
        required: true,
        get: escapeProperty
    },
    type: {
        type: String,
        required: true
    },
    values: {
        type: Array,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Measure'
    },
    parentValues: {
        type: Array,
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    trigger: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Trigger'
        }]
    }
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

module.exports = mongoose.model('Measure', MeasureSchema);
