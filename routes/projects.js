var express = require('express');
var router = express.Router();
var projectsController = require('../controllers/projects');

/**
 * Get all
 */
router.get('/', projectsController.all);

/**
 * Get by id
 */
router.get('/:projectId', projectsController.project);

/**
 * Create
 */
router.post('/', projectsController.create);

/**
 * Update
 */
router.put('/', projectsController.update);

/**
 * Delete
 */
router.delete('/:projectId', projectsController.destroy);

module.exports = router;
