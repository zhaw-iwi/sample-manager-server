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
var RecordSchema = new Schema({
    created: {
        type: Date,
        default: Date.now()
    },
    value: {
        type: String,
        required: true
    },
    location: [Number],
    repeats: Number,
    measure: {
        type: Schema.Types.ObjectId,
        ref: 'Measure'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
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

module.exports = mongoose.model('Record', RecordSchema);
