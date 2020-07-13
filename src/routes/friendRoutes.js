const express = require('express');
const userController = require('../controllers/friendController');
const auth = require('../helpers/auth');
const friendController = require('../controllers/friendController');

const router = express.Router();


router.get('/', auth.requireLogin, friendController.friends);
router.get('/requests', auth.requireLogin, userController.requests);
router.get('/add/:username', auth.requireLogin, userController.add);
router.get('/remove/:username', auth.requireLogin, userController.remove);


module.exports = router;