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
    text: {
        type: String,
        required: true,
        get: escapeProperty
    },
    type: {
        type: String,
        required: true
    },
    answerValues: {
        type: Array,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'Measure'
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    rules: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Rule'
        }]
    },
    records: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Record'
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
