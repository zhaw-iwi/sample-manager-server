var express = require('express');
var router = express.Router();
var recordsController = require('../controllers/records');

/**
 * Get all
 */
router.get('/', recordsController.all);

/**
 * Get by id
 */
router.get('/:recordId', recordsController.record);

/**
 * Create
 */
router.post('/', recordsController.create);

/**
 * Update
 */
router.put('/:recordId', recordsController.update);

/**
 * Delete
 */
router.delete('/:recordId', recordsController.destroy);

module.exports = router;
