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
var RuleSchema = new Schema({
    begin: Number,
    end: Number,
    repeats: Number,
    measure: {
        type: Schema.Types.ObjectId,
        ref: 'Measure'
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

module.exports = mongoose.model('Rule', RuleSchema);
