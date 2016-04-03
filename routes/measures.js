var express = require('express');
var router = express.Router();
var measuresController = require('../controllers/measures');

/**
 * Get all
 */
router.get('/', measuresController.all);

/**
 * Get by id
 */
router.get('/:measureId', measuresController.measure);

/**
 * Create
 */
router.post('/', measuresController.create);

/**
 * Update
 */
router.put('/:measureId', measuresController.update);

/**
 * Delete
 */
router.delete('/:measureId', measuresController.destroy);

module.exports = router;
