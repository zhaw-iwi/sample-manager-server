var express = require('express');
var router = express.Router();
var triggersController = require('../controllers/triggers');

/**
 * Get all
 */
router.get('/', triggersController.all);

/**
 * Get by id
 */
router.get('/:triggerId', triggersController.trigger);

/**
 * Create
 */
router.post('/', triggersController.create);

/**
 * Update
 */
router.put('/', triggersController.update);

/**
 * Delete
 */
router.delete('/:triggerId', triggersController.destroy);

module.exports = router;
