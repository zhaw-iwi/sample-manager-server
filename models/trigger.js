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
    type: {
        type: String,
        required: true
    },
    cronExpression: [String],
    areaTrigger: String,
    socialTrigger: String,
    repeats: Number,
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
