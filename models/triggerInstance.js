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
var TriggerInstanceSchema = new Schema({
    nextTrigger: Date,
    lastTrigger: Date,
    triggersLeft: Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    measure: {
        type: Schema.Types.ObjectId,
        ref: 'Measure'
    },
    trigger: {
        type: Schema.Types.ObjectId,
        ref: 'Trigger'
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

module.exports = mongoose.model('TriggerInstance', TriggerInstanceSchema);
