const express = require('express');
const userController = require('../controllers/friendController');
const friendController = require('../controllers/friendController');

const router = express.Router();


router.get('/', friendController.friends);
router.get('/requests', userController.requests);
router.get('/add/:username', userController.add);
router.get('/remove/:username', userController.remove);


module.exports = router;