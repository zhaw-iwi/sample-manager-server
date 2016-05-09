var express = require('express');
var router = express.Router();
var actionsController = require('../controllers/actions');

/**
 * Start project by id
 */
router.get('/start/:projectId', actionsController.start);

/**
 * Start project by id
 */
router.get('/restart/:projectId', actionsController.restart);

/**
 * Start project by id
 */
router.post('/manualtrigger/:measureId', actionsController.triggerManual);

module.exports = router;
