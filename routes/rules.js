var express = require('express');
var router = express.Router();
var rulesController = require('../controllers/rules');

/**
 * Get all
 */
router.get('/', rulesController.all);

/**
 * Get by id
 */
router.get('/:ruleId', rulesController.rule);

/**
 * Create
 */
router.post('/', rulesController.create);

/**
 * Update
 */
router.put('/', rulesController.update);

/**
 * Delete
 */
router.delete('/:ruleId', rulesController.destroy);

module.exports = router;
