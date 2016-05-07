var express = require('express');
var router = express.Router();
var triggerInstancesController = require('../controllers/triggerInstances');

/**
 * Get all
 */
router.get('/', triggerInstancesController.all);


/**
 * Get all by user
 */
router.get('/user/:userId', triggerInstancesController.allByUser);

/**
 * Get by id
 */
router.get('/:triggerInstanceId', triggerInstancesController.triggerInstance);

/**
 * Create
 */
router.post('/', triggerInstancesController.create);

/**
 * Update
 */
router.put('/', triggerInstancesController.update);

/**
 * Delete
 */
router.delete('/:triggerInstanceId', triggerInstancesController.destroy);

module.exports = router;
