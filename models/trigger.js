'use strict';

/**
 * Model dependencies
 */
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

/**
 * Validations
 */

/**
 * Getter
 */

/**
 * Schema
 */
var TriggerSchema = new Schema({
    alias: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    timeSpan: {
        cronStart: String,
        cronEnd: String,
        repeats: Number
    },
    socialTrigger: String,
    placeTrigger: String,
    healthTrigger: String,
    children: [{
        type: Schema.Types.ObjectId,
        ref: 'Trigger'
    }],
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
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

module.exports = mongoose.model('Trigger', TriggerSchema);
