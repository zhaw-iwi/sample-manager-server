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
 * Get all for mobile user
 */
router.get('/mobile/:userId', projectsController.mobileProjects);

/**
 * Create
 */
router.post('/', projectsController.create);

/**
 * Update
 */
router.put('/', projectsController.update);

/**
 * Update user subscriptions
 */
router.put('/subscribe', projectsController.subscribe);

/**
 * Delete
 */
router.delete('/:projectId', projectsController.destroy);

module.exports = router;
