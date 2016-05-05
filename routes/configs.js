var express = require('express');
var router = express.Router();
var configsController = require('../controllers/configs');

/**
 * Get all
 */
router.get('/', configsController.all);

/**
 * Get by id
 */
router.get('/:configId', configsController.config);

/**
 * Create
 */
router.post('/', configsController.create);

/**
 * Update
 */
router.put('/', configsController.update);

/**
 * Delete
 */
router.delete('/:configId', configsController.destroy);

module.exports = router;
