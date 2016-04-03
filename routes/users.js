var express = require('express');
var router = express.Router();
var usersController = require('../controllers/users');

/**
 * Get all
 */
router.get('/', usersController.all);

/**
 * Get by id
 */
router.get('/:userId', usersController.user);

/**
 * Create
 */
router.post('/', usersController.create);

/**
 * Update
 */
router.put('/:userId', usersController.update);

/**
 * Delete
 */
router.delete('/:userId', usersController.destroy);

module.exports = router;
